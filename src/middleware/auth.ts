import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';
import UserModel from '../models/User';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret') as { id: string; role: string };

    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User no longer exists' });
      return;
    }

    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email,
      username: user.username,
      interests: user.interests
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired' });
      return;
    }
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
    return;
  }
  next();
};
