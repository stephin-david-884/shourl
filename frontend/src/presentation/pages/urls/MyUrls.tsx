import { useEffect, useState } from "react";

import { Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useUrls } from "../../../hooks/useUrls";
import Spinner from "../../components/common/Spinner";
import UrlCard from "../../components/url/UrlCard";

const MyUrls = () => {
    const navigate = useNavigate();
    const {
        urls,
        loading,
        deletingId,
        error,
        fetchUrls,
        removeUrl,
        clearError,
    } = useUrls();

    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        void fetchUrls();
    }, [fetchUrls]);

    const handleCopied = (urlId: string) => {
        setCopiedId(urlId);

        window.setTimeout(() => {
            setCopiedId((current) =>
                current === urlId ? null : current,
            );
        }, 1500);
    };

    const handleDelete = async (urlId: string) => {
        const confirmed = window.confirm(
            "Delete this short URL? This action cannot be undone.",
        );

        if (!confirmed) {
            return;
        }

        try {
            await removeUrl(urlId);
        } catch {
            // Deletion error is handled by Redux state.
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error && urls.length === 0) {
        return (
            <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-sm text-red-600">{error}</p>
                <button
                    type="button"
                    onClick={() => {
                        clearError();
                        void fetchUrls();
                    }}
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (urls.length === 0) {
        return (
            <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Link2 className="h-6 w-6" />
                </div>

                <h2 className="text-lg font-semibold text-neutral-900">
                    No shortened URLs yet.
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                    Create your first short URL to get started.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Shorten URL
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            {error && (
                <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={clearError}
                        className="font-medium hover:underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {urls.map((url) => (
                <UrlCard
                    key={url.id}
                    url={url}
                    isDeleting={deletingId === url.id}
                    isCopied={copiedId === url.id}
                    onCopied={handleCopied}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default MyUrls;
