import mongoose from 'mongoose';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUser } from '../domain/entities/User';
import UserModel from '../models/User';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    const existing = await UserModel.findById(id);
    if (!existing) return null;
    
    if (user.username !== undefined) existing.username = user.username;
    if (user.email !== undefined) existing.email = user.email;
    if (user.password !== undefined) existing.password = user.password;
    if (user.role !== undefined) existing.role = user.role;
    if (user.interests !== undefined) existing.interests = user.interests;
    
    const saved = await existing.save();
    return saved;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async list(page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const users = await UserModel.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await UserModel.countDocuments();
    return { users, total };
  }

  async groupByInterests(): Promise<any[]> {
    return UserModel.aggregate([
      { $unwind: '$interests' },
      {
        $group: {
          _id: '$interests',
          users: {
            $push: {
              _id: '$_id',
              username: '$username',
              email: '$email',
              role: '$role'
            }
          }
        }
      }
    ]);
  }

  async getUserPosts(userId: string): Promise<any> {
    const result = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $lookup: {
          from: 'notes',
          localField: '_id',
          foreignField: 'owner',
          as: 'notes'
        }
      },
      {
        $project: {
          password: 0
        }
      }
    ]);
    return result.length > 0 ? result[0] : null;
  }
}
