import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: any;
    role: string;
    email: string;
    username: string;
    interests?: string[];
  };
}
