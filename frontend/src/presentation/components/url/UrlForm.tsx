import {
    useMemo,
    useState,
    type FormEvent,
} from "react";

import { ClipboardPaste, Link2, LoaderCircle } from "lucide-react";
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
    const [pasteHint, setPasteHint] = useState("");

    const isValidUrl = useMemo(
        () => createShortUrlSchema.safeParse({ originalUrl }).success,
        [originalUrl],
    );

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

    const handlePaste = async () => {
        setPasteHint("");

        try {
            const text = await navigator.clipboard.readText();
            const pasted = text.trim();

            if (!pasted) {
                setPasteHint("Clipboard is empty. Copy a URL first, then try again.");
                return;
            }

            setOriginalUrl(pasted);
            setFieldError("");
            if (error) {
                clearError();
            }
        } catch {
            setPasteHint("Clipboard access was blocked. Paste with Ctrl+V instead.");
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
        setPasteHint("");

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
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8"
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                    Paste your long URL
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                    Drop in the full link, then shorten it instantly.
                </p>
            </div>

            <label
                htmlFor="originalUrl"
                className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
                Long URL
            </label>

            <div className="relative">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                    id="originalUrl"
                    type="url"
                    placeholder="https://www.example.com/some/very/long/url"
                    value={originalUrl}
                    onChange={(event) => {
                        setOriginalUrl(event.target.value);
                        setFieldError("");
                        setPasteHint("");
                        if (error) {
                            clearError();
                        }
                    }}
                    className={`w-full rounded-xl border py-3 pl-10 pr-28 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/20 ${
                        fieldError
                            ? "border-red-500"
                            : isValidUrl
                                ? "border-emerald-400 focus:border-emerald-500"
                                : "border-neutral-300 focus:border-blue-500"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => {
                        void handlePaste();
                    }}
                    className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                    <ClipboardPaste className="h-3.5 w-3.5" />
                    Paste
                </button>
            </div>

            <div className="mt-2 flex min-h-5 items-center justify-between gap-3">
                <p className="text-xs text-neutral-400">
                    {originalUrl.trim().length > 0
                        ? `${originalUrl.trim().length} characters`
                        : "Ready when you are"}
                </p>

                {isValidUrl && (
                    <p className="text-xs font-medium text-emerald-600">
                        Looks like a valid URL
                    </p>
                )}
            </div>

            {fieldError && (
                <p className="mt-2 text-sm text-red-500">
                    {fieldError}
                </p>
            )}

            {pasteHint && !fieldError && (
                <p className="mt-2 text-sm text-amber-700">
                    {pasteHint}
                </p>
            )}

            {error && !fieldError && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={creating}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {creating ? (
                    <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Shortening...
                    </>
                ) : (
                    "Shorten URL"
                )}
            </button>
        </form>
    );
};

export default UrlForm;
