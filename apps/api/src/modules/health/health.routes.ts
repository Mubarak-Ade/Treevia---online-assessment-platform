import { Router } from 'express';
import type { HealthResponse } from '@treevia/shared';
import { pool } from '../../db/pool.js';

export const healthRouter = Router();

healthRouter.get('/', async (_request, response) => {
  let database: HealthResponse['database'] = 'connected';

  try {
    await pool.query('SELECT 1');
  } catch {
    database = 'unavailable';
  }

  const payload: HealthResponse = {
    status: 'ok',
    database,
    timestamp: new Date().toISOString(),
  };

  response.status(database === 'connected' ? 200 : 503).json(payload);
});
