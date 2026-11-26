interface SectionHeaderProps {
  code: string;
  label: string;
  rightMeta?: string;
}

export function SectionHeader({ code, label, rightMeta }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="studio-pill inline-flex items-center gap-2.5 px-3.5 py-1.5">
        <span
          className="h-2 w-2 shrink-0 bg-[#D2FF3A]"
          aria-hidden="true"
        />
        <span className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-[#B5B5C2]">
          <span className="text-[#F5F5F7]">{code}</span> — {label}
        </span>
      </div>
      {rightMeta && (
        <span className="studio-pill px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.13em] text-[#A6A6B4]">
          {rightMeta}
        </span>
      )}
    </div>
  );
}
