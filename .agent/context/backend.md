# SmartGrade Backend Architecture Context

## Stack
- **Runtime Component:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma

## Core Philosophies (via ACP)
1. **Rule 14 (Security):** All API endpoints must be protected. Passwords hashed with bcrypt. Inputs validated before hitting controllers.
2. **Rule 13 (Antigravity Standard):** Controller logic must remain flat. Route handlers should delegate to Service layer functions. No deeply nested if-else structures. Use early returns and guard clauses.
3. **Rule 14 (API Design):** Structured `{ data, error, meta }` envelope for all responses. 
4. **Rule 20 (Fail-Fast):** Server MUST crash on startup if `DATABASE_URL` or `PORT` are missing from the environment.

## Directory Structure
```
server/
├── prisma/               # Schema and migrations
│   └── schema.prisma
├── src/
│   ├── app.js            # Express app configuration & middleware
│   ├── server.js         # Entry point (listens on PORT)
│   ├── routes/           # Express routers grouped by feature (auth, teacher, etc)
│   ├── controllers/      # Route handlers implementing the response envelope
│   ├── services/         # Business logic & Prisma DB operations
│   └── middleware/       # Auth validation, error handling
└── .env                  # Environment secrets (IGNORED BY GIT)
```

## Current State
- Project initialized. Prisma schema design pending.
