import { useState } from "react";

import {
    ClipboardPaste,
    Copy,
    Link2,
    MousePointerClick,
    Sparkles,
} from "lucide-react";

import CreatedUrlResult from "../../components/url/CreatedUrlResult";
import UrlForm from "../../components/url/UrlForm";
import type { Url } from "../../../types/url";

const steps = [
    {
        icon: ClipboardPaste,
        title: "Paste a long URL",
        description:
            "Copy a link from your browser and paste it into the field. You can use Ctrl+V or the Paste button.",
    },
    {
        icon: MousePointerClick,
        title: "Click Shorten URL",
        description:
            "We’ll create a compact short code for that link. The original destination stays the same.",
    },
    {
        icon: Copy,
        title: "Copy or open it",
        description:
            "Share the short URL anywhere. Opening it redirects people to your original page.",
    },
];

const Dashboard = () => {
    const [createdUrl, setCreatedUrl] = useState<Url | null>(null);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 text-white shadow-lg sm:p-8">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                        <Sparkles className="h-6 w-6" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-blue-100">
                            Quick shorten
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                            Turn long links into short ones
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                            Paste any public web address, generate a short URL,
                            then copy and share it in one click.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
                <div>
                    <UrlForm onCreated={setCreatedUrl} />
                    {createdUrl && <CreatedUrlResult url={createdUrl} />}
                </div>

                <aside className="h-fit rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <Link2 className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-amber-950">
                                How to shorten a URL
                            </h3>
                            <p className="text-xs text-amber-800/80">
                                A quick note before you start
                            </p>
                        </div>
                    </div>

                    <ol className="space-y-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <li
                                    key={step.title}
                                    className="flex gap-3 rounded-xl bg-white/70 p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                                        {index + 1}
                                    </span>

                                    <div className="min-w-0">
                                        <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                                            <Icon className="h-3.5 w-3.5 text-amber-600" />
                                            {step.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-neutral-600">
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    <p className="mt-4 rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs leading-5 text-amber-900">
                        Tip: the URL must start with{" "}
                        <span className="font-semibold">http://</span> or{" "}
                        <span className="font-semibold">https://</span>
                    </p>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
