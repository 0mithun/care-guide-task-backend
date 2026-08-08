import { Request, Response } from 'express';
import { RegisterUserUseCase, LoginUserUseCase } from '../use-cases/AuthUseCases';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role, interests } = req.body;
      const result = await this.registerUseCase.execute({
        username,
        email,
        password,
        role,
        interests
      });

      res.status(201).json({
        message: 'User registered successfully',
        token: result.token,
        user: {
          id: result.user._id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          interests: result.user.interests
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);

      res.status(200).json({
        message: 'Login successful',
        token: result.token,
        user: {
          id: result.user._id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          interests: result.user.interests
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
