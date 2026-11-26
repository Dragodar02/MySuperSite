import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { isVideoSource } from '../utils/assetPath';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string | null;
  title: string;
  spec?: string;
}

export function LightboxModal({
  isOpen,
  onClose,
  src,
  title,
  spec,
}: LightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] flex flex-col bg-[#0A0A0A]/95 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="h-2 w-2 shrink-0 bg-[#D2FF3A]" />
              <span className="truncate font-mono text-xs uppercase tracking-[0.12em] text-[#F5F5F5]">
                {title}
              </span>
              {spec && (
                <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-[#8E8E93] sm:inline">
                  · {spec}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#121214] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#F5F5F5] transition-colors hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
            >
              <span>CLOSE</span>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-full max-w-6xl items-center justify-center"
            >
              {isVideoSource(src) ? (
                <video
                  src={src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[82vh] max-w-full border border-white/[0.08] bg-[#111113] object-contain"
                />
              ) : (
                <img
                  src={src}
                  alt={title}
                  className="max-h-[82vh] max-w-full border border-white/[0.08] bg-[#111113] object-contain"
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
