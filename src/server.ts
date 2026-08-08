import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
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

app.use('/api-docs', swaggerRouter);


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/posts', postRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});


app.get('/', (req: Request, res: Response) => {
  res.send('Secure Note-Taking API is running. Documentation is available at /api-docs');
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
