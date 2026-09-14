import React, { useState, useRef, useEffect } from 'react';

export interface DedicatedSong {
  id: string;
  title: string;
  artist: string;
  quote: string;
  cover: string;
  src: string;
  tag: string;
}

export const DEDICATED_PLAYLIST: DedicatedSong[] = [
  {
    id: 'solo-tuyo',
    title: 'Solo Tuyo',
    artist: 'Felipe Peláez',
    quote: '«Déjame cambiarte tu destino, que me sobran ganas de ser solo tuyo, mi reina...»',
    cover: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop',
    src: '/solo-tuyo.mp3',
    tag: '🌻 La principal',
  },
  {
    id: 'la-serenata',
    title: 'La Serenata',
    artist: 'Rafa Pérez',
    quote: '«Voy a gritar que me encantas... ¡porque me gustas tú, tú me gustas mujer!»',
    cover: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
    src: '/la-serenata.mp3',
    tag: '🪗 Serenata',
  },
  {
    id: 'el-jueguito',
    title: 'El Jueguito',
    artist: 'Churo Díaz & Elías Mendoza',
    quote: '«Tienes ese no sé qué que me enamora, esa miradita... Yo te quiero a ti, solamente a ti»',
    cover: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800&auto=format&fit=crop',
    src: '/el-jueguito.mp3',
    tag: '💛 De verdad',
  },
  {
    id: 'tu-tan-guapa',
    title: 'Tú Tan Guapa',
    artist: 'Morat',
    quote: '«Yo solo quiero perderme en tu pelo y le agradezco al cielo que te conocí...»',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    src: '/tu-tan-guapa.mp3',
    tag: '❤️ Para ti',
  },
];

interface DedicatedMusicPlayerProps {
  onClose?: () => void;
  autoPlay?: boolean;
}

export const DedicatedMusicPlayer: React.FC<DedicatedMusicPlayerProps> = ({
  onClose,
  autoPlay = false,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [isListView, setIsListView] = useState(false);
  const [hasAudioError, setHasAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);

  const currentSong = DEDICATED_PLAYLIST[currentIdx];

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasAudioError(false);
        })
        .catch((err) => {
          console.warn('Playback error:', err);
          setHasAudioError(true);
        });
    }
  };

  const playSong = (index: number) => {
    setCurrentIdx(index);
    setIsPlaying(true);
    setIsListView(false);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % DEDICATED_PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleBack = () => {
    setCurrentIdx((prev) => (prev - 1 + DEDICATED_PLAYLIST.length) % DEDICATED_PLAYLIST.length);
    setIsPlaying(true);
  };

  // Allow Escape key to close playlist or player
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isListView) {
          e.preventDefault();
          e.stopPropagation();
          setIsListView(false);
        } else if (onClose) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isListView, onClose]);

  // Synchronize audio on song change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      setHasAudioError(false);
      if (isPlaying || autoPlay) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Wait for user gesture or audio load
          });
      }
    }
  }, [currentIdx]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    if (dur > 0) {
      setProgressPercent((cur / dur) * 100);
      setCurrentTimeStr(formatTime(cur));
      setDurationStr(formatTime(dur));
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDurationStr(formatTime(audioRef.current.duration || 0));
    setHasAudioError(false);
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleScrub = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressTrackRef.current || !audioRef.current) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const fraction = Math.max(0, Math.min(1, clickX / width));
    if (audioRef.current.duration) {
      audioRef.current.currentTime = fraction * audioRef.current.duration;
    }
  };

  // Pause audio when unmounting
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div
      id="dedicated-music-player"
      className="flex flex-col bg-[#1c0e0c]/95 backdrop-blur-md text-amber-50 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden border border-red-900/60 transition-all duration-300 select-none w-[320px] max-w-[calc(100vw-2rem)]"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setHasAudioError(true)}
      />

      {/* Top Cover Slider with Dynamic Transition */}
      <div className="relative h-44 w-full bg-black overflow-hidden group">
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c0e0c] via-black/40 to-black/30" />

        {/* Top Header Controls: Badge, Toggle List View, Close */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-700 text-white shadow-md border border-red-500/40 backdrop-blur-sm">
            {currentSong.tag}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Playlist Toggle */}
            <button
              onClick={() => setIsListView((prev) => !prev)}
              id="player-toggle-list-view"
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all backdrop-blur-sm flex items-center gap-1 ${
                isListView
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-black/60 hover:bg-black/80 text-amber-100 border border-white/10'
              }`}
              title={`Ver las ${DEDICATED_PLAYLIST.length} canciones`}
            >
              <span>{isListView ? 'Cerrar lista' : `Canciones (${DEDICATED_PLAYLIST.length})`}</span>
            </button>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                id="close-dedicated-player-btn"
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xs transition-colors backdrop-blur-sm border border-white/10"
                title="Cerrar"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Center Play Button */}
        {!isListView && (
          <button
            onClick={togglePlay}
            id="center-play-button"
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 to-amber-500 hover:from-red-600 hover:to-amber-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(230,57,70,0.7)] transition-transform hover:scale-110 active:scale-95 z-20 border border-white/20"
            title={isPlaying ? 'Pausa' : 'Reproducir'}
          >
            {isPlaying ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Song Info Over Image */}
        <div className="absolute bottom-2.5 left-4 right-4 z-20 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base leading-tight drop-shadow truncate">
              {currentSong.title}
            </h3>
            <span className="text-[11px] text-amber-300 font-semibold">
              {currentIdx + 1} / {DEDICATED_PLAYLIST.length}
            </span>
          </div>
          <p className="text-xs text-amber-200/90 font-medium drop-shadow truncate">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Playlist List (Expandable) or Romantic Quote */}
      {isListView ? (
        <div className="max-h-48 overflow-y-auto divide-y divide-red-900/30 bg-[#24120f]/90">
          {DEDICATED_PLAYLIST.map((song, i) => {
            const isActive = i === currentIdx;
            return (
              <div
                key={song.id}
                onClick={() => playSong(i)}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-red-950/70 text-amber-200 font-bold border-l-2 border-amber-400'
                    : 'hover:bg-red-950/30 text-amber-100/70'
                }`}
              >
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-white/10">
                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                  {isActive && isPlaying && (
                    <div className="absolute inset-0 bg-red-700/60 flex items-center justify-center text-white text-[10px]">
                      ▶
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate font-semibold flex items-center gap-1.5">
                    <span>{song.title}</span>
                    <span className="text-[10px] font-normal text-amber-400/80">
                      {song.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-100/50 truncate">
                    {song.artist}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Meaningful quote of the current song */
        <div className="px-4 py-3 bg-[#24120f] border-b border-red-900/40">
          <p className="text-[11.5px] italic text-amber-100/90 leading-snug text-center font-medium">
            {currentSong.quote}
          </p>
        </div>
      )}

      {/* Audio Controls & Progress */}
      <div className="p-3.5 flex flex-col gap-2 bg-[#1c0e0c]">
        {/* Progress scrub bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-200/50 font-semibold w-7 text-right">
            {currentTimeStr}
          </span>
          <div
            ref={progressTrackRef}
            onPointerDown={handleScrub}
            className="relative flex-1 h-2 bg-black/50 hover:bg-black/70 rounded-full cursor-pointer transition-colors border border-red-900/30"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-200 shadow border border-red-800" />
            </div>
          </div>
          <span className="text-[11px] text-amber-200/50 font-semibold w-7">
            {durationStr}
          </span>
        </div>

        {/* Action Controls: Previous, Play, Next */}
        <div className="flex items-center justify-between pt-1">
          {/* Back Button */}
          <button
            onClick={handleBack}
            id="dedicated-btn-back"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-amber-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            title="Canción anterior"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Center Toggle Button */}
          <button
            onClick={togglePlay}
            id="dedicated-bottom-toggle"
            className="px-5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 border border-red-400/30"
          >
            <span>{isPlaying ? 'Pausa' : 'Reproducir'}</span>
            <span>{isPlaying ? '⏸' : '▶'}</span>
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            id="dedicated-btn-next"
            className="w-8 h-8 rounded-full hover:bg-white/10 text-amber-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            title="Siguiente canción"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Audio helper notice if file not yet uploaded */}
        {hasAudioError && (
          <div className="mt-1 p-2 rounded-xl bg-red-950/70 border border-red-700/50 text-[11px] text-red-200 leading-tight text-center">
            💡 Sube el archivo a <strong>public/</strong> como{' '}
            <strong>{currentSong.src.replace('/', '')}</strong> para que suene de inmediato.
          </div>
        )}
      </div>
    </div>
  );
};
