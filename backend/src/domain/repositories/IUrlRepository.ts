import { Url } from "../entities/Url.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IUrlRepository extends IBaseRepository<Url> {
    findByShortCode(shortCode: string): Promise<Url | null>;

    findByUserId(userId: string): Promise<Url[]>;
}