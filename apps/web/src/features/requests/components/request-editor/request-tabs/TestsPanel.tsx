import { Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TestsPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#525252]">
          Write test scripts to validate the response.
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-[10px] border-[#E5E5E5] bg-white text-sm hover:bg-neutral-50"
          >
            <Play size={15} />
            Run
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-[10px] border-[#E5E5E5] bg-white text-sm hover:bg-neutral-50"
          >
            <Play size={15} />
            Run All
          </Button>

          <Button
            type="button"
            className="h-9 rounded-[10px] bg-pink-500 px-4 text-sm font-medium text-white hover:bg-pink-400"
          >
            <Sparkles size={15} />
            Generate Test Cases
          </Button>
        </div>
      </div>

      <textarea
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
          min-h-[360px] w-full resize-none rounded-[12px]
          border border-[#E5E5E5] bg-white p-4
          font-mono text-sm leading-6 text-[#171717]
          outline-none
          focus:border-amber-500
        "
      />
    </div>
  );
}