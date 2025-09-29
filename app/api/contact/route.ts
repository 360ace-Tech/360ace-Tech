import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

type ContactBody = {
  email: string;
  subject: string;
  message: string;
  token?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactBody;
    const { email, subject, message, token } = body || {};

    if (!email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
    }
    if (subject.length > 160 || message.length > 5000) {
      return NextResponse.json({ ok: false, error: 'Content too long.' }, { status: 400 });
    }

    // Verify reCAPTCHA when configured
    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    if (recaptchaSecret) {
      if (!token) {
        return NextResponse.json({ ok: false, error: 'Captcha token missing.' }, { status: 400 });
      }
      const params = new URLSearchParams();
      params.set('secret', recaptchaSecret);
      params.set('response', token);
      const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const data = (await verify.json()) as { success?: boolean; score?: number; action?: string };
      if (!data.success) {
        return NextResponse.json({ ok: false, error: 'Captcha validation failed.' }, { status: 400 });
      }
    }

    // Send email via SendGrid when configured
    const apiKey = process.env.SENDGRID_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL || 'hello@360ace.tech';
    const from = process.env.CONTACT_FROM_EMAIL || 'no-reply@360ace.tech';

    if (!apiKey) {
      // Not configured: return safe message
      return NextResponse.json({ ok: false, error: 'Email service not configured.' }, { status: 503 });
    }

    const payload = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: `[Contact] ${subject}`,
        },
      ],
      from: { email: from, name: '360ace.Tech Contact Form' },
      reply_to: { email },
      content: [
        {
          type: 'text/plain',
          value: `From: ${email}\nSubject: ${subject}\n\n${message}`,
        },
      ],
    };

    const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ ok: false, error: 'Email failed', details: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
