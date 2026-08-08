import jwt from 'jsonwebtoken';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUser } from '../domain/entities/User';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(data: Partial<IUser>): Promise<{ user: IUser; token: string }> {
    if (!data.email || !data.password || !data.username) {
      throw new Error('Username, email and password are required');
    }

    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    const user = await this.userRepository.create(data);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'super_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any
    );

    return { user, token };
  }
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) { }

  async execute(email: string, password: string): Promise<{ user: IUser; token: string }> {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'super_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as any
    );

    return { user, token };
  }
}
