import { Types } from "mongoose";
import { Url } from "../../domain/entities/Url.entity";

import { UrlLean } from "../../infrastructure/database/models/Url";

export const toDomainUrl = (dbUrl: UrlLean): Url => {
    return new Url({
        id: dbUrl._id.toString(),
        userId: dbUrl.userId.toString(),
        originalUrl: dbUrl.originalUrl,
        shortCode: dbUrl.shortCode,
    });
};

export const toPersistenceUrl = (url: Url) => {
    return {
        userId: new Types.ObjectId(url.userId),
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
    };
};