import {
    GetUserUrlsInputDTO,
    GetUserUrlsOutputDTO,
} from "../../../dtos/url/getUserUrls.dto";

export interface IGetUserUrlsUseCase {
    execute(
        data: GetUserUrlsInputDTO,
    ): Promise<GetUserUrlsOutputDTO>;
}