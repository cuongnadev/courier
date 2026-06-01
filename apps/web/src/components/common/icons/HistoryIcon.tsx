import type { IconProps } from "@/types/common";

export function HistoryIcon({
    iconColor = '#404040',
    width = 16,
    height = 16,
}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
        >
            <path d="M1.99951 7.99805C1.99951 9.18445 2.35132 10.3442 3.01045 11.3307C3.66958 12.3171 4.60642 13.086 5.70251 13.54C6.7986 13.994 8.0047 14.1128 9.16831 13.8813C10.3319 13.6499 11.4007 13.0786 12.2397 12.2397C13.0786 11.4007 13.6499 10.3319 13.8813 9.16831C14.1128 8.0047 13.994 6.7986 13.54 5.70251C13.086 4.60642 12.3171 3.66958 11.3307 3.01045C10.3442 2.35132 9.18445 1.99951 7.99805 1.99951C6.32109 2.00582 4.7115 2.66017 3.50581 3.82573L1.99951 5.33203"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M1.99951 1.99951V5.33203H5.33203"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M7.99805 4.66553V7.99805L10.6641 9.33106"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    );
}