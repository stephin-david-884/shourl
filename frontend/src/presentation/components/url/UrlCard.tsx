import { Check, Copy, ExternalLink, Trash2 } from "lucide-react";

import {
    copyToClipboard,
    getPublicShortUrl,
} from "../../../lib/shortUrl";
import type { Url } from "../../../types/url";

interface UrlCardProps {
    url: Url;
    isDeleting: boolean;
    isCopied: boolean;
    onCopied: (urlId: string) => void;
    onDelete: (urlId: string) => void;
}

const UrlCard = ({
    url,
    isDeleting,
    isCopied,
    onCopied,
    onDelete,
}: UrlCardProps) => {
    const shortUrl = getPublicShortUrl(url.shortCode);

    const handleCopy = async () => {
        const success = await copyToClipboard(shortUrl);

        if (success) {
            onCopied(url.id);
        }
    };

    const handleOpen = () => {
        window.open(shortUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="space-y-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Original URL
                    </p>
                    <p className="mt-1 break-all text-sm text-neutral-700">
                        {url.originalUrl}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Short URL
                    </p>
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block break-all text-sm font-medium text-blue-700 hover:underline"
                    >
                        {shortUrl}
                    </a>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                    <ExternalLink className="h-4 w-4" />
                    Open
                </button>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                    {isCopied ? (
                        <Check className="h-4 w-4 text-blue-600" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    {isCopied ? "Copied!" : "Copy"}
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(url.id)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </article>
    );
};

export default UrlCard;
