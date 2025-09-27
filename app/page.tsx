import Starfield from "../components/Starfield";
import TiltCard from "../components/TiltCard";

export default function Page() {
  return (
    <main className="uc-wrap">
      <Starfield count={450} />
      <section className="uc-content">
        <span className="logo-badge">360ace.Tech</span>
        <h1 className="title3d">Site Under Construction</h1>
        <p className="subtitle">
          We’re rebuilding with Next.js, modern 3D UX, and blazing performance.
        </p>

        <TiltCard>
          <div>
            <strong>Revamp in progress</strong>
            <div style={{ opacity: 0.8 }}>Launching soon — stay tuned.</div>
          </div>
        </TiltCard>

        <a className="cta" href="mailto:contact@360ace.tech">
          Contact us
        </a>
      </section>
    </main>
  );
}
