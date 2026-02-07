export interface CollectionPort<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<void>;
  createBatch(items: T[]): Promise<void>;
  update(item: T): Promise<void>;
  delete(id: string): Promise<void>;
  deleteBatch(ids: string[]): Promise<void>;
  clear(): Promise<void>;
}
