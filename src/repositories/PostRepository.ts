import { IPostRepository } from '../domain/repositories/IPostRepository';
import { IPost } from '../domain/entities/Post';
import PostModel from '../models/Post';

export class PostRepository implements IPostRepository {
  async create(post: Partial<IPost>): Promise<IPost> {
    const newPost = new PostModel(post);
    return newPost.save();
  }

  async findById(id: string): Promise<IPost | null> {
    return PostModel.findById(id);
  }

  async update(id: string, post: Partial<IPost>): Promise<IPost | null> {
    const existing = await PostModel.findById(id);
    if (!existing) return null;

    if (post.title !== undefined) existing.title = post.title;
    if (post.content !== undefined) existing.content = post.content;

    return existing.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async findAll(page: number, limit: number): Promise<{ posts: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const posts = await PostModel.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await PostModel.countDocuments();
    return { posts, total };
  }
}
