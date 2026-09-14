import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'light' | 'darkSubtle' | 'garden';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'garden' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside installed PWA, do not show button
  if (isInstalled) {
    return null;
  }

  const btnClasses =
    variant === 'garden' || variant === 'darkSubtle'
      ? 'inline-flex items-center px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[11px] font-normal border border-white/15 backdrop-blur-md transition-all duration-300 active:scale-95 shadow-sm'
      : 'inline-flex items-center px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-rose-950 text-xs font-semibold shadow-sm border border-rose-200 backdrop-blur-md transition-all duration-300 active:scale-95';

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        id="pwa-install-btn"
        className={btnClasses}
        title="Instalar en el móvil"
      >
        <span>Instalar en el móvil</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          style={{
            paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
          }}
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-neutral-900/95 text-neutral-100 p-6 shadow-2xl border border-white/15 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-amber-500/20 flex items-center justify-center text-xl">
              🌻
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Instalar en el móvil
            </h3>
            <p className="mt-1 text-[11px] text-amber-200/80">
              Quedará como una app instalada en tu dispositivo
            </p>

            <div className="mt-4 text-xs text-neutral-300 leading-relaxed text-left bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-2">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">1.</span>
                    <span>Toca el botón <strong>Compartir</strong> (icono <span className="inline-block border border-white/30 rounded px-1 text-[10px]">⎋</span>) en la barra inferior de Safari.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">2.</span>
                    <span>Desliza hacia abajo y toca <strong>«Agregar a inicio»</strong> (+).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">3.</span>
                    <span>Toca <strong>«Agregar»</strong>. Se abrirá como app propia en tu pantalla.</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">1.</span>
                    <span>Toca los <strong>tres puntos (⋮)</strong> arriba a la derecha en Chrome.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">2.</span>
                    <span>Toca la opción <strong>«Instalar aplicación»</strong> (con ícono de teléfono o flecha de descarga).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-400">3.</span>
                    <span>Toca <strong>«Instalar»</strong> para que se instale en tu cajón de apps.</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-full bg-amber-500 hover:bg-amber-400 py-2 text-xs font-semibold text-neutral-950 transition-colors shadow-md"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

