type ResponseHeadersPanelProps = {
  headers: readonly (readonly [string, string])[];
};

export function ResponseHeadersPanel({ headers }: ResponseHeadersPanelProps) {
  if (headers.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-6 text-center">
        <p className="text-sm font-medium text-[#171717]">No headers</p>
        <p className="mt-1 text-sm text-[#737373]">
          This response did not include headers.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
      {headers.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-[220px_1fr] border-b border-[#F0F0F0] px-4 py-3 last:border-b-0"
        >
          <span className="break-words font-mono text-sm font-medium text-[#171717]">
            {key}
          </span>

          <span className="break-words font-mono text-sm text-[#525252]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}