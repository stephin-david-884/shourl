import {
    RedirectUrlInputDTO,
    RedirectUrlOutputDTO,
} from "../../../dtos/url/redirectUrl.dto";

export interface IRedirectUrlUseCase {
    execute(
        data: RedirectUrlInputDTO,
    ): Promise<RedirectUrlOutputDTO>;
}