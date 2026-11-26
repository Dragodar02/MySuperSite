import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import {
  filterCategories,
  projects,
  type FilterCategory,
  type ProjectItem,
} from '../data/portfolio';
import { BreakdownModal } from './BreakdownModal';
import { MediaSlot } from './MediaSlot';
import { SectionHeader } from './SectionHeader';

export function SelectedWork() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section
      id="work"
      className="border-b border-white/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="02"
          label="SELECTED WORK"
          rightMeta="CLICK ANY WORK FOR BREAKDOWN PASSES"
        />

        {/* Heading + Category Filter Tabs */}
        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="editorial-text-guard font-display text-3xl font-bold tracking-[-0.03em] text-[#F5F5F5] sm:text-4xl">
            Selected Works
          </h2>

          <div
            role="tablist"
            aria-label="Filter portfolio by category"
            className="flex flex-wrap items-center gap-2"
          >
            {filterCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.13em] transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#D2FF3A] font-medium text-[#0A0A0A]'
                      : 'border border-white/[0.1] bg-[#0D0C13]/75 text-[#9E9EA8] backdrop-blur-md hover:border-white/25 hover:text-[#F5F5F5]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Portfolio Grid */}
        {filteredProjects.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group flex flex-col border border-white/[0.1] bg-[#0C0C12]/72 backdrop-blur-md transition-colors duration-200 hover:border-white/25 hover:bg-[#101018]/80"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="flex h-full w-full flex-col text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D2FF3A]"
                >
                  <div className="w-full p-3 pb-0 sm:p-4 sm:pb-0">
                    <MediaSlot
                      media={project.thumbnail}
                      aspectClass="aspect-[16/10]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8E8E93]">
                            {project.number}
                          </span>
                          {project.category && (
                            <>
                              <span className="text-white/20">·</span>
                              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#D2FF3A]">
                                {project.category}
                              </span>
                            </>
                          )}
                        </div>

                        <h3
                          className={`mt-1.5 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl ${
                            project.isEmptySlot
                              ? 'text-[#9E9EA8]'
                              : 'text-[#F5F5F5]'
                          }`}
                        >
                          {project.title}
                        </h3>
                      </div>

                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-[#14141C]/85 text-[#8E8E93] transition-colors duration-200 group-hover:border-[#D2FF3A] group-hover:text-[#D2FF3A]">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3.5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.13em] text-[#9E9EA8]">
                        {project.cardMeta}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#F5F5F5]/80 group-hover:text-[#D2FF3A]">
                        VIEW BREAKDOWN [{project.passes.length} PASSES]
                      </span>
                    </div>
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center border border-white/[0.1] bg-[#0C0C12]/72 px-6 py-16 text-center backdrop-blur-md">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#9E9EA8]">
              NO PUBLISHED WORKS IN &ldquo;{activeCategory.toUpperCase()}&rdquo; YET
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="mt-5 rounded-full border border-white/[0.14] bg-[#14141C]/85 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.13em] text-[#F5F5F5] transition-colors hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
            >
              SHOW ALL SLOTS
            </button>
          </div>
        )}
      </div>

      <BreakdownModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
