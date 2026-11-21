import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

export const securityHeaders = helmet();

export const corsPolicy = cors({
  origin: (origin, cb) => {
    // No Origin header = non-browser client (curl, server-to-server); allowed
    if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  maxAge: 600,
});

const limiterOptions = { standardHeaders: 'draft-7' as const, legacyHeaders: false };

export const apiLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: { error: 'Too many requests, please try again later' },
});

// Stricter limit for requests that change data
export const writeLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 120,
  skip: (req) => req.method === 'GET' || req.method === 'OPTIONS',
  message: { error: 'Too many changes, please slow down' },
});
