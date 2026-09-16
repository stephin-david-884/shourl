import {
    useState,
    type FormEvent,
} from "react";

import { Eye, EyeOff, Link } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { ZodError } from "zod";

import { useAuth } from "../../../hooks/useAuth";

import {
    loginSchema,
    registerSchema,
} from "../../../lib/validation/authValidation";

interface AuthFormProps {
    mode: "login" | "signup";
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const AuthForm = ({ mode }: AuthFormProps) => {
    const navigate = useNavigate();

    const {
        register,
        login,
        loading,
        error,
    } = useAuth();

    const [formData, setFormData] =
        useState<FormData>({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const handleChange = (
        field: keyof FormData,
        value: string,
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: "",
        }));
    };

    const validate = () => {
        try {
            if (mode === "signup") {
                registerSchema.parse(formData);
            } else {
                loginSchema.parse({
                    email: formData.email,
                    password: formData.password,
                });
            }

            setErrors({});

            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors: Record<
                    string,
                    string
                > = {};

                error.issues.forEach((issue) => {
                    const field = issue.path[0];

                    if (
                        typeof field === "string" &&
                        !formattedErrors[field]
                    ) {
                        formattedErrors[field] =
                            issue.message;
                    }
                });

                setErrors(formattedErrors);
            }

            return false;
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            if (mode === "signup") {
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword:
                        formData.confirmPassword,
                });
            } else {
                await login({
                    email: formData.email,
                    password: formData.password,
                });
            }

            navigate("/dashboard");
        } catch {
            // Authentication error is handled by Redux state.
        }
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                    <Link className="h-6 w-6" />
                </div>

                <h1 className="text-2xl font-bold text-neutral-900">
                    {mode === "login"
                        ? "Welcome Back"
                        : "Create Your Account"}
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    {mode === "login"
                        ? "Login to continue to Shourl"
                        : "Create your Shourl account"}
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Name */}
                {mode === "signup" && (
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(event) =>
                                handleChange(
                                    "name",
                                    event.target.value,
                                )
                            }
                            className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20 ${errors.name
                                    ? "border-red-500"
                                    : "border-neutral-300 focus:border-blue-500"
                                }`}
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
                )}

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(event) =>
                            handleChange(
                                "email",
                                event.target.value,
                            )
                        }
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20 ${errors.email
                                ? "border-red-500"
                                : "border-neutral-300 focus:border-blue-500"
                            }`}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-medium text-neutral-700"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <input
                            id="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(event) =>
                                handleChange(
                                    "password",
                                    event.target.value,
                                )
                            }
                            className={`w-full rounded-lg border px-4 py-2.5 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20 ${errors.password
                                    ? "border-red-500"
                                    : "border-neutral-300 focus:border-blue-500"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (previous) => !previous,
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                {mode === "signup" && (
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={(event) =>
                                    handleChange(
                                        "confirmPassword",
                                        event.target.value,
                                    )
                                }
                                className={`w-full rounded-lg border px-4 py-2.5 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20 ${errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-neutral-300 focus:border-blue-500"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous,
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>
                )}

                {/* Backend Error */}
                {error && (
                    <p className="text-center text-sm text-red-500">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Processing..."
                        : mode === "login"
                            ? "Login"
                            : "Create Account"}
                </button>
            </form>

            {/* Switch Auth Mode */}
            <p className="mt-6 text-center text-sm text-neutral-600">
                {mode === "login" ? (
                    <>
                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Login
                        </button>
                    </>
                )}
            </p>
        </div>
    );
};

export default AuthForm;