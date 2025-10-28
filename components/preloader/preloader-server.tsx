import { Dancing_Script } from 'next/font/google';

const handwriting = Dancing_Script({ subsets: ['latin'], weight: ['700'] });

export default function PreloaderServer() {
  const text = '360ace.Tech'.split('');
  return (
    <div className="preloader-overlay" aria-hidden>
      <div className="preloader-stack">
        <div className="preloader-inner">
          <div className="preloader-row">
            <div className="preloader-logo">
              <span className="preloader-loading-ring" aria-hidden />
              {/* Render both; theme controls visibility */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-dark.png" alt="logo" className="preloader-logo-img hidden h-full w-full object-contain dark:block" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-light.png" alt="logo" className="preloader-logo-img block h-full w-full object-contain dark:hidden" />
            </div>
            <div className={`preloader-caption ${handwriting.className}`}>
              <span className="preloader-word">
                {text.map((ch, i) => (
                  <span key={i} className="preloader-letter" style={{ animationDelay: `${150 + i * 90}ms` }}>
                    {ch}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
