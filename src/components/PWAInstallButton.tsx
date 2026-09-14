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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
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
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Instalar en el móvil
            </h3>
            <p className="mt-3 text-xs text-neutral-300 leading-relaxed text-left">
              {isIOS ? (
                <>
                  1. Pulsa el botón Compartir en Safari (barra inferior).<br />
                  2. Selecciona «Agregar a inicio».
                </>
              ) : (
                <>
                  1. Abre el menú de tu navegador (los tres puntos arriba a la derecha).<br />
                  2. Selecciona «Instalar aplicación» o «Agregar a la pantalla principal».
                </>
              )}
            </p>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-full bg-white/15 hover:bg-white/25 py-2 text-xs font-medium text-white transition-colors border border-white/10"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

