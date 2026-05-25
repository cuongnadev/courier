import type { IconProps } from "@/types/common";

export function MoreIcon({
  iconColor = "#A1A1A1",
  width = 16,
  height = 16,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width} height={height}
      viewBox="0 0 14 14"
      fill="none
  ">
      <path d="M6.9922 7.57491C7.31401 7.57491 7.57488 7.31404 7.57488 6.99223C7.57488 6.67042 7.31401 6.40955 6.9922 6.40955C6.67039 6.40955 6.40952 6.67042 6.40952 6.99223C6.40952 7.31404 6.67039 7.57491 6.9922 7.57491Z"
        stroke={iconColor}
        stroke-width="1.16537"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M6.9922 3.49606C7.31401 3.49606 7.57488 3.23518 7.57488 2.91337C7.57488 2.59156 7.31401 2.33069 6.9922 2.33069C6.67039 2.33069 6.40952 2.59156 6.40952 2.91337C6.40952 3.23518 6.67039 3.49606 6.9922 3.49606Z"
        stroke={iconColor}
        stroke-width="1.16537"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M6.9922 11.6536C7.31401 11.6536 7.57488 11.3928 7.57488 11.071C7.57488 10.7492 7.31401 10.4883 6.9922 10.4883C6.67039 10.4883 6.40952 10.7492 6.40952 11.071C6.40952 11.3928 6.67039 11.6536 6.9922 11.6536Z"
        stroke={iconColor}
        stroke-width="1.16537"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
