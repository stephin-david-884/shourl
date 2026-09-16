export const getPublicShortUrl = (shortCode: string): string => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const origin = backendUrl
        ? backendUrl.replace(/\/$/, "")
        : "http://localhost:5000";

    return `${origin}/${shortCode}`;
};

export const copyToClipboard = async (
    text: string,
): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};
