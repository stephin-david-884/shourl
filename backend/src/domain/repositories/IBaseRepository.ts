export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  deleteById(id: string): Promise<void>;
  findAll(): Promise<T[]>;
}