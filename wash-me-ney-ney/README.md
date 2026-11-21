# Wash Me Ney Ney 🫧

Laundry shop management app: React + Vite frontend with an Express + MongoDB (TypeScript) backend.

```
wash-me-ney-ney/
├── package.json            convenience scripts (install:all, dev:backend, ...)
├── frontend/               React + Vite app
│   ├── public/brand/       logo + BRAND-COLORS.md
│   └── src/
│       ├── components/     Badge, Empty, Modal, Field
│       ├── constants/      statuses, navigation
│       ├── services/       API client
│       ├── styles/         main.css
│       ├── utils/          formatting helpers
│       └── App.jsx, main.jsx
└── backend/                Express + MongoDB API
    └── src/
        ├── config/         env parsing/validation, database connection
        ├── models/         Mongoose models (Customer, Service, Order)
        ├── validators/     zod schemas for request params/bodies
        ├── middleware/     validate, security (helmet/CORS/rate limits), error handling
        ├── controllers/    request handlers (CRUD logic)
        ├── routes/         URL routes (validation + controller wiring)
        ├── scripts/        seed.ts sample data
        ├── app.ts          Express app setup
        └── server.ts       entry point (DB connect + listen)
```

## Quick start

You need Node.js 20+ and a running MongoDB (local or Atlas).

```bash
npm run install:all
cp backend/.env.example backend/.env      # adjust MONGODB_URI / CORS_ORIGIN if needed
cp frontend/.env.example frontend/.env    # VITE_API_URL (default http://localhost:4000/api)
npm run dev:backend      # http://localhost:4000
npm run dev:frontend     # http://localhost:5173 (second terminal)
```

Optional sample data: `npm run seed` (use `npm run seed -- --reset` to replace existing data).

## API (all under `/api`; health check at `/health`)

| Resource | Routes |
|---|---|
| customers | `GET/POST /customers`, `GET/PUT/DELETE /customers/:id` |
| services | `GET/POST /services`, `GET/PUT/DELETE /services/:id` |
| orders | `GET/POST /orders`, `GET/PUT/DELETE /orders/:id` |

- Order codes (`WMNN-1001`, ...), dates and the per-kg price are set by the server.
- Customers and services used by orders cannot be deleted.

## Backend security & validation

- Every `:id` must be a valid ObjectId; request bodies are validated with zod (types, lengths, ranges, enums). Unknown fields are rejected.
- `helmet` security headers, CORS restricted to `CORS_ORIGIN`, 10 KB body limit.
- Rate limiting: 500 requests / 15 min per IP, and 120 write requests / 15 min.
- Mongoose `sanitizeFilter` against NoSQL operator injection; errors never leak internals.
- Environment variables are validated at startup.

## Limitations

No authentication or payment processing; anyone allowed by CORS/rate limits can use the API. Add auth before exposing it publicly.
