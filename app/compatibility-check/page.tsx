import Link from 'next/link';

import { SiteShell } from '@/components/layout/site-shell';

export default function CompatibilityCheckPage() {
  return (
    <SiteShell>
      <section className="py-24">
        <div className="container-edge max-w-3xl space-y-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Resources</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Compatibility Check</h1>
            <p className="text-sm text-muted-foreground">
              A concise checklist to assess whether our platform engineering and SRE playbooks fit your goals, teams, and constraints.
            </p>
          </header>
          <div className="rounded-3xl border border-white/10 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
            <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
              <li>Executive sponsor and engineering lead aligned on reliability and delivery outcomes.</li>
              <li>Clear ownership with a small, empowered decision group.</li>
              <li>Appetite for paved paths: golden templates, guardrails, and automated checks.</li>
              <li>Regulatory or uptime constraints where SRE materially improves outcomes.</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/downloads/compatibility-check"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
              >
                Download PDF
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

