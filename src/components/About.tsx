import { motion } from 'framer-motion';
import { aboutData } from '../data/portfolio';
import { MediaSlot } from './MediaSlot';
import { SectionHeader } from './SectionHeader';

export function About() {
  return (
    <section
      id="about"
      className="border-b border-white/[0.08] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="04"
          label="ABOUT"
          rightMeta="LUBLIN, POLAND"
        />

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Portrait / Workstation MediaSlot */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-5"
          >
            <MediaSlot
              media={aboutData.media}
              aspectClass="aspect-[4/5]"
              enableLightbox
            />
          </motion.div>

          {/* Right column: Grounded Bio + Metadata on calm studio surface */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="studio-surface p-7 sm:p-10 lg:col-span-7 lg:p-12"
          >
            <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-[#F5F5F7] sm:text-4xl">
              Sculptural precision backed by a technical foundation.
            </h2>

            <p className="mt-6 text-base leading-[1.68] text-[#C8C8D2] sm:text-[1.075rem]">
              {aboutData.bio}
            </p>

            {/* Structured fact list */}
            <dl className="mt-10 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {aboutData.details.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-3 sm:gap-4"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-[#A6A6B4]">
                    {item.label}
                  </dt>
                  <dd className="font-mono text-xs font-medium text-[#F5F5F7] sm:col-span-2 sm:text-right">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
