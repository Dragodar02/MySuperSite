import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { contactData, heroMedia, siteConfig } from '../data/portfolio';
import { MediaSlot } from './MediaSlot';
import { SectionHeader } from './SectionHeader';

export function Hero() {
  const activeSocials = contactData.socials.filter(
    (s) => s.enabled && s.url.trim().length > 0
  );

  return (
    <section
      id="top"
      className="border-b border-white/[0.08] py-16 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="01"
          label="PORTFOLIO"
          rightMeta={siteConfig.location.toUpperCase()}
        />

        <div className="mt-8 grid grid-cols-1 items-stretch gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-10">
          {/* Left editorial typography surface */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="studio-surface flex flex-col justify-center p-7 sm:p-10 lg:col-span-7 lg:p-12"
          >
            <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#A6A6B4]">
              {siteConfig.name}
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-[-0.035em] text-[#F5F5F7] sm:text-6xl lg:text-[4.15rem]">
              3D Character &amp;
              <br />
              Digital Sculpt
              <br />
              <span className="text-[#D2FF3A]">Artist.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-[1.65] text-[#C8C8D2] sm:text-[1.1rem]">
              {siteConfig.heroSummary}
            </p>

            {/* Primary & secondary CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-[#D2FF3A] px-6 py-3 font-mono text-xs font-semibold uppercase tracking-[0.13em] text-[#0A0A0A] transition-transform duration-150 hover:scale-[1.015] active:scale-[0.99]"
              >
                <span>SELECTED WORK</span>
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.16] bg-[#14141D] px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.13em] text-[#F5F5F7] transition-colors duration-150 hover:border-white/35"
              >
                <span>CONTACT</span>
              </a>
            </div>

            {activeSocials.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-white/[0.08] pt-5">
                {activeSocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#14141D]/90 px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-[#C8C8D2] transition-colors duration-150 hover:border-[#D2FF3A] hover:text-[#D2FF3A]"
                  >
                    <span>{social.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right featured render viewport */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
            className="flex lg:col-span-5"
          >
            <MediaSlot
              media={heroMedia}
              aspectClass="aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:min-h-full"
              priority
              enableLightbox
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
