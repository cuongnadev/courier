import type { IconProps } from "@/types/common";

export function ChevronDownIcon({
  iconColor = "#525252",
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
      <path d="M3.99902 5.99854L7.99805 9.99756L11.9971 5.99854"
        stroke={iconColor}
        stroke-width="1.33301"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
