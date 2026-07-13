import { parse as parseYaml } from "yaml";

import type { ImportCollectionPayload } from "@/features/collections/types";

import { detectImportFormat } from "./detect-import-format";
import { normalizeImportCollectionJson } from "./normalize-import-collection";
import { normalizeOpenApi } from "./normalize-openapi";

export async function parseImportFile(
  file: File,
): Promise<ImportCollectionPayload> {
  const filename = file.name.toLowerCase();

  const text = await file.text();

  let parsed: unknown;

  if (filename.endsWith(".yaml") || filename.endsWith(".yml")) {
    parsed = parseYaml(text);
  } else {
    parsed = JSON.parse(text);
  }

  const format = detectImportFormat(parsed);

  switch (format) {
    case "courier":
      return normalizeImportCollectionJson(parsed);

    case "openapi":
      return normalizeOpenApi(parsed);

    default:
      throw new Error("Unsupported import format.");
  }
}