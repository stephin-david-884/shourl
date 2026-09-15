import { User } from "../../domain/entities/User.entity";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

import {
    UserLean,
    UserModel,
} from "../database/models/User";

import {
    toDomainUser,
    toPersistenceUser,
} from "../../application/mappers/UserMapper";

import { BaseRepository } from "./BaseRepository";

export class UserRepository
    extends BaseRepository<User, UserLean>
    implements IUserRepository {
    constructor() {
        super(
            UserModel,
            toDomainUser,
            toPersistenceUser,
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this._model
            .findOne({ email })
            .select("+password")
            .lean();

        if (!user) {
            return null;
        }

        return toDomainUser(user);
    }

    async findByIdWithPassword(id: string): Promise<User | null> {
        const user = await this._model
            .findById(id)
            .select("+password")
            .lean();

        if (!user) {
            return null;
        }

        return toDomainUser(user);
    }
}