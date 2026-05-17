import type { IconProps } from "@/types/common";

export function MockIcon({
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
            <g clipPath="url(#clip0_mock)">
                <path
                    d="M13.3301 1.33301H2.66602C1.92982 1.33301 1.33301 1.92982 1.33301 2.66602V5.33203C1.33301 6.06823 1.92982 6.66504 2.66602 6.66504H13.3301C14.0663 6.66504 14.6631 6.06823 14.6631 5.33203V2.66602C14.6631 1.92982 14.0663 1.33301 13.3301 1.33301Z"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M13.3301 9.33105H2.66602C1.92982 9.33105 1.33301 9.92786 1.33301 10.6641V13.3301C1.33301 14.0663 1.92982 14.6631 2.66602 14.6631H13.3301C14.0663 14.6631 14.6631 14.0663 14.6631 13.3301V10.6641C14.6631 9.92786 14.0663 9.33105 13.3301 9.33105Z"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M3.99903 3.99902H4.00569"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M3.99903 11.9971H4.00569"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            <defs>
                <clipPath id="clip0_mock">
                    <rect width="15.9961" height="15.9961" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}