import { IDeleteUrlUseCase } from "../../interfaces/usecases/url/IDeleteUrlUseCase";

import { DeleteUrlInputDTO } from "../../dtos/url/deleteUrl.dto";

import { IUrlRepository } from "../../../domain/repositories/IUrlRepository";

import { AppError } from "../../../domain/errors/AppError";
import { statusCode } from "../../constants/enums/statusCode";

export class DeleteUrl
    implements IDeleteUrlUseCase {
    constructor(
        private readonly _urlRepository: IUrlRepository,
    ) { }

    async execute(
        data: DeleteUrlInputDTO,
    ): Promise<void> {
        const url =
            await this._urlRepository.findById(
                data.urlId,
            );

        if (!url) {
            throw new AppError(
                "URL not found",
                statusCode.NOT_FOUND,
            );
        }

        if (url.userId !== data.userId) {
            throw new AppError(
                "You are not authorized to delete this URL",
                statusCode.FORBIDDEN,
            );
        }

        await this._urlRepository.deleteById(
            data.urlId,
        );
    }
}