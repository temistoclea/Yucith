import React, { useEffect, useState } from 'react';
import { DedicatedMusicPlayer } from './DedicatedMusicPlayer';
import { PWAInstallButton } from './PWAInstallButton';

interface SunflowerGardenProps {
  onBack?: () => void;
  recipientName?: string;
}

export const SunflowerGarden: React.FC<SunflowerGardenProps> = ({ onBack, recipientName = 'Yucith' }) => {
  const [loaded, setLoaded] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; top: number; duration: number }>>([]);
  const [showSongModal, setShowSongModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 400);

    // Interval to spawn shooting stars dynamically
    const starInterval = setInterval(() => {
      const id = Date.now();
      const top = Math.random() * 55 + 5;
      const duration = Math.random() * 1.5 + 2.2;
      setStars((prev) => [...prev.slice(-6), { id, top, duration }]);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearInterval(starInterval);
    };
  }, []);

  useEffect(() => {
    const handleGardenPopState = (event: PopStateEvent) => {
      const state = event.state;
      if (showSongModal && (!state || state.appScreen !== 'garden-song')) {
        setShowSongModal(false);
      }
    };

    window.addEventListener('popstate', handleGardenPopState);
    return () => {
      window.removeEventListener('popstate', handleGardenPopState);
    };
  }, [showSongModal]);

  const handleOpenSongModal = () => {
    window.history.pushState({ appScreen: 'garden-song' }, '');
    setShowSongModal(true);
  };

  const handleCloseSongModal = () => {
    if (window.history.state?.appScreen === 'garden-song') {
      window.history.back();
    } else {
      setShowSongModal(false);
    }
  };

  return (
    <div
      id="sunflower-garden-screen"
      className={`fixed inset-0 w-full h-full overflow-hidden flex flex-col justify-between items-center transition-opacity duration-1000 ${
        loaded ? 'opacity-100' : 'opacity-0 not-loaded'
      }`}
      style={{
        perspective: '1000px',
        backgroundColor: '#000000',
        zIndex: 50,
      }}
    >
      {/* Background radial gradient night sky */}
      <div className="night" />

      {/* Floating shooting stars */}
      <div className="shooting-stars">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        {stars.map((star) => (
          <div
            key={star.id}
            className="shooting-star"
            style={{
              top: `${star.top}%`,
              animationDelay: '0s',
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Sweet poetic message overlay at the top */}
      <div
        id="sunflower-dedication"
        className="relative z-30 px-6 text-center max-w-xl mx-auto flex flex-col items-center animate-fade-in"
        style={{
          paddingTop: 'max(1.75rem, calc(env(safe-area-inset-top, 0px) + 1rem))',
          paddingLeft: 'max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1rem))',
          paddingRight: 'max(1.5rem, calc(env(safe-area-inset-right, 0px) + 1rem))',
        }}
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium tracking-wide bg-amber-500/20 text-amber-200 border border-amber-400/30 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          🌻 Un detalle en un día cualquiera
        </span>
        <h1
          id="garden-title-recipient"
          className="text-white text-3xl sm:text-5xl font-bold tracking-wide select-none"
          style={{
            fontFamily: "'Dancing Script', 'Caveat', cursive, sans-serif",
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.7), 0 0 16px rgba(251, 191, 36, 0.3)',
          }}
        >
          Para ti{recipientName ? `, ${recipientName}` : ''}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-amber-100/90 max-w-md leading-relaxed drop-shadow-md font-light">
          Hoy no es San Valentín ni ninguna fecha especial. Me dijiste que no tenías flor favorita, así que quise regalarte y compartirte las mías: mis girasoles bajo las estrellas. ✨
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={handleOpenSongModal}
            id="garden-listen-song-btn"
            className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>🎵</span>
            <span>Escuchar canción que pensé para ti</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              id="back-to-envelope-btn"
              className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
            >
              ← Volver a la cartita
            </button>
          )}
        </div>

        {/* Dedicated song popup player */}
        {showSongModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
              paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
            }}
          >
            <DedicatedMusicPlayer onClose={handleCloseSongModal} autoPlay={true} />
          </div>
        )}
      </div>

      {/* Sunflowers and Garden Grass Component */}
      <div className="flowers relative w-full h-full flex justify-center items-end pb-4 sm:pb-8">
        {/* Flower 1 */}
        <div className="flower flower--1">
          <div className="flower__leafs flower__leafs--1">
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(0deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(30deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(60deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(90deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(120deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(150deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(180deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(210deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(240deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(270deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(300deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(330deg)' }}></div>
            <div className="flower__white-circle"></div>

            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        {/* Flower 2 */}
        <div className="flower flower--2">
          <div className="flower__leafs flower__leafs--2">
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(0deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(30deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(60deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(90deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(120deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(150deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(180deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(210deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(240deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(270deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(300deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(330deg)' }}></div>
            <div className="flower__white-circle"></div>

            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        {/* Flower 3 (Center) */}
        <div className="flower flower--3">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(0deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(30deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(60deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(90deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(120deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(150deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(180deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(210deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(240deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(270deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(300deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(330deg)' }}></div>
            <div className="flower__white-circle"></div>

            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        {/* Flower 4 (Left) */}
        <div className="flower flower--4">
          <div className="flower__leafs flower__leafs--4">
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(0deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(30deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(60deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(90deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(120deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(150deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(180deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(210deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(240deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(270deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(300deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(330deg)' }}></div>
            <div className="flower__white-circle"></div>

            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        {/* Flower 5 (Right) */}
        <div className="flower flower--5">
          <div className="flower__leafs flower__leafs--5">
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(0deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(30deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(60deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(90deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(120deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(150deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(180deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(210deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(240deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(270deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(300deg)' }}></div>
            <div className="flower__leaf" style={{ transform: 'translate(-50%, -10%) rotate(330deg)' }}></div>
            <div className="flower__white-circle"></div>

            <div className="flower__light flower__light--1"></div>
            <div className="flower__light flower__light--2"></div>
            <div className="flower__light flower__light--3"></div>
            <div className="flower__light flower__light--4"></div>
            <div className="flower__light flower__light--5"></div>
            <div className="flower__light flower__light--6"></div>
            <div className="flower__light flower__light--7"></div>
            <div className="flower__light flower__light--8"></div>
          </div>
          <div className="flower__line">
            <div className="flower__line__leaf flower__line__leaf--1"></div>
            <div className="flower__line__leaf flower__line__leaf--2"></div>
            <div className="flower__line__leaf flower__line__leaf--3"></div>
            <div className="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        {/* Grass clusters */}
        <div className="growing-grass">
          <div className="flower__grass flower__grass--1">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__leaf flower__grass__leaf--5"></div>
            <div className="flower__grass__leaf flower__grass__leaf--6"></div>
            <div className="flower__grass__leaf flower__grass__leaf--7"></div>
            <div className="flower__grass__leaf flower__grass__leaf--8"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--2">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__leaf flower__grass__leaf--5"></div>
            <div className="flower__grass__leaf flower__grass__leaf--6"></div>
            <div className="flower__grass__leaf flower__grass__leaf--7"></div>
            <div className="flower__grass__leaf flower__grass__leaf--8"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--3">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__leaf flower__grass__leaf--5"></div>
            <div className="flower__grass__leaf flower__grass__leaf--6"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--4">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--5">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--6">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--7">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>

        <div className="growing-grass">
          <div className="flower__grass flower__grass--8">
            <div className="flower__grass--top"></div>
            <div className="flower__grass--bottom"></div>
            <div className="flower__grass__leaf flower__grass__leaf--1"></div>
            <div className="flower__grass__leaf flower__grass__leaf--2"></div>
            <div className="flower__grass__leaf flower__grass__leaf--3"></div>
            <div className="flower__grass__leaf flower__grass__leaf--4"></div>
            <div className="flower__grass__overlay"></div>
          </div>
        </div>
      </div>

      {/* Botón discreto para instalar en el móvil */}
      <div
        id="garden-pwa-install-container"
        className="fixed z-40"
        style={{
          bottom: 'max(0.85rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))',
          right: 'max(0.85rem, calc(env(safe-area-inset-right, 0px) + 0.5rem))',
        }}
      >
        <PWAInstallButton variant="garden" />
      </div>
    </div>
  );
};
