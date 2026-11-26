import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { PassKey, ProjectItem } from '../data/portfolio';
import { MediaSlot } from './MediaSlot';

interface BreakdownModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function BreakdownModal({ project, onClose }: BreakdownModalProps) {
  const [activePassKey, setActivePassKey] = useState<PassKey>('beauty');

  useEffect(() => {
    if (project && project.passes.length > 0) {
      setActivePassKey(project.passes[0].key);
    }
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const activePass =
    project?.passes.find((p) => p.key === activePassKey) ?? project?.passes[0];

  const specRows = project
    ? [
        { label: 'CATEGORY', value: project.category },
        { label: 'DISCIPLINE', value: project.specs.discipline },
        { label: 'POLYCOUNT', value: project.specs.polycount },
        { label: 'TEXTURES', value: project.specs.textures },
        { label: 'RENDERER / ENGINE', value: project.specs.renderer },
      ].filter((row) => Boolean(row.value))
    : [];

  return (
    <AnimatePresence>
      {project && activePass && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-sm sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="breakdown-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="my-auto w-full max-w-6xl border border-white/[0.1] bg-[#0A0A0A] shadow-2xl"
          >
            {/* Modal top bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 bg-[#D2FF3A]" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#8E8E93]">
                  {project.number} / BREAKDOWN VIEWER
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121214] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#F5F5F5] transition-colors hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
              >
                <span>ESC</span>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Pass switcher bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] bg-[#121214]/60 px-5 py-3 sm:px-7">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
                PASS:
              </span>
              {project.passes.map((pass) => {
                const isActive = pass.key === activePass.key;
                return (
                  <button
                    key={pass.key}
                    type="button"
                    onClick={() => setActivePassKey(pass.key)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      isActive
                        ? 'bg-[#D2FF3A] font-medium text-[#0A0A0A]'
                        : 'border border-white/[0.08] bg-[#121214] text-[#8E8E93] hover:border-white/20 hover:text-[#F5F5F5]'
                    }`}
                  >
                    {pass.label}
                  </button>
                );
              })}
            </div>

            {/* Main content: Viewport + Technical Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="border-b border-white/[0.08] p-4 sm:p-6 lg:col-span-8 lg:border-b-0 lg:border-r">
                <MediaSlot
                  key={`${project.id}-${activePass.key}`}
                  media={activePass.media}
                  aspectClass="aspect-[16/10]"
                  priority
                  enableLightbox
                />
              </div>

              <div className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8E8E93]">
                    PROJECT {project.number}
                  </span>
                  <h3
                    id="breakdown-modal-title"
                    className="mt-1.5 font-display text-2xl font-bold tracking-[-0.025em] text-[#F5F5F5] sm:text-3xl"
                  >
                    {project.title}
                  </h3>

                  {/* Technical spec rows */}
                  <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                    {specRows.length > 0 ? (
                      specRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-baseline justify-between gap-4 py-3"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
                            {row.label}
                          </span>
                          <span className="text-right font-mono text-xs text-[#F5F5F5]">
                            {row.value}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-3.5 font-mono text-xs text-[#8E8E93]">
                        Technical specifications not populated yet.
                      </div>
                    )}

                    {project.specs.software.length > 0 && (
                      <div className="py-3.5">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
                          SOFTWARE USED
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {project.specs.software.map((tool) => (
                            <span
                              key={tool}
                              className="border border-white/[0.1] bg-[#121214] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#F5F5F5]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {project.specs.notes && (
                    <div className="mt-5">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
                        NOTES
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-[#8E8E93]">
                        {project.specs.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 font-mono text-[10px] uppercase tracking-[0.13em] text-[#8E8E93]/70">
                  ACTIVE SLOT: {activePass.media.slotId}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
