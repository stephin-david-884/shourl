import { Request, Response } from "express";

import { statusCode } from "../../../application/constants/enums/statusCode";

import { ICreateShortUrlUseCase } from "../../../application/interfaces/usecases/url/ICreateShortUrlUseCase";
import { IGetUserUrlsUseCase } from "../../../application/interfaces/usecases/url/IGetUserUrlsUseCase";
import { IDeleteUrlUseCase } from "../../../application/interfaces/usecases/url/IDeleteUrlUseCase";
import { IRedirectUrlUseCase } from "../../../application/interfaces/usecases/url/IRedirectUrlUseCase";

import { AppError } from "../../../domain/errors/AppError";

import { asyncHandler } from "../../http/asyncHandler";
import { sendSuccess } from "../../http/response";

export class UrlController {
    constructor(
        private readonly _createShortUrlUseCase: ICreateShortUrlUseCase,
        private readonly _getUserUrlsUseCase: IGetUserUrlsUseCase,
        private readonly _deleteUrlUseCase: IDeleteUrlUseCase,
        private readonly _redirectUrlUseCase: IRedirectUrlUseCase,
    ) { }

    createShortUrl = asyncHandler(
        async (req: Request, res: Response) => {
            if (!req.user) {
                throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
            }

            const result =
                await this._createShortUrlUseCase.execute({
                    originalUrl: req.body.originalUrl,
                    userId: req.user.userId,
                });

            return sendSuccess(
                res,
                statusCode.CREATED,
                "Short URL created successfully",
                {
                    url: result.url,
                },
            );
        },
    );

    getUserUrls = asyncHandler(
        async (req: Request, res: Response) => {
            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    statusCode.UNAUTHORIZED,
                );
            }

            const result =
                await this._getUserUrlsUseCase.execute({
                    userId: req.user.userId,
                });

            return sendSuccess(
                res,
                statusCode.OK,
                "URLs fetched successfully",
                {
                    urls: result.urls,
                },
            );
        },
    );

    deleteUrl = asyncHandler(
        async (req: Request, res: Response) => {
            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    statusCode.UNAUTHORIZED,
                );
            }

            const urlId = Array.isArray(req.params.urlId)
                ? req.params.urlId[0]
                : req.params.urlId;

            if (!urlId) {
                throw new AppError(
                    "Invalid URL ID",
                    statusCode.BAD_REQUEST,
                );
            }

            await this._deleteUrlUseCase.execute({
                urlId,
                userId: req.user.userId,
            });

            return sendSuccess(
                res,
                statusCode.OK,
                "URL deleted successfully",
            );
        },
    );

    redirectUrl = asyncHandler(
        async (req: Request, res: Response) => {
            const shortCode = Array.isArray(
                req.params.shortCode,
            )
                ? req.params.shortCode[0]
                : req.params.shortCode;

            if (!shortCode) {
                throw new AppError(
                    "Invalid short code",
                    statusCode.BAD_REQUEST,
                );
            }

            const result =
                await this._redirectUrlUseCase.execute({
                    shortCode,
                });

            return res.redirect(result.originalUrl);
        },
    );
}