import { Pool } from 'pg';
import { env } from '../config/env';

export class PostgresService {
    private pool = new Pool({
        host: env.DB_HOST,
        port: Number(env.DB_PORT || '5432'),
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        ssl: {
            rejectUnauthorized: false // Required for Render PostgreSQL connections
        },
        // Connection timeout and retry settings for better reliability
        connectionTimeoutMillis: 10000,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000
    });

    async testConnection(): Promise<boolean> {
        const client = await this.pool.connect();
        try {
            await client.query('SELECT NOW()');
            console.log('Successfully connected to the database');
            return true;
        } catch (error) {
            console.error('Database connection error:', error);
            return false;
        } finally {
            client.release();
        }
    }

    async createPostsTable(): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS posts (
                    uuid VARCHAR(255) PRIMARY KEY,
                    url TEXT,
                    title TEXT,
                    author TEXT,
                    published TIMESTAMP WITH TIME ZONE,
                    text TEXT,
                    language VARCHAR(50),
                    sentiment VARCHAR(50),
                    categories TEXT[],
                    crawled TIMESTAMP WITH TIME ZONE,
                    updated TIMESTAMP WITH TIME ZONE,
                    thread_data JSONB,
                    entities JSONB,
                    social_data JSONB
                )
            `);
            console.log('Posts table created or already exists');
        } catch (error) {
            console.error('Error creating posts table:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async savePosts(posts: any[]): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
           
            for (const post of posts) {
                await client.query(`
                    INSERT INTO posts (
                        uuid, url, title, author, published, text,
                        language, sentiment, categories, crawled, updated,
                        thread_data, entities, social_data
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                    ON CONFLICT (uuid) DO UPDATE SET
                        url = EXCLUDED.url,
                        title = EXCLUDED.title,
                        author = EXCLUDED.author,
                        published = EXCLUDED.published,
                        text = EXCLUDED.text,
                        language = EXCLUDED.language,
                        sentiment = EXCLUDED.sentiment,
                        categories = EXCLUDED.categories,
                        crawled = EXCLUDED.crawled,
                        updated = EXCLUDED.updated,
                        thread_data = EXCLUDED.thread_data,
                        entities = EXCLUDED.entities,
                        social_data = EXCLUDED.social_data
                `, [
                    post.uuid,
                    post.url,
                    post.title,
                    post.author,
                    post.published,
                    post.text,
                    post.language,
                    post.sentiment,
                    post.categories,
                    post.crawled,
                    post.updated,
                    post.thread || post.thread_data, // Handle both naming conventions
                    post.entities,
                    post.social || post.social_data  // Handle both naming conventions
                ]);
            }
           
            await client.query('COMMIT');
            console.log(`Successfully saved ${posts.length} posts`);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error saving posts:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    async close() {
        await this.pool.end();
        console.log('Database connection pool closed');
    }
}