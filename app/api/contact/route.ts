import { NextRequest, NextResponse } from 'next/server';

// Use Edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

type ContactBody = {
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  token?: string;
  hp?: string;
  formStart?: number;
};

type TurnstileSiteVerifyResponse = {
  success?: boolean;
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
  'error-codes'?: string[];
};

// Basic in-memory rate limit (per process). For distributed/serverless, use a shared store.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10; // 10 requests per minute per IP
const rateMap = new Map<string, { count: number; resetAt: number }>();
const TURNSTILE_TEST_SECRETS = new Set([
  '1x0000000000000000000000000000000AA',
  '2x0000000000000000000000000000000AA',
  '3x0000000000000000000000000000000AA',
]);

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
    const now = Date.now();
    const rec = rateMap.get(ip);
    if (!rec || now > rec.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    } else {
      rec.count += 1;
      if (rec.count > RATE_MAX) {
        return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
      }
    }
    const body = (await req.json()) as ContactBody;
    const { email, company, phone, subject, message, token, hp, formStart } = body || {};

    if (!email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 400 });
    }
    if (subject.length > 160 || message.length > 5000) {
      return NextResponse.json({ ok: false, error: 'Content too long.' }, { status: 400 });
    }
    if (phone && !/^[- +()0-9]{6,20}$/.test(phone)) {
      return NextResponse.json({ ok: false, error: 'Invalid phone number.' }, { status: 400 });
    }
    // Lightweight anti-bot checks
    if (typeof hp === 'string' && hp.trim() !== '') {
      return NextResponse.json({ ok: false, error: 'Unable to send at this time.' }, { status: 200 });
    }
    const minSubmitMs = Number(process.env.CONTACT_MIN_SUBMIT_MS || '2000');
    if (typeof formStart === 'number' && formStart > 0) {
      const delta = Date.now() - formStart;
      if (delta < minSubmitMs) {
        return NextResponse.json({ ok: false, error: 'Please wait a moment and try again.' }, { status: 200 });
      }
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const isTestSecret = TURNSTILE_TEST_SECRETS.has(turnstileSecret);
      if (!token) {
        return NextResponse.json({ ok: false, error: 'Security check is required.' }, { status: 400 });
      }

      try {
        const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: token,
            remoteip: ip !== 'unknown' ? ip : undefined,
          }),
        });

        const data = (await verify.json()) as TurnstileSiteVerifyResponse;
        if (!data.success) {
          return NextResponse.json({ ok: false, error: 'Security check failed. Please try again.' }, { status: 400 });
        }

        if (!isTestSecret && data.action && data.action !== 'contact') {
          return NextResponse.json({ ok: false, error: 'Security check failed. Please try again.' }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ ok: false, error: 'Security verification is unavailable. Please try again.' }, { status: 200 });
      }
    }

    // Send email via MailerSend when configured
    const apiKey = process.env.MAILERSEND_API_KEY?.trim();
    const to = process.env.CONTACT_TO_EMAIL?.trim() || 'hello@360ace.tech';
    const from = process.env.CONTACT_FROM_EMAIL?.trim() || 'no-reply@360ace.tech';

    if (!apiKey) {
      // Not configured: return safe message
      return NextResponse.json({ ok: false, error: 'Email service not configured.' }, { status: 503 });
    }

    const esc = (input: string) =>
      input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX || 'New contact';

    const textLines: string[] = [
      'New contact message',
      '',
      `From: ${email}`,
      company ? `Company: ${company}` : undefined,
      phone ? `Phone: ${phone}` : undefined,
      `Subject: ${subject}`,
      '',
      message,
    ].filter(Boolean) as string[];
    const textBody = textLines.join('\n');

    const metaRows = [
      `<tr><td style="padding:8px 0;opacity:0.8;width:120px;vertical-align:top;">From</td><td style="padding:8px 0;color:#fff;">${esc(
        email,
      )}</td></tr>`,
      company
        ? `<tr><td style="padding:8px 0;opacity:0.8;width:120px;vertical-align:top;">Company</td><td style="padding:8px 0;color:#fff;">${esc(
            company,
          )}</td></tr>`
        : '',
      phone
        ? `<tr><td style="padding:8px 0;opacity:0.8;width:120px;vertical-align:top;">Phone</td><td style="padding:8px 0;color:#fff;">${esc(
            phone,
          )}</td></tr>`
        : '',
    ]
      .filter(Boolean)
      .join('');

    const htmlBody = `<!doctype html>
<html><head><meta charset="utf-8"></head><body style="margin:0;padding:24px;background:#0b0b0b;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Ubuntu,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#101014;border:1px solid rgba(255,255,255,0.1);border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.35);">
    <div style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <h2 style="margin:0;font-size:18px;line-height:1.4;">${esc(subjectPrefix)} — ${esc(subject)}</h2>
    </div>
    <div style="padding:20px 24px;">
      <table style="width:100%;border-collapse:collapse;color:#d6d6d6;font-size:14px;">${metaRows}</table>
      <div style="margin-top:16px;">
        <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;opacity:0.75;margin-bottom:8px;">Message</div>
        <div style="border:1px solid rgba(255,255,255,0.1);border-radius:12px;background:#0e0e12;padding:16px;color:#fff;">
          <pre style="margin:0;white-space:pre-wrap;word-wrap:break-word;font:inherit;">${esc(message)}</pre>
        </div>
      </div>
    </div>
  </div>
</body></html>`;

    const payload = {
      from: {
        email: from,
        name: '360ace.Tech Contact Form',
      },
      to: [
        {
          email: to,
        },
      ],
      reply_to: {
        email,
      },
      subject: `${subjectPrefix}: ${subject}`,
      text: textBody,
      html: htmlBody,
    };

    try {
      const resp = await fetch('https://api.mailersend.com/v1/email', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        if (process.env.NODE_ENV !== 'production') {
          const errorText = await resp.text();
          console.error('MailerSend contact email failed', resp.status, errorText.slice(0, 600));
        }
        return NextResponse.json({ ok: false, error: 'Email failed. Please try again.' }, { status: 200 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: 'Email service unreachable.' }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    // Avoid surfacing a 500 to the UI; return a friendly JSON error instead.
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
