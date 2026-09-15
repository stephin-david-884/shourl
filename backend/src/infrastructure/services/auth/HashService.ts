import bcrypt from "bcryptjs";

import { IHashService } from "../../../application/interfaces/services/auth/IHashService";

export class HashService implements IHashService {
    constructor(private readonly saltRounds: number = 10) { }

    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, this.saltRounds);
    }

    async compare(value: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(value, hashed);
    }
}