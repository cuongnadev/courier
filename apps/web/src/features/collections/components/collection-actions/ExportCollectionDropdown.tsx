import type { ReactNode } from "react";
import { toast } from "sonner";
import { Braces, FileCode2, FileJson, FileJson2 } from "lucide-react";

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
  exportCollectionAsOpenApiYaml,
  exportCollectionAsOpenApiJson,
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

  const handleExport = (
    label: string,
    fileName: string,
    content: string,
    mime: string,
  ) => {
    try {
      downloadFile(fileName, content, mime);
      toast.success(`Collection exported as ${label}.`);
    } catch {
      toast.error(`Failed to export ${label}.`);
    }
  };

  const exportItems = [
    {
      label: "JSON",
      icon: FileJson,
      onClick: () =>
        handleExport(
          "JSON",
          `${filename}.collection.json`,
          JSON.stringify(collection, null, 2),
          "application/json;charset=utf-8",
        ),
    },
    {
      label: "cURL",
      icon: FileCode2,
      onClick: () =>
        handleExport(
          "cURL",
          `${filename}.curl.txt`,
          exportCollectionAsCurl(collection),
          "text/plain;charset=utf-8",
        ),
    },
    {
      label: "OpenAPI YAML",
      icon: Braces,
      onClick: () =>
        handleExport(
          "OpenAPI YAML",
          `${filename}.openapi.yaml`,
          exportCollectionAsOpenApiYaml(collection),
          "application/x-yaml;charset=utf-8",
        ),
    },
    {
      label: "OpenAPI JSON",
      icon: FileJson2,
      onClick: () => {
        const json = exportCollectionAsOpenApiJson(collection);

        handleExport(
          "OpenAPI JSON",
          `${filename}.openapi.json`,
          JSON.stringify(json, null, 2),
          "application/json;charset=utf-8",
        );
      },
    },
  ];

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
        {exportItems.map(({ label, icon: Icon, onClick }) => (
          <DropdownMenuItem
            key={label}
            onClick={onClick}
            className="
              flex cursor-pointer items-center gap-3 rounded-lg
              px-3 py-2.5 text-sm text-neutral-800 outline-none
              hover:bg-[#F5F5F5]
              focus:bg-[#F5F5F5]
              data-[highlighted]:bg-[#F5F5F5]
            "
          >
            <Icon size={16} className="text-[#737373]" />
            Export as {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
