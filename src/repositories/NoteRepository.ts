import { INoteRepository } from '../domain/repositories/INoteRepository';
import { INote } from '../domain/entities/Note';
import NoteModel from '../models/Note';

export class NoteRepository implements INoteRepository {
  async create(note: Partial<INote>): Promise<INote> {
    const newNote = new NoteModel(note);
    return newNote.save();
  }

  async findById(id: string): Promise<INote | null> {
    return NoteModel.findById(id);
  }

  async update(id: string, note: Partial<INote>): Promise<INote | null> {
    const existing = await NoteModel.findById(id);
    if (!existing) return null;

    if (note.title !== undefined) existing.title = note.title;
    if (note.content !== undefined) existing.content = note.content;

    return existing.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await NoteModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async list(page: number, limit: number, ownerId?: string): Promise<{ notes: INote[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (ownerId) {
      query.owner = ownerId;
    }
    const notes = await NoteModel.find(query)
      .populate('owner', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await NoteModel.countDocuments(query);
    return { notes, total };
  }
}
