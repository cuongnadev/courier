import type { IconProps } from "@/types/common";

export function ChevronRightIcon({
  iconColor = "#A1A1A1",
  width = 16,
  height = 16,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width} height={height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M7.5 15L12.5 10L7.5 5"
        stroke={iconColor}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
