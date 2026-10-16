import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Determine base storage path (supports Termux /sdcard or local folder)
  const defaultStorage = path.join(process.cwd(), 'storage');
  const storageRoot = process.env.STORAGE_PATH || defaultStorage;

  // Ensure storage root exists and has some initial sample files if empty
  try {
    await fs.mkdir(storageRoot, { recursive: true });
    const files = await fs.readdir(storageRoot);
    if (files.length === 0) {
      // Create initial sample files for first run
      await fs.mkdir(path.join(storageRoot, 'Documents'), { recursive: true });
      await fs.mkdir(path.join(storageRoot, 'Download'), { recursive: true });
      await fs.writeFile(path.join(storageRoot, 'notes.txt'), 'Welcome to Real File Manager!\nRunning on Node.js / Termux.', 'utf-8');
      await fs.writeFile(path.join(storageRoot, 'Documents', 'Quarterly_Budget.pdf'), '[PDF Binary Data]', 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing storage root:', err);
  }

  // Helper to resolve safe path
  function resolveSafePath(subPath: string = '') {
    const cleaned = subPath.replace(/^\/+/, '');
    const resolved = path.resolve(storageRoot, cleaned);
    if (!resolved.startsWith(path.resolve(storageRoot))) {
      throw new Error('Access denied: Outside storage root');
    }
    return resolved;
  }

  // API: List files
  app.get('/api/files', async (req, res) => {
    try {
      const subPath = (req.query.path as string) || '';
      const targetDir = resolveSafePath(subPath);

      const entries = await fs.readdir(targetDir, { withFileTypes: true });
      const items = [];

      for (const entry of entries) {
        const fullPath = path.join(targetDir, entry.name);
        const stats = await fs.stat(fullPath);
        
        let type: 'folder' | 'file' | 'archive' = 'file';
        if (entry.isDirectory()) {
          type = 'folder';
        } else if (['zip', 'tar', 'gz', '7z', 'rar'].includes(entry.name.split('.').pop()?.toLowerCase() || '')) {
          type = 'archive';
        }

        items.push({
          id: Buffer.from(fullPath).toString('base64'),
          name: entry.name,
          type,
          sizeBytes: stats.size,
          sizeFormatted: formatBytes(stats.size),
          modifiedDate: formatDate(stats.mtime),
          path: path.relative(storageRoot, fullPath),
        });
      }

      res.json({ success: true, items, currentPath: subPath });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Read file content
  app.get('/api/files/read', async (req, res) => {
    try {
      const filePath = (req.query.path as string) || '';
      const target = resolveSafePath(filePath);
      const content = await fs.readFile(target, 'utf-8');
      res.json({ success: true, content });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Create folder
  app.post('/api/files/create-folder', async (req, res) => {
    try {
      const { parentPath, name } = req.body;
      const targetDir = resolveSafePath(path.join(parentPath || '', name));
      await fs.mkdir(targetDir, { recursive: true });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Create file
  app.post('/api/files/create-file', async (req, res) => {
    try {
      const { parentPath, name, content } = req.body;
      const targetFile = resolveSafePath(path.join(parentPath || '', name));
      await fs.writeFile(targetFile, content || '', 'utf-8');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Rename
  app.post('/api/files/rename', async (req, res) => {
    try {
      const { oldPath, newName } = req.body;
      const oldTarget = resolveSafePath(oldPath);
      const parentDir = path.dirname(oldTarget);
      const newTarget = path.join(parentDir, newName);
      await fs.rename(oldTarget, newTarget);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API: Delete
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

  // Helpers
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  // Vite middleware in development, static in production
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
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Storage root: ${storageRoot}`);
  });
}

startServer();
