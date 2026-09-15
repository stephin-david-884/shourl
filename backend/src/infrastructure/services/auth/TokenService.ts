import jwt from "jsonwebtoken";

import { AppError } from "../../../domain/errors/AppError";
import { statusCode } from "../../../application/constants/enums/statusCode";
import { jwtConfig } from "../../config/jwt.config";

import {
    AccessTokenPayload,
    ITokenService,
    RefreshTokenPayload,
} from "../../../application/interfaces/services/auth/ITokenService";

export class TokenService implements ITokenService {
    generateAccessToken(payload: AccessTokenPayload): string {
        const secret = jwtConfig.accessToken.secret;

        if (!secret) {
            throw new AppError(
                "Access token secret is not configured",
                statusCode.SERVER_ERROR,
            );
        }

        return jwt.sign(payload, secret, {
            expiresIn: jwtConfig.accessToken.expiresIn,
        });
    }

    generateRefreshToken(payload: RefreshTokenPayload): string {
        const secret = jwtConfig.refreshToken.secret;

        if (!secret) {
            throw new AppError(
                "Refresh token secret is not configured",
                statusCode.SERVER_ERROR,
            );
        }

        return jwt.sign(payload, secret, {
            expiresIn: jwtConfig.refreshToken.expiresIn,
        });
    }

    verifyAccessToken(token: string): AccessTokenPayload {
        const secret = jwtConfig.accessToken.secret;

        if (!secret) {
            throw new AppError(
                "Access token secret is not configured",
                statusCode.SERVER_ERROR,
            );
        }

        try {
            return jwt.verify(token, secret) as AccessTokenPayload;
        } catch {
            throw new AppError(
                "Invalid or expired access token",
                statusCode.UNAUTHORIZED,
            );
        }
    }

    verifyRefreshToken(token: string): RefreshTokenPayload {
        const secret = jwtConfig.refreshToken.secret;

        if (!secret) {
            throw new AppError(
                "Refresh token secret is not configured",
                statusCode.SERVER_ERROR,
            );
        }

        try {
            return jwt.verify(token, secret) as RefreshTokenPayload;
        } catch {
            throw new AppError(
                "Invalid or expired refresh token",
                statusCode.UNAUTHORIZED,
            );
        }
    }
}