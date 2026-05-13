import { Link } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { GitHubIcon } from "@/components/common/icons/GitHubIcon";
import { PasswordField } from "@/components/forms/password-field";

import {
    registerSchema,
    type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";

import { useRegister } from "@/features/auth/hooks/use-register";

export default function Register() {
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });

    const terms = useWatch({
        control,
        name: "terms",
    });

    const onSubmit = handleSubmit(
        async (values) => {
            const {
                confirmPassword,
                terms,
                ...payload
            } = values;

            await registerMutation.mutateAsync(payload);
        },
    );

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

            <form className="mt-8.5" onSubmit={onSubmit}>
                <FieldGroup className="gap-5">
                    {/* full name */}
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
                            aria-invalid={!!errors.fullName}
                            {...register("fullName")}
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

                        {errors.fullName && (
                            <FieldDescription className="text-red-400">
                                {errors.fullName.message}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* email */}
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
                                {errors.email.message}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* password */}
                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="password"
                            className="text-sm font-medium text-[#D4D4D8]"
                        >
                            Password
                        </FieldLabel>

                        <PasswordField
                            id="password"
                            placeholder="Create a strong password"
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
                                {errors.password.message}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* confirm password */}
                    <Field className='gap-2'>
                        <FieldLabel
                            htmlFor="confirm-password"
                            className="text-sm font-medium text-[#D4D4D8]"
                        >
                            Confirm Password
                        </FieldLabel>

                        <PasswordField
                            id="confirmPassword"
                            placeholder="Re-enter your password"
                            aria-invalid={!!errors.confirmPassword}
                            {...register("confirmPassword")}
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

                        {errors.confirmPassword && (
                            <FieldDescription className="text-red-400">
                                {errors.confirmPassword.message}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* terms */}
                    {/* TODO: implement /terms and /privacy routes */}
                    <Field className="gap-2">
                        <div className="flex items-start gap-2 text-sm font-medium text-[#9F9FA9]">
                            <Checkbox
                                id="terms"
                                checked={terms}
                                onCheckedChange={(checked) =>
                                    setValue(
                                        "terms",
                                        !!checked,
                                        {
                                            shouldValidate: true,
                                        },
                                    )
                                }
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
                                    to="/terms"
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
                                    to="/privacy"
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

                        {errors.terms && (
                            <FieldDescription className="text-red-400">
                                {errors.terms.message}
                            </FieldDescription>
                        )}
                    </Field>

                    {/* submit */}
                    <Button
                        type="submit"
                        disabled={registerMutation.isPending}
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
                        {registerMutation.isPending
                            ? "Creating account..."
                            : "Sign up"}
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