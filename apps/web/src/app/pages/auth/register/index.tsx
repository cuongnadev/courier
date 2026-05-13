import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { GitHubIcon } from "@/components/common/icons/GitHubIcon";
import { PasswordField } from "@/components/forms/password-field";

export default function Register() {

    return (
        <div className="p-8 w-105 rounded-[16px] border border-[#2A2A2A] bg-[#181818]">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Create your account
                </h2>

                <p className="mt-1.5 text-[16px] font-normal text-[#9F9FA9]">
                    Start building API workflows with Courier
                </p>
            </div>

            <form className="mt-8.5">
                <FieldGroup className="gap-5">
                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="fullname"
                            className="text-sm font-medium text-[#D4D4D8]"
                        >
                            Full Name
                        </FieldLabel>

                        <Input
                            id="fullname"
                            type="text"
                            placeholder="John Doe"
                            className="
                                h-12
                                border border-[#2A2A2A]
                                bg-[#111]
                                px-4
                                text-white
                                placeholder:text-[#52525C]
                                focus-visible:ring-2
                                focus-visible:ring-amber-500
                            "
                        />
                    </Field>

                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="email"
                            className="text-sm font-medium text-[#D4D4D8]"
                        >
                            Email
                        </FieldLabel>

                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            className="
                                h-12
                                border border-[#2A2A2A]
                                bg-[#111]
                                px-4
                                text-white
                                placeholder:text-[#52525C]
                                focus-visible:ring-2
                                focus-visible:ring-amber-500
                            "
                        />
                    </Field>

                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="password"
                            className="text-sm font-medium text-[#D4D4D8]"
                        >
                            Password
                        </FieldLabel>

                        <PasswordField 
                            className="
                                h-12
                                border border-[#2A2A2A]
                                bg-[#111]
                                px-4
                                text-white
                                placeholder:text-[#52525C]
                                focus-visible:ring-2
                                focus-visible:ring-amber-500
                            " 
                            placeholder="Create a strong password"
                        />
                    </Field>

                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="confirm-password"
                            className="text-sm font-medium text-[#D4D4D8]"
                        >
                            Confirm Password
                        </FieldLabel>

                        <PasswordField 
                            className="
                                h-12
                                border border-[#2A2A2A]
                                bg-[#111]
                                px-4
                                text-white
                                placeholder:text-[#52525C]
                                focus-visible:ring-2
                                focus-visible:ring-amber-500
                            " 
                            placeholder="Re-enter your password"
                        />
                    </Field>

                    <div className="flex items-start gap-2 text-sm font-medium text-[#9F9FA9]">
                        <Checkbox
                            id="terms"
                            className="
                                mt-1
                                border-[#2A2A2A]
                                bg-[#111]
                                data-[state=checked]:bg-[#FE9A00]
                                data-[state=checked]:border-[#FE9A00]
                            "
                        />

                        <label
                            htmlFor="terms"
                            className="block cursor-pointer leading-6"
                        >
                            I agree to Courier&apos;s{" "}

                            <Link
                                to="/register"
                                className="
                                    inline
                                    text-[#FE9A00]
                                    transition-colors
                                    hover:text-amber-400
                                "
                            >
                                Terms of Service
                            </Link>

                            {" "}and{" "}

                            <Link
                                to="/register"
                                className="
                                    inline
                                    text-[#FE9A00]
                                    transition-colors
                                    hover:text-amber-400
                                "
                            >
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="
                            h-12
                            rounded-[16px]
                            bg-[#FE9A00]
                            text-[16px]
                            font-semibold
                            text-[#101828]
                            hover:bg-amber-400
                            shadow-lg
                            shadow-orange-400/20
                            hover:shadow-amber-500/30
                        "
                    >
                        Sign up
                    </Button>
                </FieldGroup>
            </form>

            <div className="pointer-events-none relative mt-13.5 mb-8.5 w-full">
                <div className="h-px w-full border border-[#2A2A2A]" />

                <p
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        bg-[#181818]
                        px-4
                        text-sm
                        text-[#71717B]
                    "
                >
                    Or continue with
                </p>
            </div>

            <Button
                type="button"
                variant="outline"
                className="
                    h-12
                    w-full
                    rounded-[16px]
                    border-[#2A2A2A]
                    bg-transparent
                    text-[16px]
                    font-semibold
                    text-white
                    hover:bg-[#202020]
                "
            >
                <GitHubIcon />
                Sign up with GitHub
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                <span className="font-normal text-[#71717B]">
                    Already have an account?
                </span>

                <Link
                    to="/login"
                    className="
                        text-[#FE9A00]
                        transition-colors
                        hover:text-amber-400
                    "
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}