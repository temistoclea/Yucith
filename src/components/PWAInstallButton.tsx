import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'light' | 'darkSubtle';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'light' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside installed PWA, do not show button
  if (isInstalled) {
    return null;
  }

  const btnClasses =
    variant === 'darkSubtle'
      ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white/80 text-[11px] font-normal border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm'
      : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-rose-950 text-xs font-semibold shadow-sm border border-rose-200 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95';

  // Android / Chrome / Desktop
  if (isInstallable) {
    return (
      <button
        onClick={install}
        id="pwa-install-btn"
        className={btnClasses}
        title="Instalar en tu teléfono"
      >
        <span>Guardar en el teléfono</span>
      </button>
    );
  }

  // iPhone / Safari guide
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="pwa-ios-install-btn"
          className={btnClasses}
          title="Cómo guardar en tu pantalla"
        >
          <span>Guardar en el teléfono</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
              paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
            }}
            onClick={() => setShowIOSGuide(false)}
          >
            <div
              className="w-full max-w-xs rounded-2xl bg-[#fff7f5] p-6 shadow-2xl border border-rose-200 text-center animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl mb-2">🌻</div>
              <h3 className="text-base font-bold text-rose-950">Instalar en tu teléfono</h3>
              <p className="mt-2 text-xs text-rose-900/80 leading-relaxed text-left">
                1. Toca el botón <strong>Compartir</strong> <span className="text-sm">⎋</span> abajo en Safari.<br />
                2. Baja un poco y selecciona <strong>«Agregar a pantalla de inicio»</strong> <span className="text-sm">➕</span>.<br />
                3. ¡Listo! Te quedará guardada como una app con su girasol.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-full bg-[#9b2226] py-2 text-xs font-semibold text-amber-100 shadow-md hover:bg-[#ba181b] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // In case browser does not support install prompt yet, provide an informative subtle button
  return (
    <>
      <button
        onClick={() => setShowIOSGuide(true)}
        id="pwa-info-install-btn"
        className={btnClasses}
        title="Guardar en el teléfono"
      >
        <span>Guardar en el teléfono</span>
      </button>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          style={{
            paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-[#fff7f5] p-6 shadow-2xl border border-rose-200 text-center animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl mb-2">🌻</div>
            <h3 className="text-base font-bold text-rose-950">Guardar en tu teléfono</h3>
            <p className="mt-2 text-xs text-rose-900/80 leading-relaxed text-left">
              Puedes tener este detalle siempre en tu pantalla de inicio:<br /><br />
              • <strong>En Android / Chrome:</strong> Toca los 3 puntos (⋮) arriba y elige <strong>«Instalar aplicación»</strong> o <strong>«Agregar a la pantalla principal»</strong>.<br />
              • <strong>En iPhone / Safari:</strong> Toca el botón <strong>Compartir</strong> (⎋) y elige <strong>«Agregar a pantalla de inicio»</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-full bg-[#9b2226] py-2 text-xs font-semibold text-amber-100 shadow-md hover:bg-[#ba181b] transition-colors"
            >
              ¡Genial!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
