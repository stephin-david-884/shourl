import { ICreateShortUrlUseCase } from "../../interfaces/usecases/url/ICreateShortUrlUseCase";

import {
    CreateShortUrlInputDTO,
    CreateShortUrlOutputDTO,
} from "../../dtos/url/createShortUrl.dto";

import { IUrlRepository } from "../../../domain/repositories/IUrlRepository";

import { IUrlService } from "../../interfaces/services/url/IUrlService";

import { Url } from "../../../domain/entities/Url.entity";

export class CreateShortUrl
    implements ICreateShortUrlUseCase {
    constructor(
        private readonly _urlRepository: IUrlRepository,
        private readonly _urlService: IUrlService,
    ) { }

    async execute(
        data: CreateShortUrlInputDTO,
    ): Promise<CreateShortUrlOutputDTO> {
        const shortCode =
            await this._urlService.generateCode();

        const url = new Url({
            userId: data.userId,
            originalUrl: data.originalUrl,
            shortCode,
        });

        const savedUrl =
            await this._urlRepository.save(url);

        return {
            url: savedUrl,
        };
    }
}