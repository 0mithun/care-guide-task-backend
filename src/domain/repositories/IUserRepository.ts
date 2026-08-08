import { IUser } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  list(page: number, limit: number): Promise<{ users: IUser[]; total: number }>;
  groupByInterests(): Promise<any[]>;
  getUserPosts(userId: string): Promise<any>;
}
