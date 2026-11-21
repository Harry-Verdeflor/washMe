import { ErrorRequestHandler, RequestHandler } from 'express';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' });
};

// Express 5 forwards async errors here automatically
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Malformed JSON body' });
    return;
  }
  if (err.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request body too large' });
    return;
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }
  if (err.code === 11000) {
    res.status(409).json({ error: 'Duplicate value' });
    return;
  }
  if (err.message === 'Origin not allowed by CORS') {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }
  console.error(err); // never leak internals to the client
  res.status(500).json({ error: 'Something went wrong' });
};
