import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { GitHubIcon } from "@/components/common/icons/GitHubIcon";

import {
    loginSchema,
    type LoginFormValues,
} from "@/features/auth/schemas/auth.schema";

import { useLogin } from "@/features/auth/hooks/use-login";
import { PasswordField } from "@/components/forms/password-field";

export default function Login() {
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = handleSubmit(
        async (values) => {
            await loginMutation.mutateAsync(
                values,
            );
        },
    );

    return (
        <div className="w-105 rounded-[16px] border border-[#2A2A2A] bg-[#181818] p-8">
            <div>
                <h2 className="text-2xl font-bold text-white">
                    Welcome back
                </h2>

                <p className="mt-1.5 text-[16px] font-normal text-[#9F9FA9]">
                    Sign in to your Courier account
                </p>
            </div>

            <form className="mt-8.5" onSubmit={onSubmit}>
                <FieldGroup className="gap-5">
                    {/* email */}
                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="email"
                            className="text-[#D4D4D8]"
                        >
                            Email
                        </FieldLabel>

                        <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            aria-invalid={!!errors.email}
                            {...register("email")}
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
                        {errors.email && (
                            <FieldDescription className="text-red-400">
                                {
                                    errors.email
                                        .message
                                }
                            </FieldDescription>
                        )}
                    </Field>

                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="password"
                            className="text-[#D4D4D8]"
                        >
                            Password
                        </FieldLabel>

                        <PasswordField
                            id="password"
                            aria-invalid={!!errors.password}
                            {...register("password")}
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
                        {errors.password && (
                            <FieldDescription className="text-red-400">
                                {
                                    errors.password
                                        .message
                                }
                            </FieldDescription>
                        )}
                    </Field>

                    {/* remember me and forgot password */}
                    {/* TODO: implement /forgot-password routes */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2 text-sm text-[#9F9FA9]">
                            <Checkbox id="remember" className="
                                mt-1
                                border-[#2A2A2A]
                                bg-[#111]
                                data-[state=checked]:bg-[#FE9A00]
                                data-[state=checked]:border-[#FE9A00]
                            " />

                            <label htmlFor="remember">
                                Remember me
                            </label>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="
                                text-sm
                                text-[#FE9A00]
                                transition-colors
                                hover:text-amber-400
                            "
                        >
                            Forgot password?
                        </Link>
                    </div>
                    
                    {/* submit */}
                    <Button
                        type="submit"
                        disabled={loginMutation.isPending}
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
                        {loginMutation.isPending
                            ? "Signing in..."
                            : "Sign in"}
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
                Sign in with GitHub
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                <span className="text-[#71717B]">
                    Don&apos;t have an account?
                </span>

                <Link
                    to="/register"
                    className="
                        text-[#FE9A00]
                        transition-colors
                        hover:text-amber-400
                    "
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}