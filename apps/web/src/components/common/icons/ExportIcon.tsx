import type { IconProps } from "@/types/common";

export function ExportIcon({
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
            <path d="M9.99756 1.33301H3.99902C3.64549 1.33301 3.30643 1.47345 3.05644 1.72344C2.80646 1.97342 2.66602 2.31248 2.66602 2.66602V13.3301C2.66602 13.6836 2.80646 14.0227 3.05644 14.2727C3.30643 14.5226 3.64549 14.6631 3.99902 14.6631H11.9971C12.3506 14.6631 12.6897 14.5226 12.9397 14.2727C13.1896 14.0227 13.3301 13.6836 13.3301 13.3301V4.66553L9.99756 1.33301Z"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9.33105 1.33301V3.99902C9.33105 4.35256 9.4715 4.69162 9.72148 4.9416C9.97147 5.19159 10.3105 5.33203 10.6641 5.33203H13.3301"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M7.99805 11.9971V7.99805"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M5.99854 9.99756L7.99805 11.9971L9.99756 9.99756"
                stroke={iconColor}
                strokeWidth="1.33301"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
