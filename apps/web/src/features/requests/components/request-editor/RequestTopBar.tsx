import { Loader2, Play, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RequestMethodSelect } from "./request-tabs";

import type { RequestMethod } from "@/types/api.type";

type RequestTopBarProps = {
  method: RequestMethod;
  uri: string;

  isSending?: boolean;
  isSaving?: boolean;

  onMethodChange: (method: RequestMethod) => void;
  onUriChange: (uri: string) => void;
  onSend: () => void | Promise<void>;
  onSave: () => void | Promise<void>;
};

export function RequestTopBar({
  method,
  uri,
  isSending = false,
  isSaving = false,
  onMethodChange,
  onUriChange,
  onSend,
  onSave,
}: RequestTopBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-[#E5E5E5] bg-white px-4 py-4">
      <RequestMethodSelect value={method} onValueChange={onMethodChange} />

      <Input
        value={uri}
        onChange={(event) => onUriChange(event.target.value)}
        placeholder="Enter request URL"
        className="
          h-11 min-h-11 flex-1 rounded-[12px]
          border-[#E5E5E5] bg-white px-4
          text-sm text-[#171717]
          placeholder:text-[#A3A3A3]
          shadow-none
          focus-visible:border-amber-500
          focus-visible:ring-0
        "
      />

      <Button
        type="button"
        disabled={isSending || isSaving || !uri.trim()}
        onClick={() => void onSend()}
        className="
          h-11 min-h-11 rounded-[12px]
          bg-amber-500 px-6
          text-sm font-semibold text-white
          hover:bg-amber-400
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isSending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Play size={16} />
        )}

        {isSending ? "Sending..." : "Send"}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={isSaving || isSending}
        onClick={() => void onSave()}
        className="
          h-11 min-h-11 w-12 rounded-[12px]
          border-[1.25px] border-[#E5E5E5] bg-white p-0
          text-[#525252]
          hover:bg-neutral-50 hover:text-[#171717]
          focus-visible:ring-0
          focus-visible:ring-offset-0
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        title={isSaving ? "Saving request" : "Save request"}
      >
        {isSaving ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <Save size={17} />
        )}
      </Button>
    </div>
  );
}