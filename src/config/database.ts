import mongoose from 'mongoose';
import { seedAdmin } from './seed';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-notes';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await seedAdmin();
  } catch (error: any) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};
