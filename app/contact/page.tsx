"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/site-shell';

type Grecaptcha = {
  render: (el: HTMLElement, params: { sitekey: string }) => number;
  ready: (cb: () => void) => void;
  getResponse: (id?: number) => string;
  reset: (id?: number) => void;
};
type GrecaptchaWindow = Window & { grecaptcha?: Grecaptcha };

export default function ContactPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  const recaptchaId = useRef<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tryRender = () => {
      if (typeof window === 'undefined') return;
      const w = window as GrecaptchaWindow;
      if (!siteKey || !w.grecaptcha || recaptchaId.current !== null) return;
      const el = document.getElementById('recaptcha-container');
      if (!el) return;
      const gre = w.grecaptcha;
      if (!gre) return;
      gre.ready(() => {
        recaptchaId.current = gre.render(el as HTMLElement, { sitekey: siteKey });
      });
    };
    const t = setInterval(tryRender, 300);
    return () => clearInterval(t);
  }, [siteKey]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') || '').trim();
    const subject = String(fd.get('subject') || '').trim();
    const message = String(fd.get('message') || '').trim();
    const okPolicy = fd.get('policy') === 'on';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please provide a valid email.');
      setSubmitting(false);
      return;
    }
    if (!subject || !message) {
      setStatus('Subject and message are required.');
      setSubmitting(false);
      return;
    }
    if (!okPolicy) {
      setStatus('Please agree to the privacy policy.');
      setSubmitting(false);
      return;
    }
    let token: string | undefined;
    try {
      const w = window as GrecaptchaWindow;
      token = w.grecaptcha?.getResponse?.(recaptchaId.current ?? undefined);
    } catch {}

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, message, token }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok && data.ok) {
      setStatus('Thanks! Your message has been sent.');
      (e.currentTarget as HTMLFormElement).reset();
      const w = window as GrecaptchaWindow;
      if (w.grecaptcha && recaptchaId.current !== null) w.grecaptcha.reset(recaptchaId.current);
    } else {
      setStatus(data?.error || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <SiteShell>
      <section className="py-24">
        {siteKey ? <Script src="https://www.google.com/recaptcha/api.js?render=explicit" async defer /> : null}
        <div className="container-edge max-w-2xl space-y-8">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Let’s talk about your project</h1>
            <p className="text-sm text-muted-foreground">We usually reply within 1–2 business days.</p>
          </header>
          <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input name="email" type="email" required className="w-full rounded-md border border-white/10 bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Subject</label>
                <input name="subject" required maxLength={160} className="w-full rounded-md border border-white/10 bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea name="message" rows={6} required maxLength={5000} className="w-full rounded-md border border-white/10 bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <input id="policy" name="policy" type="checkbox" className="mt-1" />
                <label htmlFor="policy">
                  I have read and agree to the{' '}
                  <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="relative group inline-block">
                    <span>privacy policy</span>
                    <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                  </Link>
                  .
                </label>
              </div>
              {/* Only render the reCAPTCHA container if a site key is provided */}
              {siteKey ? <div id="recaptcha-container" className="min-h-[78px]" /> : (
                <p className="text-xs text-muted-foreground">Note: reCAPTCHA not configured. Messages may be limited.</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button disabled={submitting} type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-50">
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
              {status && <span className="text-sm text-muted-foreground">{status}</span>}
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
