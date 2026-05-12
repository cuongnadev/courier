import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { GitHubIcon } from "@/components/common/icons/GitHubIcon";
import { Link } from "@tanstack/react-router";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="w-105 p-8 rounded-[16px] border border-[#2A2A2A] bg-[#181818]">
            <div>
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="text-[16px] text-[#9F9FA9] font-normal mt-1.5">Sign in to your Courier account</p>
            </div>

            <form className="flex flex-col gap-4 mt-8">
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="email" className="text-sm font-medium text-[#D4D4D8]">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        placeholder="you@company.com"
                        className="h-12 px-4 py-3 bg-[#181818] border border-[#2A2A2A] placeholder:text-[#9F9FA9] focus:outline-none focus:ring-2 focus:ring-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500"
                    />
                </div>
                <div className="flex flex-col items-start justify-start gap-2 w-full">
                    <Label htmlFor="password" className="text-sm font-medium text-[#D4D4D8]">Password</Label>
                    <div className="relative w-full">
                        <Input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="h-12 px-4 py-3 bg-[#181818] border border-[#2A2A2A] placeholder:text-[#9F9FA9] focus:outline-none focus:ring-2 focus:ring-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-[#71717B]
                                hover:text-zinc-300
                                transition-colors
                            "
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full my-1">
                    <div className="flex items-center text-sm font-medium text-[#9F9FA9] gap-2">
                        <Checkbox /> Remember me
                    </div>
                    <Link to="/login" className="text-sm text-[#FE9A00] hover:text-amber-400">Forgot password?</Link>
                </div>

                <Button type="submit" className="w-full h-12 bg-[#FE9A00] pt-2.5 px-0 pb-3.5 rounded-[16px] hover:bg-amber-400 shadow-lg shadow-orange-400/20 hover:shadow-amber-500/30 text-[16px] font-semibold text-[#101828]">
                    Sign in
                </Button>

                <div className='relative w-full my-7 pointer-events-none'>
                    <div className='w-full h-px border border-[#2A2A2A]'></div>
                    <p className='text-sm text-[#71717B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#181818] px-4'>Or continue with</p>
                </div>

                <Button type="submit" variant="outline" className="w-full h-12 pt-2.5 px-0 pb-3.5 rounded-[16px] text-[16px] font-semibold text-white">
                    <GitHubIcon /> Sign in with GitHub
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                    <span className="font-normal text-[#71717B]">Don't have an account?</span>
                    <Link to="/register" className="text-[#FE9A00] hover:text-amber-400">Sign up</Link>
                </div>
            </form>
        </div>
    );
}