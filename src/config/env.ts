import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: Number(process.env.DB_PORT),
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_DATABASE: process.env.DB_DATABASE!,
    WEBZ_API_KEY: process.env.WEBZ_API_KEY!,
    WEBZ_BASE_URL: process.env.WEBZ_API_URL!,
    FETCH_QUERY: process.env.FETCH_QUERY, // future: dynamic
    REQUEST_TIMEOUT_MS: 5000,
};
