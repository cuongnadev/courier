type JsonCodeBlockProps = {
  value: string;
  mode?: "pretty" | "raw";
};

export function JsonCodeBlock({ value, mode = "pretty" }: JsonCodeBlockProps) {
  return (
    <pre
      className={`
        h-full min-h-[360px] overflow-auto rounded-[12px]
        border border-[#E5E5E5] p-4
        font-mono text-sm text-[#171717]
        dashboard-scrollbar

        ${mode === "pretty"
          ? "bg-white leading-6 whitespace-pre"
          : "bg-[#FAFAFA] text-xs leading-5 text-[#404040] whitespace-pre-wrap break-words"
        }
      `}
    >
      {value}
    </pre>
  );
}