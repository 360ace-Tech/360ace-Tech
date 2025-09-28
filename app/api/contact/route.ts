import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // TODO: validate with Zod and send email via provider (Resend/SES). For now, echo.
    return NextResponse.json({ ok: true, received: data }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}

