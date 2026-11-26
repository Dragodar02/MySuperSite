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
      className="border-b border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="02"
          label="SELECTED WORK"
          rightMeta="CLICK ANY WORK FOR BREAKDOWN PASSES"
        />

        {/* Heading + Category Filter Bar on calm studio surface */}
        <div className="studio-surface mt-8 flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:px-8 sm:py-6">
          <h2 className="font-display text-3xl font-bold tracking-[-0.03em] text-[#F5F5F7] sm:text-4xl">
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
                  className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#D2FF3A] font-semibold text-[#0A0A0A]'
                      : 'border border-white/[0.12] bg-[#14141D] text-[#B5B5C2] hover:border-white/30 hover:text-[#F5F5F7]'
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
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="studio-surface group flex flex-col transition-colors duration-200 hover:border-white/25"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="flex h-full w-full flex-col text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D2FF3A]"
                >
                  <div className="w-full p-3.5 pb-0 sm:p-5 sm:pb-0">
                    <MediaSlot
                      media={project.thumbnail}
                      aspectClass="aspect-[16/10]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#A6A6B4]">
                            {project.number}
                          </span>
                          {project.category && (
                            <>
                              <span className="text-white/25">·</span>
                              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#D2FF3A]">
                                {project.category}
                              </span>
                            </>
                          )}
                        </div>

                        <h3
                          className={`mt-2 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl ${
                            project.isEmptySlot
                              ? 'text-[#B5B5C2]'
                              : 'text-[#F5F5F7]'
                          }`}
                        >
                          {project.title}
                        </h3>
                      </div>

                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-[#15151E] text-[#A6A6B4] transition-colors duration-200 group-hover:border-[#D2FF3A] group-hover:text-[#D2FF3A]">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.13em] text-[#A6A6B4]">
                        {project.cardMeta}
                      </span>
                      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#C8C8D2] group-hover:text-[#D2FF3A]">
                        VIEW BREAKDOWN [{project.passes.length} PASSES]
                      </span>
                    </div>
                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="studio-surface mt-8 flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#B5B5C2]">
              NO PUBLISHED WORKS IN &ldquo;{activeCategory.toUpperCase()}&rdquo; YET
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="mt-5 rounded-full border border-white/[0.16] bg-[#14141D] px-5 py-2 font-mono text-xs uppercase tracking-[0.13em] text-[#F5F5F7] transition-colors hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
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
