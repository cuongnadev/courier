import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordField({ className, ...props }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`
                    pr-10
                    ${className}
                `}
                {...props}
            />

            <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                    setShowPassword((prev) => !prev)
                }
                className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#71717B]
                            transition-colors
                            hover:text-zinc-300
                        "
            >
                {showPassword ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
            </button>
        </div>
    );
}