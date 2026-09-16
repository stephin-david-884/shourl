export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    GET_ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  URLS: {
    BASE: "/urls",
    BY_ID: (urlId: string) => `/urls/${urlId}`,
  },
} as const;