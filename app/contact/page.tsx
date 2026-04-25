"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { Check } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/site-shell';

type TurnstileTheme = 'light' | 'dark';

type Turnstile = {
  render: (
    container: string | HTMLElement,
    params: {
      sitekey: string;
      size?: 'normal' | 'compact' | 'flexible';
      theme?: TurnstileTheme | 'auto';
      action?: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: (errorCode?: string) => void;
      'timeout-callback'?: () => void;
    },
  ) => number;
  reset: (id?: number) => void;
  remove: (id?: number) => void;
};

type TurnstileWindow = Window & { turnstile?: Turnstile };

export default function ContactPage() {
  const { resolvedTheme } = useTheme();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const turnstileId = useRef<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formStart, setFormStart] = useState<string>('');
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaVersion, setCaptchaVersion] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFormStart(String(Date.now()));
    setMounted(true);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderCaptcha = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!siteKey) return;
    const w = window as TurnstileWindow;
    if (!w.turnstile?.render) return;
    const container = containerRef.current;
    if (!container) return;
    try {
      if (turnstileId.current !== null) {
        w.turnstile.remove(turnstileId.current);
        turnstileId.current = null;
      }
      container.replaceChildren();
      setCaptchaToken(null);
      turnstileId.current = w.turnstile.render(container, {
        sitekey: siteKey,
        size: 'normal',
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        action: 'contact',
        callback: (tok: string) => setCaptchaToken(tok),
        'expired-callback': () => setCaptchaToken(null),
        'timeout-callback': () => setCaptchaToken(null),
        'error-callback': () => {
          setCaptchaToken(null);
          setStatus('Security check failed to load. Please refresh and try again.');
        },
      });
    } catch (err) {
      console.error('Turnstile render failed', err);
    }
  }, [siteKey, resolvedTheme]);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;
    const w = window as TurnstileWindow;
    if (w.turnstile) renderCaptcha();

    let tries = 0;
    const t = setInterval(() => {
      if (turnstileId.current !== null) {
        clearInterval(t);
        return;
      }
      tries += 1;
      if (tries > 10) {
        clearInterval(t);
        return;
      }
      if ((window as TurnstileWindow).turnstile) renderCaptcha();
    }, 300);
    return () => clearInterval(t);
  }, [mounted, captchaVersion, renderCaptcha]);

  useEffect(() => {
    setCaptchaVersion((v) => v + 1);
  }, [resolvedTheme]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      const w = window as TurnstileWindow;
      if (turnstileId.current !== null) {
        w.turnstile?.remove?.(turnstileId.current);
      }
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    const formEl = e.currentTarget as HTMLFormElement; // capture reference before any await
    const fd = new FormData(formEl);
    const email = String(fd.get('email') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const subject = String(fd.get('subject') || '').trim();
    const message = String(fd.get('message') || '').trim();
    const okPolicy = fd.get('policy') === 'on';
    const hp = String(fd.get('hp') || '').trim();
    const formStartMs = Number(fd.get('formStart') || 0);

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
    const token = captchaToken || undefined;
    if (siteKey && !token) {
      setStatus('Please complete the security check.');
      setSubmitting(false);
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, company, phone, subject, message, token, hp, formStart: formStartMs }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok && data.ok) {
      // Show toast and clear any inline status
      setStatus(null);
      setToast({ message: 'Thanks! Your message has been sent.', type: 'success' });
      try {
        formEl.reset();
      } catch {}
      const w = window as TurnstileWindow;
      w.turnstile?.reset?.(turnstileId.current ?? undefined);
      setCaptchaToken(null);
    } else {
      setStatus(data?.error || 'Something went wrong. Please try again later.');
      const w = window as TurnstileWindow;
      w.turnstile?.reset?.(turnstileId.current ?? undefined);
      setCaptchaToken(null);
    }
  };

  // Auto-clear inline status after a short delay
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 5000);
    return () => clearTimeout(t);
  }, [status]);

  // Auto-hide toast after a short delay
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <SiteShell>
      <section className="py-24">
      {/* Success toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4 sm:px-6"
        >
          <div className="inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm shadow-lg backdrop-blur-sm border-green-500/40 bg-card/90 text-foreground dark:border-green-400/30">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
        {mounted && siteKey ? (
          <Script
            key="cloudflare-turnstile"
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            async
            defer
            onLoad={() => {
              setCaptchaReady(true);
              renderCaptcha();
            }}
            onError={() => {
              setCaptchaReady(false);
              setStatus('Security check failed to load. Please refresh and try again.');
            }}
          />
        ) : null}
        <div className="container-edge">
          <div className="grid items-start gap-10 lg:gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <header className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
              <h1 className="text-3xl font-semibold sm:text-4xl">Let’s talk about your project</h1>
              <p className="text-sm text-muted-foreground">We usually reply within 1–2 business days.</p>
            </header>
            <form onSubmit={onSubmit} className="w-full max-w-md sm:max-w-lg lg:max-w-none space-y-5 rounded-3xl border border-white/10 bg-card/60 p-5 lg:p-6 shadow-lg backdrop-blur-xl">
              <div className="grid gap-3">
              {/* Honeypot and timing (client-only to avoid hydration mismatch) */}
              {mounted && (
                <>
                  <input type="text" name="hp" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
                  <input type="hidden" name="formStart" value={formStart} readOnly />
                </>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input name="email" type="email" required className="w-full rounded-md border border-border bg-muted/70 dark:bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Company <span className="text-xs text-muted-foreground">(optional)</span></label>
                  <input name="company" type="text" className="w-full rounded-md border border-border bg-muted/70 dark:bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Phone <span className="text-xs text-muted-foreground">(optional)</span></label>
                  <input name="phone" type="tel" inputMode="tel" className="w-full rounded-md border border-border bg-muted/70 dark:bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Subject</label>
                <input name="subject" required maxLength={160} className="w-full rounded-md border border-border bg-muted/70 dark:bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea name="message" rows={5} required maxLength={5000} className="w-full rounded-md border border-border bg-muted/70 dark:bg-background/60 p-3 outline-none focus:ring-2 focus:ring-primary" />
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
              {mounted && siteKey ? (
                <div className="pt-1 sm:max-w-[19rem]">
                  <div ref={containerRef} id="turnstile-container" key={`turnstile-${captchaVersion}`} />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Note: Cloudflare Turnstile is not configured. Messages may be limited.</p>
              )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={
                    Boolean(
                      submitting ||
                        (siteKey && (!captchaReady || !captchaToken)),
                    )
                  }
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
                {status && <span className="text-sm text-muted-foreground" aria-live="polite">{status}</span>}
              </div>
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
