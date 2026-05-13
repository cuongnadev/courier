import type { IconProps } from "@/types/common";

export function EnvIcon({
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
            <g clipPath="url(#clip0_env)">
                <path
                    d="M7.99805 5.33203C11.311 5.33203 13.9966 4.43682 13.9966 3.33252C13.9966 2.22822 11.311 1.33301 7.99805 1.33301C4.68515 1.33301 1.99951 2.22822 1.99951 3.33252C1.99951 4.43682 4.68515 5.33203 7.99805 5.33203Z"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M1.99951 3.33252V12.6636C1.99951 13.1939 2.6315 13.7025 3.75644 14.0774C4.88139 14.4524 6.40714 14.6631 7.99805 14.6631C9.58896 14.6631 11.1147 14.4524 12.2397 14.0774C13.3646 13.7025 13.9966 13.1939 13.9966 12.6636V3.33252"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M1.99951 7.99805C1.99951 8.52835 2.6315 9.03693 3.75644 9.41192C4.88139 9.7869 6.40714 9.99756 7.99805 9.99756C9.58896 9.99756 11.1147 9.7869 12.2397 9.41192C13.3646 9.03693 13.9966 8.52835 13.9966 7.99805"
                    stroke={iconColor}
                    strokeWidth="1.33301"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            <defs>
                <clipPath id="clip0_env">
                    <rect width="15.9961" height="15.9961" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}