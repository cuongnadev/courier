import type { IconProps } from "@/types/common";

export function TeamIcon({
    iconColor = "#404040",
    width = 16,
    height = 16,
}: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none">
            <g clipPath="url(#clip0_team_icon)">
                <path d="M10.6641 13.9966V12.6636C10.6641 11.9565 10.3832 11.2784 9.88321 10.7784C9.38323 10.2784 8.70512 9.99756 7.99805 9.99756H3.99902C3.29195 9.99756 2.61384 10.2784 2.11387 10.7784C1.61389 11.2784 1.33301 11.9565 1.33301 12.6636V13.9966" stroke={iconColor} strokeWidth="1.33301" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.99854 7.33154C7.47094 7.33154 8.66455 6.13793 8.66455 4.66553C8.66455 3.19313 7.47094 1.99951 5.99854 1.99951C4.52614 1.99951 3.33252 3.19313 3.33252 4.66553C3.33252 6.13793 4.52614 7.33154 5.99854 7.33154Z" stroke={iconColor} strokeWidth="1.33301" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.6631 13.9966V12.6636C14.6626 12.0729 14.466 11.4991 14.1041 11.0322C13.7422 10.5653 13.2355 10.2319 12.6636 10.0842" stroke={iconColor} strokeWidth="1.33301" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6641 2.08618C11.2375 2.23301 11.7458 2.56653 12.1088 3.03416C12.4718 3.50178 12.6688 4.07692 12.6688 4.66889C12.6688 5.26085 12.4718 5.83599 12.1088 6.30361C11.7458 6.77124 11.2375 7.10476 10.6641 7.25159" stroke={iconColor} strokeWidth="1.33301" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_team_icon">
                    <rect width="15.9961" height="15.9961" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}