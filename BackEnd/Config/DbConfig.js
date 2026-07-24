import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Required for Supabase pooler
  max: 5,                              // Keep low for serverless
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

// Function to test DB connection
const connectDb = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected Successfully');
    client.release(); 
  } catch (error) {
    console.error('PostgreSQL Connection Failed:', error.message);
    throw error; // Let the caller handle it — never call process.exit() in serverless
  }
};

export { pool, connectDb };
