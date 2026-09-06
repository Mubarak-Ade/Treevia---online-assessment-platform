# Treevia

A pnpm-workspaces monorepo containing a React web app, a modular Express API, shared TypeScript contracts and validation, and a PostgreSQL development database.

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## Start development

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm install
pnpm run db:up
pnpm run dev
```

- Web: http://localhost:5173
- API: http://localhost:3001/health
- PostgreSQL: localhost:5432

Run `pnpm run db:down` to stop the database. Database contents persist in the Docker volume.

## Layout

```
apps/api        Express + PostgreSQL API
apps/web        React + Vite client
packages/shared Shared TypeScript contracts
packages/validation Shared Zod schemas
packages/config Shared runtime-neutral defaults
infra/postgres  Database initialization scripts
```
