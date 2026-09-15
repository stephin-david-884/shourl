import { env } from "./env";

const isProduction = env.NODE_ENV === "production";

const baseCookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

export const authCookieConfig = {
  accessToken: {
    ...baseCookieConfig,
    maxAge: env.ACCESS_TOKEN_MAX_AGE,
  },

  refreshToken: {
    ...baseCookieConfig,
    maxAge: env.REFRESH_TOKEN_MAX_AGE,
  },
};