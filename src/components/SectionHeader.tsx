interface SectionHeaderProps {
  code: string;
  label: string;
  rightMeta?: string;
}

export function SectionHeader({ code, label, rightMeta }: SectionHeaderProps) {
  return (
    <div className="editorial-text-guard flex flex-wrap items-center justify-between gap-4">
      <div className="inline-flex items-center gap-2.5">
        <span
          className="h-2 w-2 shrink-0 bg-[#D2FF3A]"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#9E9EA8]">
          <span className="text-[#F5F5F5]">{code}</span> — {label}
        </span>
      </div>
      {rightMeta && (
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9E9EA8]">
          {rightMeta}
        </span>
      )}
    </div>
  );
}
