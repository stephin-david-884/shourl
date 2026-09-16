import { IGetUserUrlsUseCase } from "../../interfaces/usecases/url/IGetUserUrlsUseCase";

import {
    GetUserUrlsInputDTO,
    GetUserUrlsOutputDTO,
} from "../../dtos/url/getUserUrls.dto";

import { IUrlRepository } from "../../../domain/repositories/IUrlRepository";

export class GetUserUrls
    implements IGetUserUrlsUseCase {
    constructor(
        private readonly _urlRepository: IUrlRepository,
    ) { }

    async execute(
        data: GetUserUrlsInputDTO,
    ): Promise<GetUserUrlsOutputDTO> {
        const urls =
            await this._urlRepository.findByUserId(
                data.userId,
            );

        return {
            urls,
        };
    }
}