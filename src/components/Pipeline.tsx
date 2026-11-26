import { motion } from 'framer-motion';
import { coreSoftware, pipelineStages } from '../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Pipeline() {
  return (
    <section
      id="pipeline"
      className="border-b border-white/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="03"
          label="PIPELINE & SOFTWARE"
          rightMeta="SCULPT · MODELING · RENDER"
        />

        <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="editorial-text-guard max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl">
              Production Workflow
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#B4B4BC]">
              Clean stage-by-stage workflow focused on sculptural form, mesh
              structure, and controlled studio presentation.
            </p>
          </div>

          {/* Core software strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9E9EA8]">
              CORE TOOLS:
            </span>
            {coreSoftware.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-2 border border-white/[0.12] bg-[#0D0C14]/75 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-[#F5F5F5] backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 bg-[#D2FF3A]" aria-hidden="true" />
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Pipeline Stage Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pipelineStages.map((stage, index) => (
            <motion.div
              key={stage.stageNumber}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col justify-between border border-white/[0.1] bg-[#0C0C12]/74 p-6 backdrop-blur-md sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#D2FF3A]">
                    STAGE {stage.stageNumber}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8E8E93]">
                    3D WORKFLOW
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-[#F5F5F5]">
                  {stage.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#A4A4AE]">
                  {stage.description}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                {stage.tools.map((tool) => (
                  <span
                    key={tool}
                    className="border border-white/[0.1] bg-[#14141C]/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.11em] text-[#F5F5F5]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
