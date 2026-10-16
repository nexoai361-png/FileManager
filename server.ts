import express from 'express';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { createServer as createViteServer } from 'vite';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface StorageLocation {
  id: string;
  name: string;
  path: string;
  description: string;
  isAvailable: boolean;
  isRemovable?: boolean;
}

// Utility: Check if a command is executable in PATH
async function isCommandAvailable(cmd: string): Promise<boolean> {
  try {
    await execAsync(`which ${cmd}`);
    return true;
  } catch {
    return false;
  }
}

// Check which Termux / Linux archive tools are installed
async function detectSystemTools() {
  const [hasTar, hasGzip, has7z, hasZip, hasUnzip, hasTermuxSetup] = await Promise.all([
    isCommandAvailable('tar'),
    isCommandAvailable('gzip'),
    isCommandAvailable('7z'),
    isCommandAvailable('zip'),
    isCommandAvailable('unzip'),
    isCommandAvailable('termux-setup-storage'),
  ]);

  return {
    tar: hasTar,
    gzip: hasGzip,
    p7zip: has7z,
    zip: hasZip,
    unzip: hasUnzip,
    termuxSetupStorage: hasTermuxSetup,
  };
}

// Check all accessible storage locations on Android / Termux
async function getStorageLocations(): Promise<StorageLocation[]> {
  const locations: StorageLocation[] = [];
  const homeDir = process.env.HOME || '/data/data/com.termux/files/home';

  // 1. Termux ~/storage/shared (Symlink created by termux-setup-storage)
  const termuxShared = path.join(homeDir, 'storage', 'shared');
  let hasTermuxShared = false;
  try {
    const stat = await fs.stat(termuxShared);
    if (stat.isDirectory()) {
      hasTermuxShared = true;
      locations.push({
        id: 'termux-shared',
        name: 'Internal Shared Storage',
        path: termuxShared,
        description: 'Android main storage (~/storage/shared -> /storage/emulated/0)',
        isAvailable: true,
      });
    }
  } catch {}

  // 2. Direct Android /storage/emulated/0
  if (!hasTermuxShared) {
    try {
      const stat = await fs.stat('/storage/emulated/0');
      if (stat.isDirectory()) {
        locations.push({
          id: 'android-internal',
          name: 'Internal Storage',
          path: '/storage/emulated/0',
          description: 'Android internal user storage (/storage/emulated/0)',
          isAvailable: true,
        });
      }
    } catch {}
  }

  // 3. Termux Home Directory (~/)
  try {
    const stat = await fs.stat(homeDir);
    if (stat.isDirectory()) {
      locations.push({
        id: 'termux-home',
        name: 'Termux Home',
        path: homeDir,
        description: 'Termux private user workspace (~)',
        isAvailable: true,
      });
    }
  } catch {}

  // 4. Termux SD Card / External storage symlink
  const termuxExt = path.join(homeDir, 'storage', 'external-1');
  try {
    const stat = await fs.stat(termuxExt);
    if (stat.isDirectory()) {
      locations.push({
        id: 'termux-sdcard',
        name: 'MicroSD / USB Drive',
        path: termuxExt,
        description: 'External removable storage (~/storage/external-1)',
        isAvailable: true,
        isRemovable: true,
      });
    }
  } catch {}

  // 5. Fallback local folder if outside Android
  if (locations.length === 0 || !locations.some((l) => l.id.includes('internal') || l.id.includes('shared'))) {
    const fallbackPath = path.resolve(process.cwd(), 'storage');
    try {
      await fs.mkdir(fallbackPath, { recursive: true });
      const subDirs = ['DCIM', 'Documents', 'Download', 'Movies', 'Music', 'Pictures'];
      for (const dir of subDirs) {
        await fs.mkdir(path.join(fallbackPath, dir), { recursive: true });
      }
      const welcome = path.join(fallbackPath, 'Documents', 'Welcome_Termux.txt');
      try {
        await fs.access(welcome);
      } catch {
        await fs.writeFile(
          welcome,
          'Termux Android File Manager & Archive Tool\n\n' +
            'Real Android Storage Access:\n' +
            '1. Open Termux terminal.\n' +
            '2. Run: termux-setup-storage\n' +
            '3. Grant the Android system storage permission.\n' +
            '4. Restart this app to browse all your real Android files, SD card, and archives!\n',
          'utf-8'
        );
      }
      locations.unshift({
        id: 'default-storage',
        name: 'App Storage',
        path: fallbackPath,
        description: 'Local workspace storage folder',
        isAvailable: true,
      });
    } catch {}
  }

  return locations;
}

function formatBytes(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPermissions(mode: number): string {
  const isDir = (mode & 0o40000) !== 0;
  const perms = [
    isDir ? 'd' : '-',
    mode & 0o400 ? 'r' : '-',
    mode & 0o200 ? 'w' : '-',
    mode & 0o100 ? 'x' : '-',
    mode & 0o040 ? 'r' : '-',
    mode & 0o020 ? 'w' : '-',
    mode & 0o010 ? 'x' : '-',
    mode & 0o004 ? 'r' : '-',
    mode & 0o002 ? 'w' : '-',
    mode & 0o001 ? 'x' : '-',
  ];
  return perms.join('');
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Detect storage roots
  let storageLocations = await getStorageLocations();
  let activeLocation = storageLocations[0] || {
    id: 'default',
    name: 'Storage',
    path: path.resolve(process.cwd(), 'storage'),
    description: 'Storage root',
    isAvailable: true,
  };

  console.log(`[Storage] Primary Storage: ${activeLocation.name} (${activeLocation.path})`);
  console.log(`[Storage] Available Locations: ${storageLocations.map((l) => l.name).join(', ')}`);

  // Path resolver that keeps operations within the designated storage roots
  function resolveSafePath(subPath: string = '', locationId?: string): string {
    const loc = storageLocations.find((l) => l.id === locationId) || activeLocation;
    const cleaned = subPath.replace(/^(\.\.[\/\\])+/, '').replace(/^\/+/, '');
    const resolved = path.resolve(loc.path, cleaned);

    // Verify it stays within loc.path or realpath
    let realBase = loc.path;
    try {
      realBase = fsSync.realpathSync(loc.path);
    } catch {}

    let realResolved = resolved;
    try {
      if (fsSync.existsSync(resolved)) {
        realResolved = fsSync.realpathSync(resolved);
      }
    } catch {}

    if (!resolved.startsWith(loc.path) && !realResolved.startsWith(realBase)) {
      throw new Error('Access denied: Outside storage path');
    }
    return resolved;
  }

  // -------------------------------------------------------------------------
  // 1. Termux & Storage Status Endpoint
  // -------------------------------------------------------------------------
  app.get('/api/termux/status', async (req, res) => {
    try {
      storageLocations = await getStorageLocations();
      const tools = await detectSystemTools();
      const isTermux =
        Boolean(process.env.TERMUX_VERSION) ||
        fsSync.existsSync('/data/data/com.termux/files/usr') ||
        fsSync.existsSync('/data/data/com.termux');

      const homeDir = process.env.HOME || '/data/data/com.termux/files/home';
      const termuxStorageDir = path.join(homeDir, 'storage');
      const hasTermuxStorageFolder = fsSync.existsSync(termuxStorageDir);

      let hasStoragePermission = false;
      const testPaths = ['/storage/emulated/0', path.join(homeDir, 'storage', 'shared')];
      for (const p of testPaths) {
        try {
          if (fsSync.existsSync(p)) {
            await fs.readdir(p);
            hasStoragePermission = true;
            break;
          }
        } catch {}
      }

      res.json({
        success: true,
        isTermux,
        hasStoragePermission,
        hasTermuxStorageFolder,
        tools,
        locations: storageLocations,
        activeLocationId: activeLocation.id,
        homeDir,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Switch active storage location (e.g. Internal Storage <-> Termux Home <-> SD Card)
  app.post('/api/termux/switch-location', async (req, res) => {
    try {
      const { locationId } = req.body;
      const target = storageLocations.find((l) => l.id === locationId);
      if (!target) {
        return res.status(404).json({ success: false, error: 'Storage location not found' });
      }
      activeLocation = target;
      console.log(`[Storage] Switched active location to: ${target.name} (${target.path})`);
      res.json({ success: true, activeLocation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Trigger `termux-setup-storage`
  app.post('/api/termux/setup-storage', async (req, res) => {
    try {
      const tools = await detectSystemTools();
      if (!tools.termuxSetupStorage) {
        return res.json({
          success: false,
          error:
            'termux-setup-storage utility is not installed in current environment. Run this command manually in Termux terminal: termux-setup-storage',
        });
      }

      // Execute termux-setup-storage
      exec('termux-setup-storage', (err, stdout, stderr) => {
        if (err) {
          console.error('[Termux] termux-setup-storage error:', err);
        } else {
          console.log('[Termux] termux-setup-storage triggered');
        }
      });

      res.json({
        success: true,
        message:
          'termux-setup-storage executed. Look at your Android screen and tap "ALLOW" on the Android permission popup!',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 2. Storage Metric & Recents Info
  // -------------------------------------------------------------------------
  app.get('/api/storage-info', async (req, res) => {
    try {
      let totalBytes = 64 * 1024 * 1024 * 1024;
      let freeBytes = 32 * 1024 * 1024 * 1024;
      let usedBytes = 32 * 1024 * 1024 * 1024;

      try {
        const stats = await fs.statfs(activeLocation.path);
        totalBytes = stats.bsize * stats.blocks;
        freeBytes = stats.bsize * stats.bfree;
        usedBytes = totalBytes - freeBytes;
      } catch {}

      const usedPercent = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(1) : '50.0';

      // Scan priority folders for recent files
      const recentFiles: any[] = [];
      const priorityFolders = ['', 'Download', 'Documents', 'Pictures', 'DCIM', 'Music', 'Movies'];

      for (const pFolder of priorityFolders) {
        try {
          const dir = path.join(activeLocation.path, pFolder);
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isFile() && !entry.name.startsWith('.')) {
              const fullPath = path.join(dir, entry.name);
              try {
                const s = await fs.stat(fullPath);
                recentFiles.push({
                  id: Buffer.from(path.relative(activeLocation.path, fullPath)).toString('base64'),
                  name: entry.name,
                  type: 'file',
                  sizeBytes: s.size,
                  sizeFormatted: formatBytes(s.size),
                  modifiedDate: formatDate(s.mtime),
                  mtimeMs: s.mtimeMs,
                  path: pFolder ? [pFolder] : [],
                });
              } catch {}
            }
          }
        } catch {}
      }

      recentFiles.sort((a, b) => b.mtimeMs - a.mtimeMs);

      res.json({
        success: true,
        storageLabel: activeLocation.name,
        storageRoot: activeLocation.path,
        totalBytes,
        usedBytes,
        freeBytes,
        totalFormatted: formatBytes(totalBytes),
        usedFormatted: formatBytes(usedBytes),
        freeFormatted: formatBytes(freeBytes),
        usedPercent,
        recentFiles: recentFiles.slice(0, 6),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 3. Directory Listing & Inspection
  // -------------------------------------------------------------------------
  app.get('/api/files', async (req, res) => {
    try {
      const subPath = (req.query.path as string) || '';
      const locationId = req.query.locationId as string | undefined;
      const targetDir = resolveSafePath(subPath, locationId);

      let entries;
      try {
        entries = await fs.readdir(targetDir, { withFileTypes: true });
      } catch (err: any) {
        if (err.code === 'EACCES' || err.code === 'EPERM') {
          return res.json({
            success: true,
            items: [],
            restricted: true,
            error:
              'Access restricted by Android OS Scoped Storage. To access shared storage, run `termux-setup-storage` in Termux and grant permission.',
            currentPath: subPath,
          });
        }
        throw err;
      }

      const items = [];
      const ARCHIVE_EXTS = ['zip', 'tar', 'gz', 'tgz', '7z', 'rar', 'bz2', 'xz', 'tbz2', 'txz'];

      for (const entry of entries) {
        const fullPath = path.join(targetDir, entry.name);
        try {
          const stats = await fs.stat(fullPath);
          let type: 'folder' | 'file' | 'archive' = 'file';
          const ext = entry.name.split('.').pop()?.toLowerCase() || '';

          if (entry.isDirectory()) {
            type = 'folder';
          } else if (ARCHIVE_EXTS.includes(ext) || entry.name.toLowerCase().endsWith('.tar.gz')) {
            type = 'archive';
          }

          items.push({
            id: Buffer.from(path.relative(activeLocation.path, fullPath) || entry.name).toString('base64'),
            name: entry.name,
            type,
            sizeBytes: stats.size,
            sizeFormatted: formatBytes(stats.size),
            modifiedDate: formatDate(stats.mtime),
            permissions: formatPermissions(stats.mode),
            path: path.relative(activeLocation.path, fullPath),
          });
        } catch {
          items.push({
            id: Buffer.from(entry.name).toString('base64'),
            name: entry.name,
            type: entry.isDirectory() ? 'folder' : 'file',
            sizeBytes: 0,
            sizeFormatted: '0 B',
            modifiedDate: 'Unknown',
            permissions: '---------',
            path: path.relative(activeLocation.path, fullPath),
          });
        }
      }

      res.json({ success: true, items, currentPath: subPath, location: activeLocation });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // -------------------------------------------------------------------------
  // 4. Recursive Real Filesystem Search
  // -------------------------------------------------------------------------
  app.get('/api/files/search', async (req, res) => {
    try {
      const subPath = (req.query.path as string) || '';
      const query = ((req.query.query as string) || '').trim().toLowerCase();
      const baseDir = resolveSafePath(subPath);

      if (!query) {
        return res.json({ success: true, results: [] });
      }

      const results: any[] = [];
      const MAX_RESULTS = 150;
      const MAX_DEPTH = 6;
      const ARCHIVE_EXTS = ['zip', 'tar', 'gz', 'tgz', '7z', 'rar', 'bz2', 'xz'];

      async function walk(dir: string, currentDepth: number) {
        if (currentDepth > MAX_DEPTH || results.length >= MAX_RESULTS) return;

        let entries;
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
          return;
        }

        for (const entry of entries) {
          if (results.length >= MAX_RESULTS) break;
          // Skip android data/obb or hidden git folders
          if (entry.name === '.git' || entry.name === 'node_modules') continue;

          const fullPath = path.join(dir, entry.name);
          const relPath = path.relative(activeLocation.path, fullPath);

          if (entry.name.toLowerCase().includes(query)) {
            try {
              const stats = await fs.stat(fullPath);
              let type: 'folder' | 'file' | 'archive' = 'file';
              const ext = entry.name.split('.').pop()?.toLowerCase() || '';
              if (entry.isDirectory()) {
                type = 'folder';
              } else if (ARCHIVE_EXTS.includes(ext)) {
                type = 'archive';
              }

              results.push({
                id: Buffer.from(relPath).toString('base64'),
                name: entry.name,
                type,
                sizeBytes: stats.size,
                sizeFormatted: formatBytes(stats.size),
                modifiedDate: formatDate(stats.mtime),
                path: relPath,
                parentDir: path.dirname(relPath) === '.' ? '' : path.dirname(relPath),
              });
            } catch {}
          }

          if (entry.isDirectory()) {
            await walk(fullPath, currentDepth + 1);
          }
        }
      }

      await walk(baseDir, 0);

      res.json({ success: true, query, results, count: results.length });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 5. Streaming File Serving (Handles Multi-Gigabyte & Range Requests)
  // -------------------------------------------------------------------------
  app.get('/api/files/raw', async (req, res) => {
    try {
      const filePath = (req.query.path as string) || '';
      const target = resolveSafePath(filePath);
      const stat = await fs.stat(target);

      if (stat.isDirectory()) {
        return res.status(400).send('Cannot stream directory');
      }

      const range = req.headers.range;
      const fileSize = stat.size;

      if (range) {
        // HTTP 206 Partial Content (essential for audio/video seeking and resumable downloads)
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'application/octet-stream',
        });

        const fileStream = fsSync.createReadStream(target, { start, end });
        fileStream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `inline; filename="${encodeURIComponent(path.basename(target))}"`,
        });
        const fileStream = fsSync.createReadStream(target);
        fileStream.pipe(res);
      }
    } catch (err) {
      res.status(404).send('File not found');
    }
  });

  // -------------------------------------------------------------------------
  // 6. File Read / Inspection
  // -------------------------------------------------------------------------
  app.get('/api/files/read', async (req, res) => {
    try {
      const filePath = (req.query.path as string) || '';
      const target = resolveSafePath(filePath);
      const stats = await fs.stat(target);
      const ext = path.extname(target).toLowerCase().replace('.', '');

      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
      const isAudio = ['mp3', 'ogg', 'wav', 'm4a', 'flac', 'aac', 'opus'].includes(ext);
      const isVideo = ['mp4', 'mkv', 'webm', 'mov', '3gp'].includes(ext);
      const isPdf = ext === 'pdf';

      if (isImage || isAudio || isVideo || isPdf) {
        return res.json({
          success: true,
          mediaType: isImage ? 'image' : isAudio ? 'audio' : isVideo ? 'video' : 'pdf',
          rawUrl: `/api/files/raw?path=${encodeURIComponent(filePath)}`,
          sizeBytes: stats.size,
          sizeFormatted: formatBytes(stats.size),
          modifiedDate: formatDate(stats.mtime),
          fileName: path.basename(target),
          permissions: formatPermissions(stats.mode),
        });
      }

      // If file is > 2 MB, do not load whole file into memory as string
      if (stats.size > 2 * 1024 * 1024) {
        return res.json({
          success: true,
          mediaType: 'large',
          content: `[File size: ${formatBytes(stats.size)} exceeds text preview threshold. Use download/open to view this file.]`,
          rawUrl: `/api/files/raw?path=${encodeURIComponent(filePath)}`,
          sizeBytes: stats.size,
          sizeFormatted: formatBytes(stats.size),
          modifiedDate: formatDate(stats.mtime),
          fileName: path.basename(target),
          permissions: formatPermissions(stats.mode),
        });
      }

      const content = await fs.readFile(target, 'utf-8');
      res.json({
        success: true,
        mediaType: 'text',
        content,
        rawUrl: `/api/files/raw?path=${encodeURIComponent(filePath)}`,
        sizeBytes: stats.size,
        sizeFormatted: formatBytes(stats.size),
        modifiedDate: formatDate(stats.mtime),
        fileName: path.basename(target),
        permissions: formatPermissions(stats.mode),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // -------------------------------------------------------------------------
  // 7. File Details (Detailed Metadata & Permissions)
  // -------------------------------------------------------------------------
  app.get('/api/files/details', async (req, res) => {
    try {
      const filePath = (req.query.path as string) || '';
      const target = resolveSafePath(filePath);
      const stats = await fs.stat(target);

      res.json({
        success: true,
        name: path.basename(target),
        path: filePath,
        fullPath: target,
        isDirectory: stats.isDirectory(),
        sizeBytes: stats.size,
        sizeFormatted: formatBytes(stats.size),
        permissions: formatPermissions(stats.mode),
        modeOctal: (stats.mode & 0o777).toString(8),
        modifiedDate: formatDate(stats.mtime),
        birthDate: formatDate(stats.birthtime),
        uid: stats.uid,
        gid: stats.gid,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 8. Basic File Operations (Create, Rename, Delete)
  // -------------------------------------------------------------------------
  app.post('/api/files/create-folder', async (req, res) => {
    try {
      const { parentPath, name } = req.body;
      if (!name || name.includes('/') || name.includes('\\')) {
        return res.status(400).json({ success: false, error: 'Invalid folder name' });
      }
      const targetDir = resolveSafePath(path.join(parentPath || '', name));
      await fs.mkdir(targetDir, { recursive: true });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/files/create-file', async (req, res) => {
    try {
      const { parentPath, name, content } = req.body;
      if (!name || name.includes('/') || name.includes('\\')) {
        return res.status(400).json({ success: false, error: 'Invalid file name' });
      }
      const targetFile = resolveSafePath(path.join(parentPath || '', name));
      await fs.writeFile(targetFile, content ?? '', 'utf-8');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/files/rename', async (req, res) => {
    try {
      const { oldPath, newName } = req.body;
      if (!newName || newName.includes('/') || newName.includes('\\')) {
        return res.status(400).json({ success: false, error: 'Invalid target name' });
      }
      const oldTarget = resolveSafePath(oldPath);
      const parentDir = path.dirname(oldTarget);
      const newTarget = path.join(parentDir, newName);
      await fs.rename(oldTarget, newTarget);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/files/delete', async (req, res) => {
    try {
      const { targetPath } = req.body;
      const target = resolveSafePath(targetPath);
      await fs.rm(target, { recursive: true, force: true });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Batch delete
  app.post('/api/files/batch-delete', async (req, res) => {
    try {
      const { paths } = req.body;
      if (!Array.isArray(paths) || paths.length === 0) {
        return res.status(400).json({ success: false, error: 'No paths provided for deletion' });
      }

      let deletedCount = 0;
      const errors: string[] = [];

      for (const p of paths) {
        try {
          const target = resolveSafePath(p);
          await fs.rm(target, { recursive: true, force: true });
          deletedCount++;
        } catch (e: any) {
          errors.push(`${p}: ${e.message}`);
        }
      }

      res.json({ success: true, deletedCount, errors: errors.length > 0 ? errors : undefined });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 9. Clipboard Operations: Copy & Move (Handles Large Files & Recursion)
  // -------------------------------------------------------------------------
  app.post('/api/files/copy', async (req, res) => {
    try {
      const { sourcePaths, destinationDir } = req.body;
      if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
        return res.status(400).json({ success: false, error: 'No source files selected' });
      }

      const destTargetDir = resolveSafePath(destinationDir || '');
      const copied: string[] = [];

      for (const src of sourcePaths) {
        const srcTarget = resolveSafePath(src);
        const itemName = path.basename(srcTarget);
        let destTarget = path.join(destTargetDir, itemName);

        // If duplicate in same folder, create a numbered copy (e.g. file (1).txt)
        if (srcTarget === destTarget) {
          const ext = path.extname(itemName);
          const baseName = path.basename(itemName, ext);
          destTarget = path.join(destTargetDir, `${baseName} (Copy)${ext}`);
        }

        await fs.cp(srcTarget, destTarget, { recursive: true, force: true });
        copied.push(itemName);
      }

      res.json({ success: true, copiedCount: copied.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/files/move', async (req, res) => {
    try {
      const { sourcePaths, destinationDir } = req.body;
      if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
        return res.status(400).json({ success: false, error: 'No source files selected' });
      }

      const destTargetDir = resolveSafePath(destinationDir || '');
      const moved: string[] = [];

      for (const src of sourcePaths) {
        const srcTarget = resolveSafePath(src);
        const itemName = path.basename(srcTarget);
        const destTarget = path.join(destTargetDir, itemName);

        if (srcTarget === destTarget) continue;

        try {
          // Attempt atomic rename first
          await fs.rename(srcTarget, destTarget);
        } catch (err: any) {
          // If cross-device (EXDEV), fallback to cp + rm
          if (err.code === 'EXDEV') {
            await fs.cp(srcTarget, destTarget, { recursive: true, force: true });
            await fs.rm(srcTarget, { recursive: true, force: true });
          } else {
            throw err;
          }
        }
        moved.push(itemName);
      }

      res.json({ success: true, movedCount: moved.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // -------------------------------------------------------------------------
  // 10. ZArchiver Features: Archive Compression (ZIP, 7Z, TAR, GZ)
  // -------------------------------------------------------------------------
  app.post('/api/archive/compress', async (req, res) => {
    try {
      const { sourcePaths, archiveName, format, destinationDir } = req.body;
      if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
        return res.status(400).json({ success: false, error: 'Please select files or folders to compress' });
      }
      if (!archiveName) {
        return res.status(400).json({ success: false, error: 'Please enter an archive name' });
      }

      const destDir = resolveSafePath(destinationDir || '');
      const finalArchiveName = archiveName.endsWith(`.${format}`)
        ? archiveName
        : format === 'tar.gz'
          ? (archiveName.endsWith('.tgz') || archiveName.endsWith('.tar.gz') ? archiveName : `${archiveName}.tar.gz`)
          : `${archiveName}.${format}`;

      const outArchivePath = path.join(destDir, finalArchiveName);

      // Resolve all sources relative to their common parent directory or destDir
      const resolvedSources = sourcePaths.map((sp) => resolveSafePath(sp));
      const commonDir = path.dirname(resolvedSources[0]);
      const fileNames = resolvedSources.map((sp) => path.relative(commonDir, sp));

      const tools = await detectSystemTools();

      // Execute based on format
      if (format === '7z') {
        if (!tools.p7zip) {
          return res.status(400).json({
            success: false,
            error: '7Z tool is not installed. To enable 7Z support in Termux, run: pkg install p7zip -y',
          });
        }
        // 7z a -r "<outArchivePath>" <files...>
        const args = ['a', '-y', outArchivePath, ...fileNames];
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('7z', args, { cwd: commonDir });
          let stderr = '';
          proc.stderr.on('data', (d) => (stderr += d.toString()));
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`7z exited with code ${code}: ${stderr}`));
          });
          proc.on('error', reject);
        });
      } else if (format === 'zip') {
        if (tools.zip) {
          // Use zip command: zip -r "<outArchivePath>" <files...>
          const args = ['-r', '-q', outArchivePath, ...fileNames];
          await new Promise<void>((resolve, reject) => {
            const proc = spawn('zip', args, { cwd: commonDir });
            let stderr = '';
            proc.stderr.on('data', (d) => (stderr += d.toString()));
            proc.on('close', (code) => {
              if (code === 0) resolve();
              else reject(new Error(`zip exited with code ${code}: ${stderr}`));
            });
            proc.on('error', reject);
          });
        } else if (tools.p7zip) {
          // Fallback to 7z -tzip
          const args = ['a', '-tzip', '-y', outArchivePath, ...fileNames];
          await new Promise<void>((resolve, reject) => {
            const proc = spawn('7z', args, { cwd: commonDir });
            proc.on('close', (code) => {
              if (code === 0) resolve();
              else reject(new Error(`7z zip compression exited with code ${code}`));
            });
            proc.on('error', reject);
          });
        } else {
          return res.status(400).json({
            success: false,
            error: 'ZIP tool is not installed. In Termux run: pkg install zip p7zip -y',
          });
        }
      } else if (format === 'tar') {
        // tar -cf "<outArchivePath>" <files...>
        const args = ['-cf', outArchivePath, ...fileNames];
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('tar', args, { cwd: commonDir });
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`tar exited with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else if (format === 'tar.gz' || format === 'gz') {
        // tar -czf "<outArchivePath>" <files...>
        const args = ['-czf', outArchivePath, ...fileNames];
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('tar', args, { cwd: commonDir });
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`tar.gz compression exited with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else {
        return res.status(400).json({ success: false, error: `Unsupported compression format: ${format}` });
      }

      const createdStat = await fs.stat(outArchivePath);
      res.json({
        success: true,
        archiveName: finalArchiveName,
        sizeBytes: createdStat.size,
        sizeFormatted: formatBytes(createdStat.size),
      });
    } catch (err: any) {
      console.error('[Archive Compress Error]', err);
      res.status(500).json({ success: false, error: err.message || 'Compression failed' });
    }
  });

  // -------------------------------------------------------------------------
  // 11. ZArchiver Features: Archive Extraction
  // -------------------------------------------------------------------------
  app.post('/api/archive/extract', async (req, res) => {
    try {
      const { archivePath, destinationDir, createFolder } = req.body;
      if (!archivePath) {
        return res.status(400).json({ success: false, error: 'No archive path specified' });
      }

      const targetArchive = resolveSafePath(archivePath);
      let outDir = resolveSafePath(destinationDir || path.dirname(archivePath));

      const archiveBaseName = path.basename(targetArchive);
      const extMatch = archiveBaseName.match(/\.(tar\.gz|tgz|tar\.bz2|tbz2|tar\.xz|txz|zip|7z|tar|gz|rar|bz2|xz)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : path.extname(archiveBaseName).toLowerCase().replace('.', '');

      if (createFolder) {
        const folderName = archiveBaseName.replace(/\.(tar\.gz|tgz|tar\.bz2|tbz2|tar\.xz|txz|zip|7z|tar|gz|rar|bz2|xz)$/i, '');
        outDir = path.join(outDir, folderName);
      }

      await fs.mkdir(outDir, { recursive: true });

      const tools = await detectSystemTools();

      if (ext === 'zip') {
        if (tools.unzip) {
          // unzip -o -q "<targetArchive>" -d "<outDir>"
          await new Promise<void>((resolve, reject) => {
            const proc = spawn('unzip', ['-o', '-q', targetArchive, '-d', outDir]);
            proc.on('close', (code) => {
              if (code === 0 || code === 1) resolve(); // unzip returns 1 on harmless warnings
              else reject(new Error(`unzip failed with code ${code}`));
            });
            proc.on('error', reject);
          });
        } else if (tools.p7zip) {
          // 7z x -y -o"<outDir>" "<targetArchive>"
          await new Promise<void>((resolve, reject) => {
            const proc = spawn('7z', ['x', '-y', `-o${outDir}`, targetArchive]);
            proc.on('close', (code) => {
              if (code === 0) resolve();
              else reject(new Error(`7z extraction failed with code ${code}`));
            });
            proc.on('error', reject);
          });
        } else {
          return res.status(400).json({
            success: false,
            error: 'Neither unzip nor 7z tool is installed. In Termux run: pkg install unzip p7zip -y',
          });
        }
      } else if (ext === '7z' || ext === 'rar') {
        if (!tools.p7zip) {
          return res.status(400).json({
            success: false,
            error: `Tool 7z is required to extract .${ext} files. In Termux run: pkg install p7zip -y`,
          });
        }
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('7z', ['x', '-y', `-o${outDir}`, targetArchive]);
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`7z extraction exited with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else if (ext === 'tar') {
        // tar -xf "<targetArchive>" -C "<outDir>"
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('tar', ['-xf', targetArchive, '-C', outDir]);
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`tar extraction failed with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else if (ext === 'tar.gz' || ext === 'tgz') {
        // tar -xzf "<targetArchive>" -C "<outDir>"
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('tar', ['-xzf', targetArchive, '-C', outDir]);
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`tar.gz extraction failed with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else if (ext === 'tar.bz2' || ext === 'tbz2') {
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('tar', ['-xjf', targetArchive, '-C', outDir]);
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`tar.bz2 extraction failed with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else if (ext === 'tar.xz' || ext === 'txz') {
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('tar', ['-xJf', targetArchive, '-C', outDir]);
          proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`tar.xz extraction failed with code ${code}`));
          });
          proc.on('error', reject);
        });
      } else if (ext === 'gz') {
        // Single file gunzip
        if (tools.gzip) {
          const decompressedName = archiveBaseName.replace(/\.gz$/i, '');
          const destFile = path.join(outDir, decompressedName);
          await execAsync(`gzip -dc "${targetArchive}" > "${destFile}"`);
        } else {
          return res.status(400).json({ success: false, error: 'gzip tool is missing. In Termux run: pkg install gzip -y' });
        }
      } else {
        // General fallback to 7z
        if (tools.p7zip) {
          await new Promise<void>((resolve, reject) => {
            const proc = spawn('7z', ['x', '-y', `-o${outDir}`, targetArchive]);
            proc.on('close', (code) => {
              if (code === 0) resolve();
              else reject(new Error(`7z extraction exited with code ${code}`));
            });
            proc.on('error', reject);
          });
        } else {
          return res.status(400).json({ success: false, error: `Unsupported archive format: .${ext}` });
        }
      }

      res.json({
        success: true,
        extractedTo: path.relative(activeLocation.path, outDir),
      });
    } catch (err: any) {
      console.error('[Archive Extract Error]', err);
      res.status(500).json({ success: false, error: err.message || 'Extraction failed' });
    }
  });

  // -------------------------------------------------------------------------
  // 12. ZArchiver Features: View Inside Archive Without Extracting
  // -------------------------------------------------------------------------
  app.get('/api/archive/list', async (req, res) => {
    try {
      const archivePath = (req.query.path as string) || '';
      if (!archivePath) {
        return res.status(400).json({ success: false, error: 'No archive path specified' });
      }

      const targetArchive = resolveSafePath(archivePath);
      const tools = await detectSystemTools();
      const extMatch = path.basename(targetArchive).match(/\.(tar\.gz|tgz|tar\.bz2|tbz2|tar\.xz|txz|zip|7z|tar|gz|rar)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : path.extname(targetArchive).toLowerCase().replace('.', '');

      const entries: Array<{
        name: string;
        path: string;
        sizeBytes: number;
        sizeFormatted: string;
        date: string;
        isDirectory: boolean;
      }> = [];

      if ((ext === 'zip' || ext === '7z' || ext === 'rar') && tools.p7zip) {
        // Use 7z l -slt for clean machine-readable output
        const { stdout } = await execAsync(`7z l -slt "${targetArchive}"`);
        const blocks = stdout.split(/\n\s*\n/);

        for (const block of blocks) {
          const lines = block.split('\n');
          let itemPath = '';
          let size = 0;
          let mtime = '';
          let isDir = false;

          for (const line of lines) {
            if (line.startsWith('Path = ')) itemPath = line.substring(7).trim();
            if (line.startsWith('Size = ')) size = parseInt(line.substring(7).trim(), 10) || 0;
            if (line.startsWith('Modified = ')) mtime = line.substring(11).trim();
            if (line.startsWith('Folder = +')) isDir = true;
            if (line.startsWith('Attributes = D')) isDir = true;
          }

          if (itemPath && itemPath !== path.basename(targetArchive) && itemPath !== targetArchive) {
            entries.push({
              name: path.basename(itemPath),
              path: itemPath,
              sizeBytes: size,
              sizeFormatted: formatBytes(size),
              date: mtime || 'Unknown',
              isDirectory: isDir,
            });
          }
        }
      } else if (ext === 'zip' && tools.unzip) {
        // Fallback to unzip -l
        const { stdout } = await execAsync(`unzip -l "${targetArchive}"`);
        const lines = stdout.split('\n');
        for (const line of lines) {
          const match = line.trim().match(/^(\d+)\s+([\d\-]+)\s+([\d:]+)\s+(.+)$/);
          if (match) {
            const size = parseInt(match[1], 10);
            const date = `${match[2]} ${match[3]}`;
            const itemPath = match[4];
            if (itemPath.startsWith('---') || itemPath.includes('files')) continue;
            entries.push({
              name: path.basename(itemPath),
              path: itemPath,
              sizeBytes: size,
              sizeFormatted: formatBytes(size),
              date,
              isDirectory: itemPath.endsWith('/'),
            });
          }
        }
      } else if (ext === 'tar' || ext === 'tar.gz' || ext === 'tgz' || ext === 'tar.bz2' || ext === 'tar.xz') {
        // Use tar -tvf
        const tarFlag = ext.includes('gz') ? '-ztvf' : ext.includes('bz2') ? '-jtvf' : ext.includes('xz') ? '-Jtvf' : '-tvf';
        const { stdout } = await execAsync(`tar ${tarFlag} "${targetArchive}"`);
        const lines = stdout.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          // Example: -rw-r--r-- 1000/1000  1234 2026-10-15 12:00 myfolder/test.txt
          const tokens = line.trim().split(/\s+/);
          if (tokens.length >= 6) {
            const isDir = tokens[0].startsWith('d');
            const size = parseInt(tokens[2], 10) || 0;
            const date = `${tokens[3]} ${tokens[4]}`;
            const itemPath = tokens.slice(5).join(' ');
            entries.push({
              name: path.basename(itemPath),
              path: itemPath,
              sizeBytes: size,
              sizeFormatted: formatBytes(size),
              date,
              isDirectory: isDir || itemPath.endsWith('/'),
            });
          }
        }
      }

      res.json({
        success: true,
        archiveName: path.basename(targetArchive),
        archivePath,
        items: entries,
        count: entries.length,
      });
    } catch (err: any) {
      console.error('[Archive List Error]', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to list archive contents' });
    }
  });

  // -------------------------------------------------------------------------
  // Vite Middleware in Dev, Static in Prod
  // -------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Android File Manager (ZArchiver Engine) running at http://0.0.0.0:${PORT}`);
    console.log(`Storage: ${activeLocation.name} -> ${activeLocation.path}`);
  });
}

startServer();
