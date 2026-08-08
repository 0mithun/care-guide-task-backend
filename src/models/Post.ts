import mongoose, { Schema, Document } from 'mongoose';
import { IPost } from '../domain/entities/Post';

export interface IPostDocument extends Document, Omit<IPost, '_id'> { }

const PostSchema: Schema = new Schema(
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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

PostSchema.index({ author: 1 });

export default mongoose.model<IPostDocument>('Post', PostSchema);
