const { Pool } = require("pg");
require("dotenv").config();

// If DATABASE_URL is provided (e.g. Neon or Heroku), use it with SSL enabled.
// Otherwise connect to a local Postgres instance using individual params.
if (process.env.DATABASE_URL) {
  const connectionString = process.env.DATABASE_URL;
  module.exports = new Pool({
    connectionString,
    // Hosted providers may require SSL; allow the certificate.
    ssl: { rejectUnauthorized: false },
  });
} else {
  module.exports = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'youtube',
    port: 5432
  });
}