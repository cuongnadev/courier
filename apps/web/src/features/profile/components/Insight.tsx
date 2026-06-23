type InsightProps = {
  label: string;
  value: string;
  detail: string;
};

export function Insight({ label, value, detail }: InsightProps) {
  return (
    <div className="rounded-[12px] bg-[#FAFAFA] px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#737373]">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#171717]">{value}</div>
      {detail && <div className="mt-1 text-xs text-[#737373]">{detail}</div>}
    </div>
  );
}
