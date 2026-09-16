import { Url } from "../../../domain/entities/Url.entity";

export interface CreateShortUrlInputDTO {
  originalUrl: string;
  userId: string;
}

export interface CreateShortUrlOutputDTO {
  url: Url;
}