import type { IconProps } from "@/types/common";

export function FlowsIcon({
  iconColor = "#404040",
  width = 16,
  height = 16,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3.99903 1.99951V9.99756"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M11.9971 5.99854C13.1014 5.99854 13.9966 5.10332 13.9966 3.99902C13.9966 2.89472 13.1014 1.99951 11.9971 1.99951C10.8928 1.99951 9.99756 2.89472 9.99756 3.99902C9.99756 5.10332 10.8928 5.99854 11.9971 5.99854Z"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M3.99902 13.9966C5.10332 13.9966 5.99854 13.1014 5.99854 11.9971C5.99854 10.8928 5.10332 9.99756 3.99902 9.99756C2.89472 9.99756 1.99951 10.8928 1.99951 11.9971C1.99951 13.1014 2.89472 13.9966 3.99902 13.9966Z"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M11.9971 5.99854C11.9971 7.58945 11.3651 9.1152 10.2401 10.2401C9.1152 11.3651 7.58945 11.9971 5.99854 11.9971"
        stroke={iconColor}
        strokeWidth="1.33301"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}