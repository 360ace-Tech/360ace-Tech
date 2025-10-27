import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: process.env.NODE_ENV,
    node: process.version,
    time: new Date().toISOString(),
  });
}

