import { motion } from 'framer-motion';
import { coreSoftware, pipelineStages } from '../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Pipeline() {
  return (
    <section
      id="pipeline"
      className="border-b border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="03"
          label="PIPELINE & SOFTWARE"
          rightMeta="SCULPT · MODELING · RENDER"
        />

        {/* Intro & Core Tools Strip on calm studio surface */}
        <div className="studio-surface mt-8 flex flex-col justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-[#F5F5F7] sm:text-4xl">
              Production Workflow
            </h2>
            <p className="mt-3 text-base leading-[1.65] text-[#C8C8D2]">
              Clean stage-by-stage workflow focused on sculptural form, mesh
              structure, and controlled studio presentation.
            </p>
          </div>

          {/* Core software strip */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A6A6B4]">
              CORE TOOLS:
            </span>
            {coreSoftware.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-2 border border-white/[0.14] bg-[#14141D] px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-[#F5F5F7]"
              >
                <span className="h-1.5 w-1.5 bg-[#D2FF3A]" aria-hidden="true" />
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Pipeline Stage Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pipelineStages.map((stage, index) => (
            <motion.div
              key={stage.stageNumber}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="studio-surface flex flex-col justify-between p-6 sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#D2FF3A]">
                    STAGE {stage.stageNumber}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.13em] text-[#A6A6B4]">
                    3D WORKFLOW
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">
                  {stage.title}
                </h3>

                <p className="mt-3.5 text-[15px] leading-[1.65] text-[#C8C8D2]">
                  {stage.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                {stage.tools.map((tool) => (
                  <span
                    key={tool}
                    className="border border-white/[0.12] bg-[#15151E] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.11em] text-[#F5F5F7]"
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
