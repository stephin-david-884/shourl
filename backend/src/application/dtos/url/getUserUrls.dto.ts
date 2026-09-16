import { Url } from "../../../domain/entities/Url.entity";

export interface GetUserUrlsInputDTO {
    userId: string;
}

export interface GetUserUrlsOutputDTO {
    urls: Url[];
}