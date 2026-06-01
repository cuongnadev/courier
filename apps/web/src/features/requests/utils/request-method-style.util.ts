import type { RequestMethod } from "@/types/api.type";

export const requestMethodStyles: Record<
  RequestMethod,
  string
> = {
  GET: "bg-[#FEF3C6] text-[#7B3306]",

  POST: "bg-[#DCFCE7] text-[#008236]",

  PUT: "bg-[#DBEAFE] text-[#1D4ED8]",

  PATCH: "bg-[#FCE7F3] text-[#BE185D]",

  DELETE: "bg-[#FEE2E2] text-[#B91C1C]",
};