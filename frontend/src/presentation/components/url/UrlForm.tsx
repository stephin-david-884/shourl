import {
    useState,
    type FormEvent,
} from "react";

import { Link2 } from "lucide-react";
import { ZodError } from "zod";

import { useUrls } from "../../../hooks/useUrls";
import { createShortUrlSchema } from "../../../lib/validation/urlValidation";
import type { Url } from "../../../types/url";

interface UrlFormProps {
    onCreated: (url: Url) => void;
}

const UrlForm = ({ onCreated }: UrlFormProps) => {
    const {
        createUrl,
        creating,
        error,
        clearError,
    } = useUrls();

    const [originalUrl, setOriginalUrl] = useState("");
    const [fieldError, setFieldError] = useState("");

    const validate = () => {
        try {
            createShortUrlSchema.parse({ originalUrl });
            setFieldError("");
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                setFieldError(
                    error.issues[0]?.message || "Enter a valid URL",
                );
            }

            return false;
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (creating) {
            return;
        }

        clearError();

        if (!validate()) {
            return;
        }

        try {
            const created = await createUrl({
                originalUrl: originalUrl.trim(),
            });

            onCreated(created);
            setOriginalUrl("");
        } catch {
            // Creation error is handled by Redux state.
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                    Shorten a long URL
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                    Paste a link and generate a shareable short URL.
                </p>
            </div>

            <label
                htmlFor="originalUrl"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
                Enter your long URL
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                    <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                    <input
                        id="originalUrl"
                        type="url"
                        placeholder="https://www.example.com/some/very/long/url"
                        value={originalUrl}
                        onChange={(event) => {
                            setOriginalUrl(event.target.value);
                            setFieldError("");
                            if (error) {
                                clearError();
                            }
                        }}
                        className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20 ${
                            fieldError
                                ? "border-red-500"
                                : "border-neutral-300 focus:border-blue-500"
                        }`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {creating ? "Shortening..." : "Shorten URL"}
                </button>
            </div>

            {fieldError && (
                <p className="mt-2 text-sm text-red-500">
                    {fieldError}
                </p>
            )}

            {error && !fieldError && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}
        </form>
    );
};

export default UrlForm;
