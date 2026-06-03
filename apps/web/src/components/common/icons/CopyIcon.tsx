import type { IconProps } from "@/types/common";

export function CopyIcon({
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
      <g clipPath="url(#clip0_2_1443)">
        <path d="M13.3301 5.33203H6.66504C5.92884 5.33203 5.33203 5.92884 5.33203 6.66504V13.3301C5.33203 14.0663 5.92884 14.6631 6.66504 14.6631H13.3301C14.0663 14.6631 14.6631 14.0663 14.6631 13.3301V6.66504C14.6631 5.92884 14.0663 5.33203 13.3301 5.33203Z"
          stroke={iconColor}
          strokeWidth="1.33301"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2.66602 10.6641C1.93286 10.6641 1.33301 10.0642 1.33301 9.33106V2.66602C1.33301 1.93286 1.93286 1.33301 2.66602 1.33301H9.33106C10.0642 1.33301 10.6641 1.93286 10.6641 2.66602"
          stroke={iconColor}
          strokeWidth="1.33301"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2_1443">
          <rect width="15.9961" height="15.9961" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* 

*/
