import { INote } from '../entities/Note';

export interface INoteRepository {
  create(note: Partial<INote>): Promise<INote>;
  findById(id: string): Promise<INote | null>;
  update(id: string, note: Partial<INote>): Promise<INote | null>;
  delete(id: string): Promise<boolean>;
  list(page: number, limit: number, ownerId?: string): Promise<{ notes: INote[]; total: number }>;
}
