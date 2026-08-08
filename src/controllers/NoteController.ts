import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import {
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteByIdUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase
} from '../use-cases/NoteUseCases';

export class NoteController {
  constructor(
    private createNoteUseCase: CreateNoteUseCase,
    private listNotesUseCase: ListNotesUseCase,
    private getNoteByIdUseCase: GetNoteByIdUseCase,
    private updateNoteUseCase: UpdateNoteUseCase,
    private deleteNoteUseCase: DeleteNoteUseCase
  ) {}

  async createNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const { title, content } = req.body;
      const note = await this.createNoteUseCase.execute({
        title,
        content,
        owner: req.user._id
      });
      res.status(201).json({ message: 'Note created successfully', note });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async listNotes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await this.listNotesUseCase.execute(page, limit, {
        id: req.user._id.toString(),
        role: req.user.role
      });

      res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
        totalNotes: result.total,
        notes: result.notes
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error listing notes', error: error.message });
    }
  }

  async getNoteById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const note = await this.getNoteByIdUseCase.execute(req.params.id as string, {
        id: req.user._id.toString(),
        role: req.user.role
      });

      if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }
      res.status(200).json({ note });
    } catch (error: any) {
      // Catch ownership violations or errors
      const status = error.message.includes('Access denied') ? 403 : 400;
      res.status(status).json({ message: error.message });
    }
  }

  async updateNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const { title, content } = req.body;
      const note = await this.updateNoteUseCase.execute(
        req.params.id as string,
        { title, content },
        req.user._id.toString()
      );

      if (!note) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }
      res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error: any) {
      const status = error.message.includes('Access denied') ? 403 : 400;
      res.status(status).json({ message: error.message });
    }
  }

  async deleteNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const success = await this.deleteNoteUseCase.execute(
        req.params.id as string,
        req.user._id.toString()
      );

      if (!success) {
        res.status(404).json({ message: 'Note not found' });
        return;
      }
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error: any) {
      const status = error.message.includes('Access denied') ? 403 : 400;
      res.status(status).json({ message: error.message });
    }
  }
}
