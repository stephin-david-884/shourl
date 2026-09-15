import { Model, Types } from "mongoose";

import { IBaseRepository } from "../../domain/repositories/IBaseRepository";
import { AppError } from "../../domain/errors/AppError";
import { statusCode } from "../../application/constants/enums/statusCode";

export abstract class BaseRepository<
    T extends { id?: string },
    D extends { _id: Types.ObjectId },
> implements IBaseRepository<T> {
    constructor(
        protected _model: Model<D>,
        protected _toDomain: (doc: D) => T,
        protected _toPersistence: (entity: T) => Partial<D>,
    ) { }

    async findById(id: string): Promise<T | null> {
        const doc = await this._model.findById(id).lean();

        if (!doc) {
            return null;
        }

        return this._toDomain(doc);
    }

    async save(entity: T): Promise<T> {
        const data = this._toPersistence(entity);

        let saved;

        if (entity.id) {
            saved = await this._model.findByIdAndUpdate(
                entity.id,
                data,
                {
                    new: true,
                    runValidators: true,
                },
            );
        } else {
            saved = await this._model.create(data);
        }

        if (!saved) {
            throw new AppError(
                "Failed to save entity",
                statusCode.BAD_REQUEST,
            );
        }

        const plain = saved.toObject ? saved.toObject() : saved;

        return this._toDomain(plain);
    }

    async deleteById(id: string): Promise<void> {
        const deleted = await this._model.findByIdAndDelete(id);

        if (!deleted) {
            throw new AppError(
                "Entity not found",
                statusCode.NOT_FOUND,
            );
        }
    }

    async findAll(): Promise<T[]> {
        const docs = await this._model.find().lean();

        return docs.map((doc) => this._toDomain(doc));
    }
}