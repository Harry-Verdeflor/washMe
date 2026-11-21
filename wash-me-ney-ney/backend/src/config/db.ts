import mongoose from 'mongoose';
import { env } from './env';

// Strip query operators ($ne, $gt, ...) from user-supplied filters (NoSQL injection guard)
mongoose.set('sanitizeFilter', true);
mongoose.set('strictQuery', true);

export const connectDB = () => mongoose.connect(env.MONGODB_URI);
