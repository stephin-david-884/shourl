import { useState } from "react";

import { Check, Copy, ExternalLink } from "lucide-react";

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
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-sm font-medium text-blue-800">
                Your shortened URL
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1 break-all text-sm font-semibold text-blue-700 hover:underline"
                >
                    {shortUrl}
                </a>

                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                    </button>

                    <button
                        type="button"
                        onClick={handleOpen}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatedUrlResult;
