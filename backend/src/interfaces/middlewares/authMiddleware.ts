import {
    Request,
    Response,
    NextFunction,
} from "express";

import { ITokenService } from "../../application/interfaces/services/auth/ITokenService";

import { AppError } from "../../domain/errors/AppError";
import { statusCode } from "../../application/constants/enums/statusCode";

export const authMiddleware = (
    tokenService: ITokenService,
) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction,
    ) => {
        const accessToken =
            req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(
                "Access token is required",
                statusCode.UNAUTHORIZED,
            );
        }

        const payload = tokenService.verifyAccessToken(accessToken);

        req.user = payload;

        next();
    };
};