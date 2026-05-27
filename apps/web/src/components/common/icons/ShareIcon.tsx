import type { IconProps } from "@/types/common";

export function ShareIcon({
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
            <path d="M11.9971 5.33203C13.1014 5.33203 13.9966 4.43682 13.9966 3.33252C13.9966 2.22822 13.1014 1.33301 11.9971 1.33301C10.8928 1.33301 9.99756 2.22822 9.99756 3.33252C9.99756 4.43682 10.8928 5.33203 11.9971 5.33203Z"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M3.99902 9.99756C5.10332 9.99756 5.99854 9.10235 5.99854 7.99805C5.99854 6.89375 5.10332 5.99854 3.99902 5.99854C2.89472 5.99854 1.99951 6.89375 1.99951 7.99805C1.99951 9.10235 2.89472 9.99756 3.99902 9.99756Z"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M11.9971 14.6631C13.1014 14.6631 13.9966 13.7679 13.9966 12.6636C13.9966 11.5593 13.1014 10.6641 11.9971 10.6641C10.8928 10.6641 9.99756 11.5593 9.99756 12.6636C9.99756 13.7679 10.8928 14.6631 11.9971 14.6631Z"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M5.72522 9.00447L10.2774 11.6572"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M10.2708 4.33894L5.72522 6.99163"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
