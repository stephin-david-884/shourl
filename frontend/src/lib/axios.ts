import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:5000/api";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let _logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void) => {
    _logoutHandler = handler;
};

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
    resolve: () => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((request) => {
        if (error) {
            request.reject(error);
        } else {
            request.resolve();
        }
    });

    failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest =
            error.config as CustomAxiosRequestConfig | undefined;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response.status;

        const isAuthRoute =
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/logout");

        if (status === 401 && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(api(originalRequest)),
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post("/auth/refresh");

                processQueue(null);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);

                if (_logoutHandler) {
                    _logoutHandler();
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default api;