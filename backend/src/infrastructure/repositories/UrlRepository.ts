import { Url } from "../../domain/entities/Url.entity";
import { IUrlRepository } from "../../domain/repositories/IUrlRepository";

import {
    UrlLean,
    UrlModel,
} from "../database/models/Url";

import {
    toDomainUrl,
    toPersistenceUrl,
} from "../../application/mappers/UrlMapper";

import { BaseRepository } from "./BaseRepository";

export class UrlRepository
    extends BaseRepository<Url, UrlLean>
    implements IUrlRepository {
    constructor() {
        super(
            UrlModel,
            toDomainUrl,
            toPersistenceUrl,
        );
    }

    async findByShortCode(
        shortCode: string,
    ): Promise<Url | null> {
        const url = await this._model
            .findOne({ shortCode })
            .lean();

        if (!url) {
            return null;
        }

        return toDomainUrl(url);
    }

    async findByUserId(
        userId: string,
    ): Promise<Url[]> {
        const urls = await this._model
            .find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return urls.map((url) => toDomainUrl(url));
    }
}