import type { IconProps } from "@/types/common";

export function TestIcon({
    iconColor = "#404040",
    width = 16,
    height = 16,
}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
            <g clipPath="url(#clip0_test_icon)">
                <path
                    d="M9.33106 1.33301V5.33203C9.33096 5.55563 9.38712 5.77567 9.49435 5.97188L13.1668 12.6902C13.2779 12.8933 13.3342 13.1217 13.3302 13.3531C13.3262 13.5845 13.262 13.8109 13.144 14.0099C13.026 14.209 12.8582 14.3739 12.6571 14.4884C12.456 14.6029 12.2285 14.6631 11.9971 14.6631H3.99903C3.7676 14.6631 3.54015 14.6029 3.33905 14.4884C3.13795 14.3739 2.97013 14.209 2.8521 14.0099C2.73407 13.8109 2.6699 13.5845 2.66591 13.3531C2.66191 13.1217 2.71823 12.8933 2.82931 12.6902L6.50175 5.97188C6.60898 5.77567 6.66514 5.55563 6.66504 5.33203V1.33301"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path d="M4.30095 9.99756H11.6951" stroke={iconColor} strokeWidth="1.33301" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.66529 1.33301H10.3308" stroke={iconColor} strokeWidth="1.33301" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_test_icon">
                    <rect width="15.9961" height="15.9961" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}