import { bool, cleanEnv, host, num, port, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ['development', 'test', 'production'],
        default: 'development',
    }),
    PORT: port({ default: 3001 }),
    DATABASE_URL: str({ docs: 'postgresql://user:pass@host:5432/db' }),
    WEB_ORIGIN: str({ default: 'http://localhost:5173' }),

    // Auth & JWT Configuration
    JWT_ACCESS_SECRET: str({
        default: 'dev_jwt_access_secret_change_in_production_32_chars_min',
    }),
    JWT_ACCESS_EXPIRES_IN: str({ default: '15m' }),
    REFRESH_TOKEN_EXPIRES_DAYS: num({ default: 7 }),
    COOKIE_SECRET: str({ default: 'dev_cookie_secret_change_in_production' }),

    // SMTP / Mail Configuration
    SMTP_HOST: str({ default: 'localhost' }),
    SMTP_PORT: port({ default: 587 }),
    SMTP_SECURE: bool({ default: false }),
    SMTP_USER: str({ default: '' }),
    SMTP_PASS: str({ default: '' }),
    EMAIL_FROM: str({ default: 'Treevia <noreply@treevia.local>' }),
});
