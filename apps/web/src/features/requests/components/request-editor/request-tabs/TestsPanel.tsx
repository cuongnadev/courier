import { Bug, FlaskConical, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TestsPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#171717]">Tests</p>
          <p className="mt-1 text-sm text-[#737373]">
            Write JavaScript test scripts to validate the response.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="
    h-9 rounded-[10px]
    border-[#FED7AA] bg-[#FFF7ED] px-3
    text-sm font-semibold text-[#C2410C]
    shadow-none
    hover:border-[#FDBA74]
    hover:bg-[#FFEDD5]
    hover:text-[#9A3412]
    focus-visible:ring-2
    focus-visible:ring-[#FED7AA]
    focus-visible:ring-offset-0
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
          >
            <Play size={15} className="fill-current" />
            Run
          </Button>

          <Button
            type="button"
            variant="outline"
            className="
    h-9 rounded-[10px]
    border-[#BBF7D0] bg-[#F0FDF4] px-3
    text-sm font-semibold text-[#15803D]
    shadow-none
    hover:border-[#86EFAC]
    hover:bg-[#DCFCE7]
    hover:text-[#166534]
    focus-visible:ring-2
    focus-visible:ring-[#BBF7D0]
    focus-visible:ring-offset-0
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
          >
            <Play size={15} className="fill-current" />
            Run All
          </Button>

          <Button
            type="button"
            className="
      h-9 rounded-[10px]
      border-0
      bg-gradient-to-r from-pink-300 via-pink-500 to-fuchsia-600
      px-4
      text-sm font-semibold text-white
      shadow-[0_8px_18px_rgba(236,72,153,0.28)]
      hover:from-pink-400
      hover:via-pink-500
      hover:to-fuchsia-500
      hover:text-white
      focus-visible:ring-2
      focus-visible:ring-pink-200
      focus-visible:ring-offset-0
      disabled:cursor-not-allowed
      disabled:opacity-60
    "
          >
            <Sparkles size={15} className="text-white" />
            Generate Test Cases
          </Button>
        </div>
      </div>

      <div className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-[8px] bg-pink-50 text-pink-600">
              <FlaskConical size={15} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#171717]">
                Test Script
              </p>
              <p className="text-xs text-[#737373]">
                Use pm.test, pm.expect and response assertions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-2.5 py-1 text-xs font-medium text-[#737373]">
            <Bug size={13} />
            JavaScript
          </div>
        </div>

        <Textarea
          spellCheck={false}
          defaultValue={`pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has user data", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("data");
  pm.expect(jsonData.data).to.have.property("id");
});`}
          className="
            h-full min-h-0 flex-1 resize-none rounded-none border-0 bg-white p-4
            font-mono text-sm leading-6 text-[#171717]
            shadow-none outline-none
            placeholder:text-[#A3A3A3]
            focus-visible:ring-1
            focus-visible:ring-inset
            focus-visible:ring-pink-400
            focus-visible:ring-offset-0
            overflow-auto dashboard-scrollbar
          "
        />
      </div>
    </div>
  );
}