import mongoose, { Schema, Document } from 'mongoose';
import { INote } from '../domain/entities/Note';

export interface INoteDocument extends Document, Omit<INote, '_id'> { }

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

NoteSchema.index({ owner: 1, createdAt: -1 });

NoteSchema.index({ createdAt: -1 });

export default mongoose.model<INoteDocument>('Note', NoteSchema);
