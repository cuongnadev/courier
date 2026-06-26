export type ImportFormat = "courier" | "openapi";

export function detectImportFormat(data: unknown): ImportFormat {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid import file.");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.openapi === "string") {
    return "openapi";
  }

  // if (typeof obj.swagger === "string") {
  //   return "openapi";
  // }

  if (
    "requests" in obj &&
    Array.isArray(obj.requests)
  ) {
    return "courier";
  }

  throw new Error("Unsupported import format.");
}