export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? process.env.API_PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL,
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
};
