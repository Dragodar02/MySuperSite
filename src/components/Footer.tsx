import { ArrowUp } from 'lucide-react';
import { siteConfig } from '../data/portfolio';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.1] bg-[#08080D]/90 py-9 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.13em] text-[#A6A6B4]">
          <span className="font-medium text-[#F5F5F7]">© {year} {siteConfig.name}</span>
          <span className="text-white/25">·</span>
          <span>{siteConfig.location}</span>
        </div>

        <a
          href="#top"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.13em] text-[#B5B5C2] transition-colors hover:text-[#D2FF3A]"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
