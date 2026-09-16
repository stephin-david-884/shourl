import { useMemo, useState } from "react";

import {
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    ExternalLink,
    Trash2,
} from "lucide-react";

import {
    copyToClipboard,
    getPublicShortUrl,
} from "../../../lib/shortUrl";
import type { Url } from "../../../types/url";

const PAGE_SIZE = 8;

interface UrlTableProps {
    urls: Url[];
    deletingId: string | null;
    copiedId: string | null;
    onCopied: (urlId: string) => void;
    onDelete: (urlId: string) => void;
}

const UrlTable = ({
    urls,
    deletingId,
    copiedId,
    onCopied,
    onDelete,
}: UrlTableProps) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(urls.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const pageUrls = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return urls.slice(start, start + PAGE_SIZE);
    }, [currentPage, urls]);

    const rangeStart = urls.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const rangeEnd = Math.min(currentPage * PAGE_SIZE, urls.length);

    const handleCopy = async (url: Url) => {
        const shortUrl = getPublicShortUrl(url.shortCode);
        const success = await copyToClipboard(shortUrl);

        if (success) {
            onCopied(url.id);
        }
    };

    const handleOpen = (shortCode: string) => {
        window.open(
            getPublicShortUrl(shortCode),
            "_blank",
            "noopener,noreferrer",
        );
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        <tr>
                            <th className="px-4 py-3 sm:px-5">Original URL</th>
                            <th className="px-4 py-3 sm:px-5">Short URL</th>
                            <th className="px-4 py-3 text-right sm:px-5">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-neutral-100">
                        {pageUrls.map((url) => {
                            const shortUrl = getPublicShortUrl(url.shortCode);
                            const isDeleting = deletingId === url.id;
                            const isCopied = copiedId === url.id;

                            return (
                                <tr
                                    key={url.id}
                                    className="transition hover:bg-blue-50/50"
                                >
                                    <td className="max-w-[280px] px-4 py-4 sm:max-w-[360px] sm:px-5">
                                        <p
                                            className="truncate text-neutral-800"
                                            title={url.originalUrl}
                                        >
                                            {url.originalUrl}
                                        </p>
                                    </td>

                                    <td className="max-w-[220px] px-4 py-4 sm:px-5">
                                        <a
                                            href={shortUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate font-medium text-blue-700 hover:underline"
                                            title={shortUrl}
                                        >
                                            {shortUrl}
                                        </a>
                                    </td>

                                    <td className="px-4 py-4 sm:px-5">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpen(url.shortCode)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                                Open
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void handleCopy(url);
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                                            >
                                                {isCopied ? (
                                                    <Check className="h-3.5 w-3.5 text-blue-600" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                                {isCopied ? "Copied!" : "Copy"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(url.id)}
                                                disabled={isDeleting}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:-translate-y-0.5 hover:bg-red-50 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                {isDeleting
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-neutral-500">
                    Showing {rangeStart}–{rangeEnd} of {urls.length} URLs
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <span className="min-w-16 text-center text-xs font-medium text-neutral-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        type="button"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrlTable;
