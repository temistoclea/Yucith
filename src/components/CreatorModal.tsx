import React from 'react';
import { ExternalLink, Heart, Code2, User } from 'lucide-react';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUrl?: string;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({
  isOpen,
  onClose,
  profileUrl = 'https://regal-alfajores-27eeae.netlify.app/',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1a1c29] via-[#12141f] to-[#0c0d14] text-neutral-100 p-6 shadow-2xl border border-amber-400/20 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Avatar badge / Creator icon */}
        <div className="relative mx-auto mb-3 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-400 p-[2px] shadow-lg">
          <div className="w-full h-full rounded-full bg-[#12141f] flex items-center justify-center text-2xl">
            <span role="img" aria-label="Temis">🌻</span>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[#0c0d14] p-1 rounded-full text-[10px] font-bold">
            <Code2 size={12} />
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[11px] font-medium mb-1.5 border border-amber-400/20">
          <Heart size={11} className="fill-amber-400 text-amber-400" />
          <span>Creado para ti</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-wide">
          Temistocle Atencio
        </h3>
        <p className="text-xs text-amber-100/70 mt-0.5">
          Programador & creador de este detalle
        </p>

        {/* Dedication quote */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-neutral-300 leading-relaxed italic text-center">
          «Cada línea de código, girasol y nota musical fue pensada para sacarte una sonrisa hoy.»
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 text-xs font-bold shadow-md hover:shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <User size={14} />
            <span>Ver mi perfil y redes</span>
            <ExternalLink size={13} className="opacity-80" />
          </a>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-full text-xs font-medium text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10"
          >
            Volver a la carta
          </button>
        </div>
      </div>
    </div>
  );
};
