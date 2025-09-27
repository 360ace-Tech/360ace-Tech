import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const filePath = path.join(process.cwd(), 'assets', 'favicon', 'favicon.ico');
  const buf = await fs.readFile(filePath);
  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
