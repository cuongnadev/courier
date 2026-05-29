import { Link } from "@tanstack/react-router";
import { AlertCircle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

type NotFoundProps = {
    fullScreen?: boolean;
};

export default function NotFound({ fullScreen = true }: NotFoundProps) {
    return (
        <div
            className={[
                "flex flex-col items-center justify-center bg-[#FAFAFA] px-6 text-center",
                fullScreen ? "min-h-screen" : "h-full min-h-[calc(100vh-64px)]",
            ].join(" ")}
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE2E2]">
                <AlertCircle className="h-9 w-9 text-[#EF4444]" strokeWidth={2.2} />
            </div>

            <h1 className="mt-7 text-[34px] font-bold leading-none tracking-[0.18em] text-[#18181B]">
                404
            </h1>

            <h2 className="mt-4 text-xl font-semibold tracking-wide text-[#18181B]">
                Page Not Found
            </h2>

            <p className="mt-4 max-w-[460px] text-base leading-7 text-[#52525B]">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <Button
                asChild
                className="
                    mt-7 h-12 rounded-lg
                    bg-[#2563EB] px-6
                    text-base font-semibold text-white
                    shadow-none
                    transition-transform duration-200 ease-out
                    hover:scale-[1.03]
                    hover:bg-[#2563EB]
                    active:scale-[0.98]
                "
            >
                <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
    );
}