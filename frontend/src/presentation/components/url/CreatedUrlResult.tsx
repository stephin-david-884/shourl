import { useState } from "react";

import { Check, Copy, ExternalLink, PartyPopper } from "lucide-react";

import {
    copyToClipboard,
    getPublicShortUrl,
} from "../../../lib/shortUrl";
import type { Url } from "../../../types/url";

interface CreatedUrlResultProps {
    url: Url;
}

const CreatedUrlResult = ({ url }: CreatedUrlResultProps) => {
    const [copied, setCopied] = useState(false);
    const shortUrl = getPublicShortUrl(url.shortCode);

    const handleCopy = async () => {
        const success = await copyToClipboard(shortUrl);

        if (!success) {
            return;
        }

        setCopied(true);
        window.setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const handleOpen = () => {
        window.open(shortUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-emerald-800">
                <PartyPopper className="h-5 w-5" />
                <p className="text-sm font-semibold">
                    Your shortened URL is ready
                </p>
            </div>

            <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Original
            </p>
            <p className="mt-1 truncate text-sm text-neutral-600" title={url.originalUrl}>
                {url.originalUrl}
            </p>

            <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    Short URL
                </p>

                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-base font-semibold text-blue-700 transition hover:text-blue-800 hover:underline"
                >
                    {shortUrl}
                </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => {
                        void handleCopy();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                    {copied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy short URL"}
                </button>

                <button
                    type="button"
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:-translate-y-0.5 hover:bg-neutral-50"
                >
                    <ExternalLink className="h-4 w-4" />
                    Open
                </button>
            </div>
        </div>
    );
};

export default CreatedUrlResult;
