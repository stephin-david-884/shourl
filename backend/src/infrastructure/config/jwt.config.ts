import { SignOptions } from "jsonwebtoken";

export const jwtConfig = {
    accessToken: {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: "15m" as SignOptions["expiresIn"],
    },

    refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: "7d" as SignOptions["expiresIn"],
    },
};