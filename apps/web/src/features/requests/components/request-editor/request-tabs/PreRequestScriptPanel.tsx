import { Code2, PlayCircle } from "lucide-react";

import { Textarea } from "@courier/ui-kit";

export function PreRequestScriptPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 shrink-0">
        <p className="text-sm font-medium text-[#171717]">Pre-request Script</p>
        <p className="mt-1 text-sm text-[#737373]">
          Write JavaScript that runs before this request is sent.
        </p>
      </div>

      <div className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-[8px] bg-amber-50 text-amber-600">
              <Code2 size={15} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#171717]">JavaScript</p>
              <p className="text-xs text-[#737373]">
                Access request variables before sending.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-2.5 py-1 text-xs font-medium text-[#737373]">
            <PlayCircle size={13} />
            Before send
          </div>
        </div>

        <Textarea
          spellCheck={false}
          defaultValue={`pm.environment.set("timestamp", Date.now()); 
  const token = pm.environment.get("auth_token");
  pm.request.headers.add({
  key: "Authorization",
  value: \`Bearer \${token}\`,
});`}
          className="
            h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-white p-4
            font-mono text-sm leading-6 text-[#171717]
            shadow-none outline-none
            placeholder:text-[#A3A3A3]
            focus-visible:ring-1
            focus-visible:ring-inset
            focus-visible:ring-amber-400
            focus-visible:ring-offset-0
            overflow-auto dashboard-scrollbar
          "
        />
      </div>
    </div>
  );
}
