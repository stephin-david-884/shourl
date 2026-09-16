export interface Url {
    id: string;
    userId: string;
    originalUrl: string;
    shortCode: string;
}

export interface CreateShortUrlRequest {
    originalUrl: string;
}

export interface CreateShortUrlResponse {
    url: Url;
}

export interface GetUserUrlsResponse {
    urls: Url[];
}

export interface DeleteUrlResponse {
    urlId: string;
}

export interface UrlState {
    urls: Url[];
    loading: boolean;
    creating: boolean;
    deletingId: string | null;
    error: string | null;
}
