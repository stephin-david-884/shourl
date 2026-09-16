import {
    CreateShortUrlInputDTO,
    CreateShortUrlOutputDTO,
} from "../../../dtos/url/createShortUrl.dto";

export interface ICreateShortUrlUseCase {
    execute(
        data: CreateShortUrlInputDTO,
    ): Promise<CreateShortUrlOutputDTO>;
}