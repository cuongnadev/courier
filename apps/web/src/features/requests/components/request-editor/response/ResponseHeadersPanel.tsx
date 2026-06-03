export function ResponseHeadersPanel() {
  const headers = [
    ["content-type", "application/json; charset=utf-8"],
    ["x-request-id", "req_9d8f7a6b5c4e"],
    ["x-ratelimit-limit", "1000"],
    ["x-ratelimit-remaining", "995"],
    ["cache-control", "no-cache"],
    ["date", "Thu, 19 Mar 2026 14:30:15 GMT"],
  ];

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
      {headers.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-[220px_1fr] border-b border-[#F0F0F0] px-4 py-3 last:border-b-0"
        >
          <span className="font-mono text-sm font-medium text-[#171717]">
            {key}
          </span>

          <span className="font-mono text-sm text-[#525252]">{value}</span>
        </div>
      ))}
    </div>
  );
}