import { IPost } from '../entities/Post';

export interface IPostRepository {
  create(post: Partial<IPost>): Promise<IPost>;
  findById(id: string): Promise<IPost | null>;
  update(id: string, post: Partial<IPost>): Promise<IPost | null>;
  delete(id: string): Promise<boolean>;
  findAll(page: number, limit: number): Promise<{ posts: any[]; total: number }>;
}
