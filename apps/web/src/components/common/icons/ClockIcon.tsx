import type { IconProps } from "@/types/common";

export function ClockIcon({
    iconColor = "#A1A1A1",
    width = 12,
    height = 12,
}: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
        >
            <g clipPath="url(#clip0_1_812)">
                <path
                    d="M5.99611 10.9928C8.75574 10.9928 10.9929 8.75571 10.9929 5.99608C10.9929 3.23645 8.75574 0.999329 5.99611 0.999329C3.23648 0.999329 0.999359 3.23645 0.999359 5.99608C0.999359 8.75571 3.23648 10.9928 5.99611 10.9928Z"
                    stroke={iconColor}
                    strokeWidth="0.99935"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M5.99609 2.99805V5.9961L7.99479 6.99545"
                    stroke={iconColor}
                    strokeWidth="0.99935"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            <defs>
                <clipPath id="clip0_1_812">
                    <rect
                        width="11.9922"
                        height="11.9922"
                        fill="white"
                    />
                </clipPath>
            </defs>
        </svg>
    );
}