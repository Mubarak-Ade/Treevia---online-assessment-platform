// Single source of truth for auth validation schemas is @treevia/validation.
// This file re-exports them so the rest of the API can import from a local path.
export { registerSchema, loginSchema, refreshTokenSchema } from '@treevia/validation';
export type { RegisterInput, LoginInput } from '@treevia/validation';
