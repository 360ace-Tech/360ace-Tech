export default function PreloaderServer() {
  return (
    <div className="preloader-overlay" aria-hidden>
      <div className="preloader-inner">
        <div className="preloader-ring" />
        <div className="preloader-logo">
          {/* Render both; theme controls visibility */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="logo" className="hidden h-full w-full object-contain dark:block" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light.png" alt="logo" className="block h-full w-full object-contain dark:hidden" />
        </div>
      </div>
    </div>
  );
}

