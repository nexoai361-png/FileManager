# Android File Manager & Archive Tool (Termux / ZArchiver Engine)

A powerful, native-speed Android file manager for Termux, designed with full archive management similar to ZArchiver.

## Features
- **Real Android Storage Access**: Direct integration with `termux-setup-storage` for accessing `/storage/emulated/0` (Downloads, DCIM, Documents, Pictures, Music, Movies) and SD cards (`~/storage/external-1`).
- **Storage Drive Switcher**: One-tap toggle between Shared Internal Storage, Termux Home (`~`), and Removable SD cards.
- **ZArchiver Compression**: Compress files and folders into **ZIP**, **7Z**, **TAR**, and **TAR.GZ** archives with high performance.
- **ZArchiver Extraction**: Extract **ZIP**, **7Z**, **TAR**, **TAR.GZ**, **TGZ**, **BZ2**, **XZ**, and **RAR** archives.
- **Inspect Archives Without Extracting**: View file trees, sizes, and timestamps inside archives before extracting.
- **Full File Operations**: Browse, create files/folders, copy, cut/move, rename, batch delete, and inspect UNIX permissions (`rwxr-xr-x`).
- **Multi-Selection Mode**: Batch copy, cut, compress, or delete multiple items simultaneously.
- **Clipboard Bar**: Floating paste toolbar for moving or copying files across directories.
- **Recursive Fast Search**: Real filesystem recursive search through subdirectories.
- **Large File Handling**: Partial content streaming (`HTTP 206`) for audio/video seeking and multi-gigabyte downloads.

---

## Simple Installation & Setup in Termux

Open your **Termux** app on Android and run:

```bash
# 1. Update Termux packages & install required tools
pkg update && pkg upgrade -y
pkg install nodejs git p7zip zip unzip tar gzip -y

# 2. Grant Android storage permission (Tap "ALLOW" on the Android system popup)
termux-setup-storage

# 3. Clone this repository (or navigate to your FileManager directory)
git clone <YOUR_REPOSITORY_URL> FileManager
cd FileManager

# 4. Install dependencies (Clean peer resolution)
npm install

# 5. Start in Development Mode
npm run dev

# OR Build & Start in Production Mode
npm run build
npm start
```

Once started, open `http://localhost:3000` (or `http://127.0.0.1:3000`) in any browser on your Android device (Chrome, Firefox, Brave, etc.).
