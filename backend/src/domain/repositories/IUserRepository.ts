import { User } from "../entities/User.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;

  findByIdWithPassword(id: string): Promise<User | null>;
}