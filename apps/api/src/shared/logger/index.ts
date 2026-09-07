import morgan from 'morgan';
import { env } from '../../config/env.js';

/**
 * Morgan HTTP request logging middleware configured based on environment.
 * Uses 'combined' in production for Apache-style standard logs, and 'dev' in development for concise, colorized logs.
 */
export const httpLogger = morgan(env.isProduction ? 'combined' : 'dev');

export { morgan };
