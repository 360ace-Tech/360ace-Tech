// Copies favicon and manifest files from assets/favicon to public/
// so they are served statically at the root paths expected by metadata.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcDir = path.join(root, 'assets', 'favicon');
const dstDir = path.join(root, 'public');

const files = [
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'apple-touch-icon.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon.ico',
  'site.webmanifest',
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
}

async function copyIfExists(name) {
  const from = path.join(srcDir, name);
  const to = path.join(dstDir, name);
  try {
    await fs.copyFile(from, to);
    // eslint-disable-next-line no-console
    console.log(`[favicons] Copied ${name}`);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.warn(`[favicons] Skipped missing ${name}`);
    } else {
      throw err;
    }
  }
}

await ensureDir(dstDir);
await Promise.all(files.map(copyIfExists));

