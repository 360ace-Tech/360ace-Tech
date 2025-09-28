import Starfield from "../components/Starfield";
import TiltCard from "../components/TiltCard";
import Link from "next/link";

export default function Page() {
  return (
    <main className="uc-wrap">
      <Starfield count={450} />
      <section className="uc-content">
        <span className="logo-badge">360ace.Tech</span>
        <h1 className="title3d">Modern Cloud & Platform Engineering</h1>
        <p className="subtitle">
          We’re rebuilding with Next.js, modern 3D UX, and blazing performance.
        </p>

        <TiltCard>
          <div>
            <strong>Revamp in progress</strong>
            <div style={{ opacity: 0.8 }}>Launching soon — stay tuned.</div>
          </div>
        </TiltCard>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <a className="cta" href="mailto:contact@360ace.tech">Contact us</a>
          <Link className="cta secondary" href="/blog">Read the blog</Link>
        </div>

        <div style={{ opacity: 0.8, marginTop: 24, fontSize: 14 }}>
          Respecting reduced motion preferences and accessibility best practices.
        </div>
      </section>
    </main>
  );
}
