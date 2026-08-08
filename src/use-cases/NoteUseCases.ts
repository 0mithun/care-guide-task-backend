import { INoteRepository } from '../domain/repositories/INoteRepository';
import { INote } from '../domain/entities/Note';

export class CreateNoteUseCase {
  constructor(private noteRepository: INoteRepository) { }

  async execute(data: Partial<INote>): Promise<INote> {
    if (!data.title || !data.content || !data.owner) {
      throw new Error('Title, content, and owner are required');
    }
    return this.noteRepository.create(data);
  }
}

export class ListNotesUseCase {
  constructor(private noteRepository: INoteRepository) { }

  async execute(page: number, limit: number, user: { id: string; role: string }): Promise<{ notes: INote[]; total: number }> {
    const ownerId = user.role === 'admin' ? undefined : user.id;
    return this.noteRepository.list(page, limit, ownerId);
  }
}

export class GetNoteByIdUseCase {
  constructor(private noteRepository: INoteRepository) { }

  async execute(noteId: string, user: { id: string; role: string }): Promise<INote | null> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      return null;
    }
    if (note.owner.toString() !== user.id && user.role !== 'admin') {
      throw new Error('Access denied: You do not own this note');
    }
    return note;
  }
}

export class UpdateNoteUseCase {
  constructor(private noteRepository: INoteRepository) { }

  async execute(noteId: string, data: Partial<INote>, userId: string): Promise<INote | null> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      return null;
    }
    if (note.owner.toString() !== userId) {
      throw new Error('Access denied: Only the owner can update this note');
    }
    return this.noteRepository.update(noteId, data);
  }
}

export class DeleteNoteUseCase {
  constructor(private noteRepository: INoteRepository) { }

  async execute(noteId: string, userId: string): Promise<boolean> {
    const note = await this.noteRepository.findById(noteId);
    if (!note) {
      return false;
    }
    if (note.owner.toString() !== userId) {
      throw new Error('Access denied: Only the owner can delete this note');
    }
    return this.noteRepository.delete(noteId);
  }
}
