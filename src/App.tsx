import React, { useState, useEffect } from 'react';
import { SunflowerGarden } from './components/SunflowerGarden';
import { IntroGreeting } from './components/IntroGreeting';
import { DedicatedMusicPlayer } from './components/DedicatedMusicPlayer';
import { CreatorModal } from './components/CreatorModal';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [recipientName, setRecipientName] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryName = urlParams.get('para') || urlParams.get('name');
      if (queryName && queryName.trim()) {
        const cleaned = queryName.trim();
        const resolved = cleaned.toLowerCase() === 'yucit' ? 'Yucith' : cleaned;
        localStorage.setItem('un_detalle_recipient_name', resolved);
        return resolved;
      }
      const stored = localStorage.getItem('un_detalle_recipient_name');
      if (stored) {
        const trimmed = stored.trim();
        if (trimmed.toLowerCase() === 'yucit') {
          localStorage.setItem('un_detalle_recipient_name', 'Yucith');
          return 'Yucith';
        }
        return trimmed;
      }
      localStorage.setItem('un_detalle_recipient_name', 'Yucith');
      return 'Yucith';
    } catch {
      return 'Yucith';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);

  const handleUpdateName = (name: string) => {
    const resolved = name.trim().toLowerCase() === 'yucit' ? 'Yucith' : name;
    setRecipientName(resolved);
    try {
      localStorage.setItem('un_detalle_recipient_name', resolved);
    } catch {
      // localStorage may be unavailable
    }
  };

  // Ensure stored name is corrected if previously cached as Yucit without H
  useEffect(() => {
    try {
      const stored = localStorage.getItem('un_detalle_recipient_name');
      if (!stored || stored.trim().toLowerCase() === 'yucit') {
        localStorage.setItem('un_detalle_recipient_name', 'Yucith');
        setRecipientName('Yucith');
      }
    } catch {
      // ignore
    }
  }, []);

  // Fallbacks in case external images fail to load
  const [bowError, setBowError] = useState(false);

  // Handle Android physical/gesture Back Button & browser history navigation
  useEffect(() => {
    // Set initial baseline state if not already set
    if (!window.history.state || !window.history.state.appScreen) {
      window.history.replaceState({ appScreen: 'cover' }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (!state || state.appScreen === 'cover') {
        setShowGarden(false);
        setShowMusicPlayer(false);
        setHasEntered(false);
        setIsOpen(false);
      } else if (state.appScreen === 'letter') {
        setShowGarden(false);
        setShowMusicPlayer(false);
        setHasEntered(true);
      } else if (state.appScreen === 'garden') {
        setShowGarden(true);
        setShowMusicPlayer(false);
        setHasEntered(true);
      } else if (state.appScreen === 'music') {
        setShowMusicPlayer(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Keyboard navigation for Android physical keyboards / Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (showMusicPlayer) {
          e.preventDefault();
          window.history.back();
        } else if (showGarden) {
          e.preventDefault();
          window.history.back();
        } else if (hasEntered) {
          e.preventDefault();
          window.history.back();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMusicPlayer, showGarden, hasEntered]);

  const handleEnterFromCover = () => {
    window.history.pushState({ appScreen: 'letter' }, '');
    setHasEntered(true);
  };

  const handleReturnToCover = () => {
    if (window.history.state?.appScreen === 'letter') {
      window.history.back();
    } else {
      window.history.pushState({ appScreen: 'cover' }, '');
      setHasEntered(false);
    }
  };

  const handleOpenGarden = () => {
    window.history.pushState({ appScreen: 'garden' }, '');
    setShowGarden(true);
  };

  const handleCloseGarden = () => {
    if (window.history.state?.appScreen === 'garden') {
      window.history.back();
    } else {
      setShowGarden(false);
    }
  };

  const handleToggleMusic = () => {
    if (!showMusicPlayer) {
      window.history.pushState({ appScreen: 'music' }, '');
      setShowMusicPlayer(true);
    } else {
      if (window.history.state?.appScreen === 'music') {
        window.history.back();
      } else {
        setShowMusicPlayer(false);
      }
    }
  };

  const cardIsUp = isOpen || isHovered;

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      id="main-app-wrapper"
      className="relative min-h-screen w-full flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        backgroundColor: '#fae1dd',
      }}
    >
      {/* 1. Introductory Screen ("Hola! ESTE DETALLE ES PARA TI :)") */}
      {!hasEntered && (
        <IntroGreeting onEnter={handleEnterFromCover} />
      )}

      {/* 2. Full-Screen Sunflower Garden with Night Sky & Shooting Stars */}
      {showGarden && (
        <SunflowerGarden
          recipientName={recipientName}
          onBack={handleCloseGarden}
        />
      )}

      {/* Floating subtle elements in background: Golden sunflowers & hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <span className="absolute top-12 left-10 text-xl animate-bounce" style={{ animationDuration: '4s' }}>🌻</span>
        <span className="absolute bottom-20 left-16 text-xl animate-bounce" style={{ animationDuration: '6s' }}>❤️</span>
        <span className="absolute bottom-32 right-20 text-lg animate-bounce" style={{ animationDuration: '4.5s' }}>🌻</span>
      </div>

      {/* Top Header / Subtle Context */}
      <header
        className="absolute left-0 right-0 text-center z-10 flex justify-between items-center max-w-2xl mx-auto w-full"
        style={{
          top: 'max(1.25rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))',
          paddingLeft: 'max(1rem, calc(env(safe-area-inset-left, 0px) + 1rem))',
          paddingRight: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 1rem))',
        }}
      >
        <button
          onClick={handleReturnToCover}
          className="text-xs font-semibold text-rose-950/80 hover:text-rose-950 transition-colors px-3 py-1.5 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md border border-rose-200 shadow-sm active:scale-95"
          title="Volver a la portada de inicio"
        >
          ← Portada
        </button>

        <div className="inline-flex items-center gap-2 bg-white/80 hover:bg-white/95 transition-all border border-rose-200 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
          <span className="text-amber-500 text-sm">🌻</span>
          {isEditingName ? (
            <input
              type="text"
              value={recipientName}
              onChange={(e) => handleUpdateName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingName(false);
              }}
              autoFocus
              className="bg-transparent border-b border-rose-400 text-xs font-semibold text-rose-950 outline-none text-center w-24"
            />
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              className="text-xs font-semibold text-rose-900 cursor-pointer hover:underline"
              title="Haz clic para cambiar el nombre"
            >
              Para: {recipientName} ✎
            </span>
          )}
          <span className="text-[11px] text-rose-900/60 font-medium border-l border-rose-200 pl-2">
            Hoy no es ninguna fecha especial
          </span>
        </div>

        {/* Empty placeholder for clean visual balance with left button */}
        <div className="w-16"></div>
      </header>

      {/* Floating Music Player Modal / Drawer */}
      {showMusicPlayer && (
        <div
          id="music-player-modal-container"
          className="fixed z-50 filter drop-shadow-2xl inset-x-0 mx-auto w-full flex justify-center items-center pointer-events-none px-4"
          style={{
            bottom: 'max(1rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))',
          }}
        >
          <div className="pointer-events-auto">
            <DedicatedMusicPlayer onClose={handleToggleMusic} autoPlay={true} />
          </div>
        </div>
      )}

      {/* Interactive Envelope Container */}
      <div
        id="valentines-container"
        className="container valentines-container mt-20 sm:mt-24 mb-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={toggleCard}
        role="button"
        tabIndex={0}
        aria-label="Abrir carta de detalle"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCard();
          }
        }}
      >
        {/* Lazo coquette (Bow) en rojo vino */}
        <div id="lazo-coquette" className="Lazocoquette">
          {!bowError ? (
            <img
              src="https://images.vexels.com/media/users/3/294490/isolated/preview/ba9667f4cb79773875f50a235080d9a9-pajarita-verde-brillante.png"
              alt="Lazo"
              referrerPolicy="no-referrer"
              onError={() => setBowError(true)}
              style={{ filter: 'hue-rotate(250deg) saturate(1.8) brightness(0.8)' }}
            />
          ) : (
            <svg
              viewBox="0 0 100 70"
              className="w-12 h-auto"
              style={{ marginTop: '95px', animation: 'valentines-up 3s linear infinite' }}
            >
              <ellipse cx="50" cy="35" rx="8" ry="12" fill="#4a0404" />
              <polygon points="50,35 15,15 15,55" fill="#a31621" stroke="#330000" strokeWidth="2" />
              <polygon points="50,35 85,15 85,55" fill="#a31621" stroke="#330000" strokeWidth="2" />
              <ellipse cx="50" cy="35" rx="9" ry="10" fill="#e63946" stroke="#330000" strokeWidth="2" />
            </svg>
          )}
        </div>

        {/* Sunflower Left */}
        <div id="sunflower-left" className="Tulipan1">
          <div
            className="flex flex-col items-center"
            style={{
              animation: 'valentines-up 3s linear infinite',
              marginTop: '10px',
            }}
          >
            <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform -rotate-12 hover:scale-110 transition-transform">
              🌻
            </span>
          </div>
        </div>

        {/* Sunflower Right */}
        <div id="sunflower-right" className="Tulipan2">
          <div
            className="flex flex-col items-center"
            style={{
              animation: 'valentines-up 3s linear infinite',
              marginTop: '10px',
            }}
          >
            <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform rotate-12 hover:scale-110 transition-transform">
              🌻
            </span>
          </div>
        </div>

        {/* Envelope Structure */}
        <div id="valentines-envelope" className="valentines">
          <div id="envelope-back" className="envelope"></div>
          <div id="envelope-front" className="front"></div>

          {/* Sliding Card */}
          <div
            id="valentine-card"
            className={`card ${cardIsUp ? 'open' : ''}`}
            style={{
              top: cardIsUp ? '-65px' : '5px',
            }}
          >
            {/* Thoughtful Text: spontaneous, real & sincere */}
            <div id="card-message" className="text">
              <span className="block text-[21px] text-[#2b0e07] leading-tight font-bold">
                Hoy es un día común y corriente...
              </span>
              <span className="block text-[17px] text-[#5a2a18] mt-1 font-semibold leading-tight">
                pero quería darte un detalle.
              </span>
              <span className="block text-[16px] text-[#9b2226] mt-1.5 font-bold leading-tight">
                Como no tienes flor favorita, quise compartirte la mía: los girasoles 🌻
              </span>
            </div>

            {/* Sunflower button inside the card that opens the night garden */}
            <div id="card-sunflower-trigger" className="heart">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGarden(true);
                }}
                className="group relative flex items-center justify-center p-1 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
                title="Ver tu sorpresa"
              >
                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">
                  🌻
                </span>
              </button>
            </div>

            {/* Floating Red/Crimson Hearts */}
            <div id="floating-hearts-cluster" className="hearts">
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
              <div className="four"></div>
              <div className="five"></div>
            </div>
          </div>

          {/* Firma discreta en la esquinita del sobre con interacción para ver creador */}
          <button
            id="envelope-author-signature"
            onClick={(e) => {
              e.stopPropagation();
              setShowCreatorModal(true);
            }}
            className="absolute bottom-2.5 right-3.5 z-30 select-none text-xs font-semibold text-amber-100/95 hover:text-white tracking-wide cursor-pointer group flex items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Dancing Script', 'Caveat', cursive, sans-serif",
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
            }}
            title="Detalle creado por Temis (Haz clic para ver más)"
          >
            <span>De: Temis</span>
          </button>
        </div>

        {/* Shadow */}
        <div id="envelope-shadow" className="shadow"></div>
      </div>

      {/* Action Buttons Below the Envelope */}
      <div
        className="mt-2 sm:mt-3 flex flex-col items-center gap-2.5 z-10 px-4 text-center w-full max-w-lg mx-auto"
        style={{
          paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleOpenGarden}
            id="see-sunflowers-btn"
            className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9b2226] via-[#780000] to-[#500000] hover:from-[#ba181b] hover:to-[#660708] text-amber-100 text-sm font-semibold tracking-wide shadow-[0_4px_20px_rgba(155,34,38,0.45)] hover:shadow-[0_6px_25px_rgba(200,29,37,0.6)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 border border-red-500/30"
          >
            <span className="text-base group-hover:rotate-45 transition-transform duration-500">
              🌻
            </span>
            <span>Ver mis girasoles floreciendo para ti</span>
          </button>

          <button
            onClick={handleToggleMusic}
            id="see-music-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 hover:bg-white text-rose-950 text-sm font-semibold tracking-wide border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-md"
          >
            <span>🎵</span>
            <span>{showMusicPlayer ? 'Ocultar música' : 'Poner música'}</span>
          </button>
        </div>

        <p
          id="interaction-hint"
          className="text-xs tracking-wider text-rose-900/80 font-medium cursor-pointer hover:text-rose-950 transition-colors"
          onClick={toggleCard}
        >
          {cardIsUp
            ? '♡ Haz clic para guardar la cartita ♡'
            : '♡ Pasa el cursor o haz clic en el sobre para leerlo ♡'}
        </p>

        {/* Footer date centered & creator link below */}
        <div className="flex flex-col items-center justify-center gap-1 -mt-1 select-none">
          <span
            id="creation-date-footer"
            className="text-base sm:text-lg text-rose-900/80 font-semibold tracking-wider text-center"
            style={{
              fontFamily: "'Dancing Script', 'Caveat', cursive, sans-serif",
            }}
          >
            14/09/2026
          </span>

          <button
            onClick={() => setShowCreatorModal(true)}
            className="inline-flex items-center justify-center text-[11px] font-medium text-rose-900/60 hover:text-rose-950 transition-colors px-2.5 py-0.5 rounded-full bg-rose-100/40 hover:bg-rose-100/80 border border-rose-200/50"
            title="Conocer más sobre el creador"
          >
            <span>Creador</span>
          </button>
        </div>
      </div>

      {/* Creator Modal Window */}
      <CreatorModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        profileUrl="https://regal-alfajores-27eeae.netlify.app/"
      />
    </div>
  );
}
