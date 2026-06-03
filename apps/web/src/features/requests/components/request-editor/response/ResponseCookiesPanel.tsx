export function ResponseCookiesPanel() {
  return (
    <div className="rounded-[12px] border border-[#E5E5E5] bg-white p-4">
      <div className="font-mono text-sm text-[#171717]">
        <span className="font-semibold">session_id</span>
        <span className="mx-2 text-[#A3A3A3]">=</span>
        <span>abc123xyz</span>
      </div>

      <p className="mt-2 text-xs text-[#737373]">Path: / · HttpOnly: Yes</p>
    </div>
  );
}