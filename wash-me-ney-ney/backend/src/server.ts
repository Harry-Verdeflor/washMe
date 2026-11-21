import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(env.PORT, () => console.log(`API running on http://localhost:${env.PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
