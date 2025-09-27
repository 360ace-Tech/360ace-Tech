import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const filePath = path.join(process.cwd(), 'assets', 'favicon', 'android-chrome-512x512.png');
  const buf = await fs.readFile(filePath);
  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
