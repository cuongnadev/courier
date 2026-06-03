type ResponseHeadersPanelProps = {
  headers: readonly (readonly [string, string])[];
};

export function ResponseHeadersPanel({ headers }: ResponseHeadersPanelProps) {
  if (headers.length === 0) {
    return (
      <div className="rounded-[12px] border-[1.25px] border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-6 text-center">
        <p className="text-sm font-medium text-[#171717]">No headers</p>
        <p className="mt-1 text-sm text-[#737373]">
          This response did not include headers.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white">
      {headers.map(([key, value], index) => (
        <div
          key={`${key}-${index}`}
          className="
            grid grid-cols-[150px_minmax(0,1fr)]
            gap-4 border-b-[1.25px] border-[#F0F0F0]
            px-4 py-3 last:border-b-0
          "
        >
          <span className="min-w-0 break-words font-mono text-sm font-semibold text-[#171717]">
            {key}
          </span>

          <span
            title={value}
            className="
              min-w-0 whitespace-pre-wrap break-all
              font-mono text-sm leading-6 text-[#525252]
            "
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}