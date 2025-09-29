import { SiteShell } from '@/components/layout/site-shell';

type Section = { heading: string; body: string[] };

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <SiteShell>
      <article className="container-edge mx-auto max-w-3xl py-12 sm:py-16">
        <header className="mb-10 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </header>
        <p className="mb-8 text-muted-foreground">{intro}</p>
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-2 text-xl font-semibold">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mb-3 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
