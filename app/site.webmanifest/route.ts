import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const filePath = path.join(process.cwd(), 'assets', 'favicon', 'site.webmanifest');
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return new Response(text, {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    // Fallback minimal manifest if the file is missing
    const fallback = {
      name: '360ace.Tech',
      short_name: '360ace',
      icons: [
        { src: '/favicon.ico', sizes: '48x48 64x64 128x128', type: 'image/x-icon' },
      ],
      start_url: '/',
      display: 'standalone',
      background_color: '#020617',
      theme_color: '#0ea5e9'
    };
    return new Response(JSON.stringify(fallback), {
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
      },
    });
  }
}
