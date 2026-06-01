import type { IconProps } from "@/types/common";

export function DownloadIcon({
  iconColor = "#1C1917",
  width = 16,
  height = 16,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width} height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path d="M13.9966 9.99756V12.6636C13.9966 13.0171 13.8561 13.3562 13.6062 13.6062C13.3562 13.8561 13.0171 13.9966 12.6636 13.9966H3.33252C2.97898 13.9966 2.63993 13.8561 2.38994 13.6062C2.13995 13.3562 1.99951 13.0171 1.99951 12.6636V9.99756"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.66553 6.66504L7.99805 9.99756L11.3306 6.66504"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.99805 9.99756V1.99951"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
