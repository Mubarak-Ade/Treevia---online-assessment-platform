import { env } from './src/config/env.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/shared/db/schema/*.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});
