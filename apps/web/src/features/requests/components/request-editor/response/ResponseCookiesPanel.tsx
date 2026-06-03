type ResponseCookiesPanelProps = {
  cookies: string[];
};

function parseCookie(cookie: string) {
  const parts = cookie.split(";").map((part) => part.trim());
  const [nameValue, ...attributes] = parts;

  const equalIndex = nameValue.indexOf("=");

  const name =
    equalIndex >= 0 ? nameValue.slice(0, equalIndex) : nameValue;

  const value =
    equalIndex >= 0 ? nameValue.slice(equalIndex + 1) : "";

  return {
    name,
    value,
    attributes,
  };
}

export function ResponseCookiesPanel({ cookies }: ResponseCookiesPanelProps) {
  if (cookies.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-6 text-center">
        <p className="text-sm font-medium text-[#171717]">No cookies</p>
        <p className="mt-1 text-sm text-[#737373]">
          This response did not include Set-Cookie headers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cookies.map((cookie) => {
        const parsedCookie = parseCookie(cookie);

        return (
          <div
            key={cookie}
            className="rounded-[12px] border border-[#E5E5E5] bg-white p-4"
          >
            <div className="font-mono text-sm text-[#171717]">
              <span className="font-semibold">{parsedCookie.name}</span>
              <span className="mx-2 text-[#A3A3A3]">=</span>
              <span className="break-all">{parsedCookie.value}</span>
            </div>

            {parsedCookie.attributes.length > 0 && (
              <p className="mt-2 break-words text-xs text-[#737373]">
                {parsedCookie.attributes.join(" · ")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}