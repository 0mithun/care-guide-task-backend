import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUser } from '../domain/entities/User';

export class GetProfileUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(userId: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.password = undefined;
    }
    return user;
  }
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    return this.userRepository.list(page, limit);
  }
}

export class GroupUsersByInterestsUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(): Promise<any[]> {
    return this.userRepository.groupByInterests();
  }
}

export class GetUserPostsUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(userId: string): Promise<any> {
    return this.userRepository.getUserPosts(userId);
  }
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: Partial<IUser>): Promise<IUser> {
    if (!data.email || !data.password || !data.username) {
      throw new Error('Username, email and password are required');
    }

    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    return this.userRepository.create(data);
  }
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(id: string, data: Partial<IUser>): Promise<IUser | null> {
    if (data.username) {
      const otherUser = await this.userRepository.findByUsername(data.username);
      if (otherUser && otherUser._id?.toString() !== id) {
        throw new Error('Username is already taken');
      }
    }

    if (data.email) {
      const otherUser = await this.userRepository.findByEmail(data.email);
      if (otherUser && otherUser._id?.toString() !== id) {
        throw new Error('Email is already taken');
      }
    }

    return this.userRepository.update(id, data);
  }
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
