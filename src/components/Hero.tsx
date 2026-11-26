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
      className="border-b border-white/[0.08] py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeader
          code="01"
          label="PORTFOLIO"
          rightMeta={siteConfig.location.toUpperCase()}
        />

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* Left editorial typography column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="editorial-text-guard lg:col-span-7"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8E8E93]">
              {siteConfig.name}
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold leading-[0.97] tracking-[-0.035em] text-[#F5F5F5] sm:text-6xl lg:text-[4.25rem]">
              3D Character &amp;
              <br />
              Digital Sculpt
              <br />
              <span className="text-[#D2FF3A]">Artist.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#B4B4BC] sm:text-lg">
              {siteConfig.heroSummary}
            </p>

            {/* Primary & secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 [text-shadow:none]">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-[#D2FF3A] px-6 py-3 font-mono text-xs font-medium uppercase tracking-[0.13em] text-[#0A0A0A] transition-transform duration-150 hover:scale-[1.015] active:scale-[0.99]"
              >
                <span>SELECTED WORK</span>
                <ArrowDownRight className="h-4 w-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#0D0C13]/75 px-6 py-3 font-mono text-xs uppercase tracking-[0.13em] text-[#F5F5F5] backdrop-blur-md transition-colors duration-150 hover:border-white/30"
              >
                <span>CONTACT</span>
              </a>

              {activeSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#0D0C13]/65 px-4 py-3 font-mono text-xs uppercase tracking-[0.13em] text-[#B4B4BC] backdrop-blur-md transition-colors duration-150 hover:border-white/25 hover:text-[#F5F5F5]"
                >
                  <span>{social.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right featured render viewport */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <MediaSlot
              media={heroMedia}
              aspectClass="aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5]"
              priority
              enableLightbox
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
