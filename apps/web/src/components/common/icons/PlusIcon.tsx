import type { IconProps } from "@/types/common";

export function PlusIcon({
  iconColor = "#E17100",
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
      <path d="M3.33252 7.99805H12.6636"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.99805 3.33252V12.6636"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
