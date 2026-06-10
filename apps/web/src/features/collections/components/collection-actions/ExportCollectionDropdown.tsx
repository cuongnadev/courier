import type { ReactNode } from "react";
import { toast } from "sonner";
import { Braces, FileCode2, FileJson } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@courier/ui-kit";

import type { ExportableCollection } from "@/features/collections/types";

import {
  downloadFile,
  exportCollectionAsCurl,
  exportCollectionAsOpenApi,
  slugify,
} from "@/features/collections/utils";

type ExportCollectionDropdownProps = {
  children: ReactNode;
  collection: ExportableCollection;
};

export function ExportCollectionDropdown({
  children,
  collection,
}: ExportCollectionDropdownProps) {
  const filename = slugify(collection.name);

  const exportAsJson = () => {
    try {
      const content = JSON.stringify(collection, null, 2);

      downloadFile(
        `${filename}.collection.json`,
        content,
        "application/json;charset=utf-8",
      );

      toast.success("Collection exported.");
    } catch {
      toast.error("Failed to export collection.");
    }
  };

  const exportAsCurl = () => {
    try {
      const content = exportCollectionAsCurl(collection);

      downloadFile(`${filename}.curl.txt`, content, "text/plain;charset=utf-8");

      toast.success("Collection exported as cURL.");
    } catch {
      toast.error("Failed to export collection.");
    }
  };

  const exportAsOpenApi = () => {
    try {
      const content = exportCollectionAsOpenApi(collection);

      downloadFile(
        `${filename}.openapi.yaml`,
        content,
        "application/x-yaml;charset=utf-8",
      );

      toast.success("Collection exported as OpenAPI YAML.");
    } catch {
      toast.error("Failed to export collection.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-64 rounded-xl border border-[#E5E5E5]
          bg-white p-2 text-neutral-900
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        "
      >
        <DropdownMenuItem
          onClick={exportAsJson}
          className="
            flex cursor-pointer items-center gap-3 rounded-lg
            px-3 py-2.5 text-sm text-neutral-800 outline-none
            hover:bg-[#F5F5F5]
            focus:bg-[#F5F5F5]
            data-[highlighted]:bg-[#F5F5F5]
          "
        >
          <FileJson size={16} className="text-[#737373]" />
          Export as JSON
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={exportAsCurl}
          className="
            flex cursor-pointer items-center gap-3 rounded-lg
            px-3 py-2.5 text-sm text-neutral-800 outline-none
            hover:bg-[#F5F5F5]
            focus:bg-[#F5F5F5]
            data-[highlighted]:bg-[#F5F5F5]
          "
        >
          <FileCode2 size={16} className="text-[#737373]" />
          Export as cURL
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={exportAsOpenApi}
          className="
            flex cursor-pointer items-center gap-3 rounded-lg
            px-3 py-2.5 text-sm text-neutral-800 outline-none
            hover:bg-[#F5F5F5]
            focus:bg-[#F5F5F5]
            data-[highlighted]:bg-[#F5F5F5]
          "
        >
          <Braces size={16} className="text-[#737373]" />
          Export as OpenAPI YAML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
