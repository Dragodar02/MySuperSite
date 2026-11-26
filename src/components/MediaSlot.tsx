import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { MediaSlotConfig } from '../data/portfolio';
import { isVideoSource, resolveAssetPath } from '../utils/assetPath';
import { LightboxModal } from './LightboxModal';

interface MediaSlotProps {
  media: MediaSlotConfig;
  aspectClass?: string;
  priority?: boolean;
  enableLightbox?: boolean;
  className?: string;
}

export function MediaSlot({
  media,
  aspectClass = 'aspect-[16/10]',
  priority = false,
  enableLightbox = false,
  className = '',
}: MediaSlotProps) {
  const [hasError, setHasError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const resolvedSrc = resolveAssetPath(media.src);
  const showMedia = Boolean(resolvedSrc && !hasError);

  return (
    <>
      <div
        className={`group/slot relative w-full overflow-hidden border border-white/[0.1] bg-[#0D0D13]/75 backdrop-blur-md ${aspectClass} ${className}`}
      >
        {showMedia && resolvedSrc ? (
          <>
            {isVideoSource(resolvedSrc) ? (
              <video
                src={resolvedSrc}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setHasError(true)}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/slot:scale-[1.015]"
              />
            ) : (
              <img
                src={resolvedSrc}
                alt={media.alt || media.label}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onError={() => setHasError(true)}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/slot:scale-[1.015]"
              />
            )}

            {enableLightbox && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Inspect ${media.label} fullscreen`}
                className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-3.5 opacity-0 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.18] bg-[#0A0A0F]/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#F5F5F5] backdrop-blur-sm">
                  <Maximize2 className="h-3 w-3 text-[#D2FF3A]" />
                  INSPECT FULLSCREEN
                </span>
              </button>
            )}
          </>
        ) : (
          <div className="studio-grid relative flex h-full w-full select-none flex-col justify-between p-4 sm:p-5">
            {/* Corner crosshair / viewport reticle markers */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-white/25 transition-colors duration-200 group-hover/slot:border-[#D2FF3A]/60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-white/25 transition-colors duration-200 group-hover/slot:border-[#D2FF3A]/60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-white/25 transition-colors duration-200 group-hover/slot:border-[#D2FF3A]/60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-white/25 transition-colors duration-200 group-hover/slot:border-[#D2FF3A]/60"
            />

            {/* Top technical bar */}
            <div className="relative z-10 flex items-center justify-between gap-2 px-1.5 pt-0.5">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
                <span className="h-1.5 w-1.5 bg-white/25 transition-colors duration-200 group-hover/slot:bg-[#D2FF3A]" />
                VIEWPORT SLOT
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8E8E93]">
                {media.spec}
              </span>
            </div>

            {/* Center slot identifier & planned media description */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center px-3 py-4 text-center">
              <div
                aria-hidden="true"
                className="mb-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.1] bg-[#0A0A0F]/80 font-mono text-xs text-[#8E8E93]/80"
              >
                +
              </div>
              <span className="rounded border border-white/[0.12] bg-[#0A0A0F]/85 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#F5F5F5]">
                {media.slotId}
              </span>
              <p className="mt-2.5 max-w-sm font-mono text-[11px] leading-relaxed tracking-[0.06em] text-[#9E9EA8]">
                PLANNED MEDIA: {media.label}
              </p>
            </div>

            {/* Bottom path hint */}
            <div className="relative z-10 flex items-center justify-between gap-2 px-1.5 pb-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#8E8E93]/75">
              <span>PUBLIC/RENDERS/</span>
              <span>SRC: NULL</span>
            </div>
          </div>
        )}
      </div>

      {enableLightbox && showMedia && (
        <LightboxModal
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          src={resolvedSrc}
          title={media.label}
          spec={media.spec}
        />
      )}
    </>
  );
}
