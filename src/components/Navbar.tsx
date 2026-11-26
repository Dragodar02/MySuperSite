import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../data/portfolio';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.1] bg-[#08080D]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Brand mark */}
        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 focus:outline-none"
        >
          <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#F5F5F7] transition-colors group-hover:text-[#D2FF3A]">
            {siteConfig.brandMark}
          </span>
          {siteConfig.domain && (
            <>
              <span className="font-mono text-xs text-white/25">/</span>
              <span className="font-mono text-xs tracking-[0.08em] text-[#A6A6B4]">
                {siteConfig.domain}
              </span>
            </>
          )}
        </a>

        {/* Desktop navigation */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B5B5C2] transition-colors duration-150 hover:text-[#F5F5F7]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right status + mobile menu button */}
        <div className="flex items-center gap-3">
          {siteConfig.availableForWork && (
            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-full border border-white/[0.12] bg-[#12121A]/90 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.13em] text-[#F5F5F7] transition-colors hover:border-[#D2FF3A]/60 sm:inline-flex"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#D2FF3A]"
                aria-hidden="true"
              />
              <span>AVAILABLE FOR WORK</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center border border-white/[0.12] bg-[#12121A]/95 text-[#F5F5F7] md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="border-t border-white/[0.1] bg-[#08080D]/95 px-5 py-5 backdrop-blur-xl md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-3.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-1.5 font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#F5F5F7] transition-colors hover:text-[#D2FF3A]"
              >
                {link.label}
              </a>
            ))}
            {siteConfig.availableForWork && (
              <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.12] bg-[#14141D] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.13em] text-[#C8C8D2]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D2FF3A]" />
                <span>AVAILABLE FOR WORK</span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
