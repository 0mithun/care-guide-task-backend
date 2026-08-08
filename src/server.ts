import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import noteRoutes from './routes/noteRoutes';
import postRoutes from './routes/postRoutes';
import swaggerRouter from './config/swagger';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api-docs', swaggerRouter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/posts', postRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Secure Note-Taking API is running');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

export default app;