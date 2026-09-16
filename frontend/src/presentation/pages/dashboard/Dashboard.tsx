import { useState } from "react";

import CreatedUrlResult from "../../components/url/CreatedUrlResult";
import UrlForm from "../../components/url/UrlForm";
import type { Url } from "../../../types/url";

const Dashboard = () => {
    const [createdUrl, setCreatedUrl] = useState<Url | null>(null);

    return (
        <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-sm text-neutral-500">
                Create a short, shareable link from any long URL.
            </p>

            <UrlForm onCreated={setCreatedUrl} />

            {createdUrl && <CreatedUrlResult url={createdUrl} />}
        </div>
    );
};

export default Dashboard;
