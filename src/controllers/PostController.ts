import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase, ListPostsUseCase } from '../use-cases/PostUseCases';

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private updatePostUseCase: UpdatePostUseCase,
    private deletePostUseCase: DeletePostUseCase,
    private listPostsUseCase: ListPostsUseCase
  ) {}

  async createPost(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const { title, content } = req.body;
      const post = await this.createPostUseCase.execute({
        title,
        content,
        author: req.user._id
      });
      res.status(201).json({ message: 'Post created successfully', post });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updatePost(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const id = req.params.id as string;
      const { title, content } = req.body;
      const post = await this.updatePostUseCase.execute(
        id,
        { title, content },
        req.user._id.toString(),
        req.user.role
      );
      res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePost(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const id = req.params.id as string;
      await this.deletePostUseCase.execute(
        id,
        req.user._id.toString(),
        req.user.role
      );
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async listPosts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await this.listPostsUseCase.execute(page, limit);
      res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
        totalPosts: result.total,
        posts: result.posts
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
