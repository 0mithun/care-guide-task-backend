import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import {
  GetProfileUseCase,
  ListUsersUseCase,
  GroupUsersByInterestsUseCase,
  GetUserPostsUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase
} from '../use-cases/UserUseCases';

export class UserController {
  constructor(
    private getProfileUseCase: GetProfileUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private groupUsersByInterestsUseCase: GroupUsersByInterestsUseCase,
    private getUserPostsUseCase: GetUserPostsUseCase,
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const user = await this.getProfileUseCase.execute(req.user._id);
      if (!user) {
        res.status(404).json({ message: 'User profile not found' });
        return;
      }
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error retrieving profile', error: error.message });
    }
  }

  async listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await this.listUsersUseCase.execute(page, limit);
      res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
        totalUsers: result.total,
        users: result.users
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error listing users', error: error.message });
    }
  }

  async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, email, password, role, interests } = req.body;
      const user = await this.createUserUseCase.execute({
        username,
        email,
        password,
        role,
        interests
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          interests: user.interests
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, email, password, role, interests } = req.body;
      const user = await this.updateUserUseCase.execute(req.params.id as string, {
        username,
        email,
        password,
        role,
        interests
      });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          interests: user.interests
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const success = await this.deleteUserUseCase.execute(req.params.id as string);
      if (!success) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error deleting user', error: error.message });
    }
  }

  async groupByInterests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const groupedUsers = await this.groupUsersByInterestsUseCase.execute();
      res.status(200).json({ groupedUsers });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error grouping users', error: error.message });
    }
  }

  async getUserPosts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const userWithPosts = await this.getUserPostsUseCase.execute(req.params.id as string);
      if (!userWithPosts) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Privacy boundary check: Strip notes if requester is not admin AND not the owner
      if (req.user.role !== 'admin' && req.user._id.toString() !== (req.params.id as string)) {
        delete userWithPosts.notes;
      }

      res.status(200).json({ user: userWithPosts });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error fetching user posts', error: error.message });
    }
  }
}
