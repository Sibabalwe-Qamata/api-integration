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
                    social_data JSONB);
    CREATE INDEX IF NOT EXISTS idx_posts_crawled ON posts (crawled);