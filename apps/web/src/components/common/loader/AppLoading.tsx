import { useEffect, useState } from "react";
import { TruckElectric } from "lucide-react";

type AppLoadingProps = {
    label?: string;
    isComplete: boolean;
    fullScreen?: boolean;
    onFinish: () => void;
};

const TRACK_WIDTH = 420;
const ICON_SIZE = 56;

export function AppLoading({
    label = "Loading...",
    isComplete,
    onFinish,
    fullScreen = true,
}: AppLoadingProps) {
    const [progress, setProgress] = useState(8);

    const progressWidth = (progress / 100) * TRACK_WIDTH;
    const iconX = progressWidth - ICON_SIZE / 2;

    useEffect(() => {
        const interval = window.setInterval(() => {
            setProgress((prev) => {
                if (isComplete) {
                    return Math.min(prev + 4, 100);
                }

                if (prev >= 88) {
                    return prev;
                }

                return Math.min(prev + 1.5, 88);
            });
        }, 120);

        return () => window.clearInterval(interval);
    }, [isComplete]);

    useEffect(() => {
        if (progress >= 100) {
            const timeout = window.setTimeout(() => {
                onFinish();
            }, 120);

            return () => window.clearTimeout(timeout);
        }
    }, [progress, onFinish]);

    return (
        <div
            className={[
                "relative flex items-center justify-center overflow-hidden bg-[#FAFAFA] pointer-events-none select-none cursor-none",
                fullScreen ? "h-screen w-screen" : "h-full w-full min-h-[calc(100vh-64px)]" 
            ].join(" ")}
        >
            <div className="relative z-10 w-[420px]">
                <div className="relative h-28">
                    {/* moving marker */}
                    <div
                        className="
                            absolute left-0 top-0 z-10
                            transition-transform duration-500 ease-out
                            will-change-transform
                        "
                        style={{
                            transform: `translateX(${iconX}px)`,
                        }}
                    >
                        <div
                            className="
                                relative flex h-14 w-14 items-center justify-center
                                rounded-[18px]
                                border border-[#FE9A00]/25
                                bg-[#181818]
                                shadow-[0_10px_40px_rgba(254,154,0,0.16)]
                            "
                            >
                            <TruckElectric className="relative z-20 h-6 w-6 text-[#FE9A00]" />

                            {/* tail */}
                            <span
                                className="
                                absolute -bottom-2 left-1/2 z-0
                                h-4 w-4
                                -translate-x-1/2 rotate-45
                                border-b border-r border-[#FE9A00]/25
                                bg-[#181818]
                                "
                            />

                            {/* patch che phần nối */}
                            <span
                                className="
                                absolute bottom-0 left-1/2 z-10
                                h-3 w-7
                                -translate-x-1/2
                                bg-[#181818]
                                "
                            />
                        </div>
                    </div>

                    {/* track */}
                    <div
                        className="
                            absolute bottom-6
                            h-3 w-full overflow-hidden rounded-full
                            bg-[#E4E4E7]
                            backdrop-blur-xl
                        "
                    >
                        <div
                            className="
                                relative h-full rounded-full
                                bg-gradient-to-r from-[#FE9A00] to-[#FFB84D]
                                transition-[width] duration-500 ease-out
                                will-change-[width]
                            "
                            style={{
                                width: `${progress}%`,
                            }}
                        >
                            <div
                                className="
                                    absolute right-0 top-1/2
                                    h-4 w-10
                                    -translate-y-1/2
                                    bg-[#FFD089]
                                    opacity-70
                                    blur-md
                                "
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-2 text-center">
                    <p className="text-sm font-semibold tracking-wide text-[#18181B]">
                        {label}
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#717171]">
                        {Math.round(progress)}%
                    </p>
                </div>
            </div>
        </div>
    );
}