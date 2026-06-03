type ResponsePreviewPanelProps = {
  responseBody: string;
  responseUrl?: string;
};

function isLikelyHtml(value: string) {
  const trimmed = value.trim().toLowerCase();

  return (
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("<body") ||
    trimmed.includes("<head")
  );
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function injectBaseUrl(html: string, responseUrl?: string) {
  if (!responseUrl) return html;

  const baseTag = `<base href="${escapeHtml(responseUrl)}" target="_blank" />`;

  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>${baseTag}`);
  }

  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${baseTag}</head>`);
  }

  return `${baseTag}${html}`;
}

function isComplexExternalSite(responseUrl?: string) {
  if (!responseUrl) return false;

  try {
    const hostname = new URL(responseUrl).hostname.toLowerCase();

    return [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "facebook.com",
      "www.facebook.com",
      "x.com",
      "twitter.com",
      "instagram.com",
      "www.instagram.com",
    ].some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export function ResponsePreviewPanel({
  responseBody,
  responseUrl,
}: ResponsePreviewPanelProps) {
  const json = tryParseJson(responseBody);

  if (json) {
    return (
      <div className="h-full min-h-0 overflow-auto rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white p-4 dashboard-scrollbar">
        <JsonPreview value={json} />
      </div>
    );
  }

  if (isLikelyHtml(responseBody)) {
    const html = injectBaseUrl(responseBody, responseUrl);
    const shouldShowExternalNotice = isComplexExternalSite(responseUrl);

    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white">
        {shouldShowExternalNotice && (
          <div className="shrink-0 border-b-[1.25px] border-[#E5E5E5] bg-[#FFFBEB] px-4 py-2 text-xs leading-5 text-[#92400E]">
            This site depends on scripts, cookies, CSP or iframe restrictions,
            so preview may not look exactly like a real browser tab.
          </div>
        )}

        <iframe
          title="Response preview"
          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          srcDoc={html}
          className="h-full min-h-[420px] w-full bg-white"
        />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-auto rounded-[12px] border-[1.25px] border-[#E5E5E5] bg-white p-4 dashboard-scrollbar">
      <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-[#404040]">
        {responseBody || "No preview available."}
      </pre>
    </div>
  );
}

function JsonPreview({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#171717]">
          Array · {value.length} items
        </p>

        <div className="space-y-2">
          {value.slice(0, 20).map((item, index) => (
            <div
              key={index}
              className="rounded-[10px] border-[1.25px] border-[#E5E5E5] bg-[#FAFAFA] p-3"
            >
              <p className="mb-2 text-xs font-medium text-[#737373]">
                Item {index + 1}
              </p>

              <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[#404040]">
                {JSON.stringify(item, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        {value.length > 20 && (
          <p className="text-xs text-[#737373]">
            Showing first 20 items of {value.length}.
          </p>
        )}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-2">
        {Object.entries(value as Record<string, unknown>).map(([key, item]) => (
          <div
            key={key}
            className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 rounded-[10px] border-[1.25px] border-[#E5E5E5] bg-[#FAFAFA] p-3"
          >
            <span className="truncate text-sm font-medium text-[#171717]">
              {key}
            </span>

            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[#404040]">
              {typeof item === "string"
                ? item
                : JSON.stringify(item, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-sm text-[#404040]">{String(value)}</p>;
}