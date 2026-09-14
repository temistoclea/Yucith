import React, { useState, useRef, useEffect } from 'react';

interface SingleSongPlayerProps {
  onClose?: () => void;
  autoPlay?: boolean;
}

export const SingleSongPlayer: React.FC<SingleSongPlayerProps> = ({ onClose, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');
  const [hasAudioError, setHasAudioError] = useState(false);

  // Song metadata
  const songTitle = 'Solo Tuyo';
  const songArtist = 'Felipe Peláez';
  const songQuote = '«Déjame cambiarte tu destino, que me sobran ganas de ser solo tuyo, mi reina...»';
  const songCover = 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=800&auto=format&fit=crop';
  
  // Audio sources: Checks public/solo-tuyo.mp3 first, or uploaded audio
  const audioSrc = '/solo-tuyo.mp3';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);

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
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasAudioError(false);
      }).catch((err) => {
        console.warn('Audio playback error or file not yet loaded:', err);
        setHasAudioError(true);
      });
    }
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be restricted by browser until user gesture
      });
    }
  }, [autoPlay]);

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
    setIsPlaying(false);
    setProgressPercent(0);
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
      id="single-song-player"
      className="flex flex-col bg-white/95 backdrop-blur-md text-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/50 transition-all duration-300"
      style={{
        width: '320px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setHasAudioError(true)}
      />

      {/* Album Art with Sunflower Theme */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden group">
        <img
          src={songCover}
          alt="Solo Tuyo"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

        {/* Top Tag & Close */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
            <span>🌻</span> Una canción para ti
          </span>
          {onClose && (
            <button
              onClick={onClose}
              id="close-single-player-btn"
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-xs transition-colors backdrop-blur-sm"
              title="Cerrar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Center Play Button */}
        <button
          onClick={togglePlay}
          id="single-song-center-play"
          className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 z-20"
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

        {/* Song Info Over Image */}
        <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
          <h3 className="font-bold text-base leading-tight drop-shadow truncate">
            {songTitle}
          </h3>
          <p className="text-xs text-amber-200/95 font-medium drop-shadow">
            {songArtist}
          </p>
        </div>
      </div>

      {/* Song quote / Meaningful lyrics */}
      <div className="px-4 py-3 bg-amber-50/70 border-b border-amber-100/60">
        <p className="text-[12px] italic text-[#003049] leading-relaxed text-center font-medium">
          {songQuote}
        </p>
      </div>

      {/* Audio Progress & Controls */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold w-7 text-right">
            {currentTimeStr}
          </span>
          <div
            ref={progressTrackRef}
            onPointerDown={handleScrub}
            className="relative flex-1 h-2 bg-slate-200 hover:bg-slate-300 rounded-full cursor-pointer transition-colors"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-[#003049] rounded-full"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow border border-slate-300" />
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold w-7">
            {durationStr}
          </span>
        </div>

        {/* Play/Pause bottom bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Reproduciendo...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Toca reproducir</span>
              </>
            )}
          </div>

          <button
            onClick={togglePlay}
            id="single-song-bottom-toggle"
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#003049] hover:bg-[#054469] text-white flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <span>{isPlaying ? 'Pausa' : 'Escuchar'}</span>
            <span>{isPlaying ? '⏸' : '▶'}</span>
          </button>
        </div>

        {/* Helpful hint when solo-tuyo.mp3 hasn't been uploaded yet */}
        {hasAudioError && (
          <div className="mt-1 p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-[11px] text-amber-900 leading-tight text-center">
            💡 Sube tu archivo a la carpeta <strong>public/</strong> con el nombre <strong>solo-tuyo.mp3</strong> para escucharlo directamente.
          </div>
        )}
      </div>
    </div>
  );
};
