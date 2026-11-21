import express from 'express';
import routes from './routes';
import { securityHeaders, corsPolicy, apiLimiter, writeLimiter } from './middleware/security';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

app.use(securityHeaders);
app.use(corsPolicy);
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiLimiter, writeLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
