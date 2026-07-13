const pool = require("../db");

async function runMigrations() {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                video_url TEXT NOT NULL,
                thumbnail_url TEXT,
                duration_seconds INTEGER,
                views INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'processing',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                type VARCHAR(50) NOT NULL,
                payload JSONB NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW(),
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                error TEXT,
                attempts INTEGER DEFAULT 0,
                max_attempts INTEGER DEFAULT 3
            );
        `);

    await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            video_id INTEGER NOT NULL REFERENCES videos(id),
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );`);

    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
    );

    await pool.query(
      `ALTER TABLE videos ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;`,
    );

    await pool.query(
      `ALTER TABLE videos ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);`,
    );

    await pool.query(
      `ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);`,
    );

    console.log("Migrations completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

module.exports = runMigrations;
