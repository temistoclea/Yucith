import React, { useState, useRef, useEffect } from 'react';

export interface SongItem {
  name: string;
  artist: string;
  cover: string;
  src: string;
}

const PLAYLIST: SongItem[] = [
  {
    name: 'No Time',
    artist: 'Lastlings',
    cover: 'http://physical-authority.surge.sh/imgs/1.jpg',
    src: 'http://physical-authority.surge.sh/music/1.mp3',
  },
  {
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    cover: 'http://physical-authority.surge.sh/imgs/2.jpg',
    src: 'http://physical-authority.surge.sh/music/2.mp3',
  },
  {
    name: 'Джованна',
    artist: 'Enrasta',
    cover: 'http://physical-authority.surge.sh/imgs/3.jpg',
    src: 'http://physical-authority.surge.sh/music/3.mp3',
  },
  {
    name: 'A Man',
    artist: 'Travis Scott',
    cover: 'http://physical-authority.surge.sh/imgs/4.jpg',
    src: 'http://physical-authority.surge.sh/music/4.mp3',
  },
  {
    name: 'Unforgetting',
    artist: 'Zaxx',
    cover: 'http://physical-authority.surge.sh/imgs/5.jpg',
    src: 'http://physical-authority.surge.sh/music/5.mp3',
  },
  {
    name: 'Waharan',
    artist: 'Randall',
    cover: 'http://physical-authority.surge.sh/imgs/6.jpg',
    src: 'http://physical-authority.surge.sh/music/6.mp3',
  },
  {
    name: 'Starlight (4AM Remix)',
    artist: 'Jai Wolf feat. Mr Gabriel',
    cover: 'http://physical-authority.surge.sh/imgs/7.jpg',
    src: 'http://physical-authority.surge.sh/music/7.mp3',
  },
];

interface MusicPlayerProps {
  onClose?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [coverErrors, setCoverErrors] = useState<Record<number, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);

  const currentSong = PLAYLIST[currentIdx];

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Play/pause control
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Audio play prevented or blocked:', e);
        setIsPlaying(false);
      });
    }
  };

  const playIndex = (idx: number) => {
    setCurrentIdx(idx);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentIdx < PLAYLIST.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setIsPlaying(true);
    } else {
      setCurrentIdx(0);
      setIsPlaying(true);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setIsPlaying(true);
    } else {
      setCurrentIdx(PLAYLIST.length - 1);
      setIsPlaying(true);
    }
  };

  // Synchronize audio when currentIdx changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
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

  return (
    <div
      id="custom-music-player"
      className="music-player-wrapper flex flex-col bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60"
      style={{
        width: '310px',
        fontFamily: "'Quicksand', sans-serif",
      }}
    >
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Top Header Card (Mini or Expanded Cover) */}
      <div
        className={`relative transition-all duration-500 ease-in-out bg-slate-900 overflow-hidden ${
          isExpanded ? 'h-64' : 'h-24'
        }`}
      >
        {/* Background Cover Image with Slider */}
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIdx * 100}%)` }}
        >
          {PLAYLIST.map((song, i) => (
            <div key={i} className="min-w-full h-full relative">
              {!coverErrors[i] ? (
                <img
                  src={song.cover}
                  alt={song.name}
                  onError={() => setCoverErrors((prev) => ({ ...prev, [i]: true }))}
                  className="w-full h-full object-cover brightness-75"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-bold">
                  🌻
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overlay Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Playlist Expand Button (Top Left) */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          id="toggle-player-expand-btn"
          className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
          title={isExpanded ? 'Ver lista de canciones' : 'Ver portada completa'}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
        </button>

        {/* Close Player (Top Right) if onClose given */}
        {onClose && (
          <button
            onClick={onClose}
            id="close-music-player-btn"
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105"
            title="Cerrar reproductor"
          >
            ✕
          </button>
        )}

        {/* Center Play Button in Expanded Mode */}
        {isExpanded && (
          <button
            onClick={togglePlay}
            id="cover-center-play-btn"
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/90 hover:bg-amber-400 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-20"
          >
            {isPlaying ? (
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 fill-current ml-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Title and Artist Info Overlay */}
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          className="absolute bottom-2.5 left-4 right-4 z-20 text-white cursor-pointer select-none"
        >
          <div className="text-sm font-bold truncate leading-tight drop-shadow">
            {currentSong.name}
          </div>
          <div className="text-[11px] text-amber-200/90 font-medium truncate drop-shadow">
            {currentSong.artist}
          </div>
        </div>
      </div>

      {/* Control Bar: Back, Play, Next, Progress */}
      <div className="p-3 bg-white flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          {/* Back Button */}
          <button
            onClick={handleBack}
            id="player-btn-back"
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-all hover:scale-110 active:scale-95"
            title="Anterior"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            id="player-btn-play"
            className="w-10 h-10 rounded-full bg-[#003049] hover:bg-[#054469] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pausa' : 'Reproducir'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            id="player-btn-next"
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-all hover:scale-110 active:scale-95"
            title="Siguiente"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Scrub Progress Bar */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] text-slate-400 font-semibold w-7 text-right">
            {currentTimeStr}
          </span>
          <div
            ref={progressTrackRef}
            onPointerDown={handleScrub}
            className="relative flex-1 h-2 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-[#003049] rounded-full"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-sm border border-slate-300" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold w-7">
            {durationStr}
          </span>
        </div>
      </div>

      {/* Song List (Scrollable) */}
      <div className="max-h-48 overflow-y-auto border-t border-slate-100 divide-y divide-slate-100">
        {PLAYLIST.map((song, idx) => {
          const isActive = idx === currentIdx;
          return (
            <div
              key={idx}
              onClick={() => playIndex(idx)}
              className={`flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <img
                src={song.cover}
                alt={song.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate font-bold">
                  {song.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {song.artist}
                </div>
              </div>
              {isActive && isPlaying && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-amber-500 animate-bounce" style={{ animationDuration: '0.6s' }} />
                  <span className="w-0.5 h-2 bg-amber-500 animate-bounce" style={{ animationDuration: '0.8s' }} />
                  <span className="w-0.5 h-full bg-amber-500 animate-bounce" style={{ animationDuration: '0.5s' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
