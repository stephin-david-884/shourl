import { IRedirectUrlUseCase } from "../../interfaces/usecases/url/IRedirectUrlUseCase";

import {
    RedirectUrlInputDTO,
    RedirectUrlOutputDTO,
} from "../../dtos/url/redirectUrl.dto";

import { IUrlRepository } from "../../../domain/repositories/IUrlRepository";

import { AppError } from "../../../domain/errors/AppError";
import { statusCode } from "../../constants/enums/statusCode";

export class RedirectUrl
    implements IRedirectUrlUseCase {
    constructor(
        private readonly _urlRepository: IUrlRepository,
    ) { }

    async execute(
        data: RedirectUrlInputDTO,
    ): Promise<RedirectUrlOutputDTO> {
        const url =
            await this._urlRepository.findByShortCode(
                data.shortCode,
            );

        if (!url) {
            throw new AppError(
                "Short URL not found",
                statusCode.NOT_FOUND,
            );
        }

        return {
            originalUrl: url.originalUrl,
        };
    }
}