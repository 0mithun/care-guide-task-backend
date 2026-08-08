import { IPostRepository } from '../domain/repositories/IPostRepository';
import { IPost } from '../domain/entities/Post';

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) { }

  async execute(data: Partial<IPost>): Promise<IPost> {
    if (!data.title || !data.content || !data.author) {
      throw new Error('Title, content, and author are required');
    }
    return this.postRepository.create(data);
  }
}

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) { }

  async execute(id: string, data: Partial<IPost>, requesterId: string, requesterRole: string): Promise<IPost> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.toString() !== requesterId) {
      throw new Error('Access denied: Only the owner can update this post');
    }

    const updated = await this.postRepository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update post');
    }
    return updated;
  }
}

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) { }

  async execute(id: string, requesterId: string, requesterRole: string): Promise<boolean> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.author.toString() !== requesterId) {
      throw new Error('Access denied: Only the owner can delete this post');
    }

    return this.postRepository.delete(id);
  }
}

export class ListPostsUseCase {
  constructor(private postRepository: IPostRepository) { }

  async execute(page: number, limit: number): Promise<{ posts: any[]; total: number }> {
    return this.postRepository.findAll(page, limit);
  }
}
