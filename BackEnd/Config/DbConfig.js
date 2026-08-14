import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const connectionString = process.env.DATABASE_URL;

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      host: process.env.DB_HOST || "aws-0-ap-northeast-1.pooler.supabase.com",
      user: process.env.DB_USER || "postgres.kcwpqnfkniilyoqxtnrw",
      password: process.env.DB_PASSWORD || "Nithin@9190",
      database: process.env.DB_DATABASE || "postgres",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 6543,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };

const pool = new Pool(poolConfig);

// Function to test DB connection
const connectDb = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected Successfully to Supabase');
    client.release(); 
  } catch (error) {
    console.error('PostgreSQL Connection Failed:', error.message);
    process.exit(1); // Render will auto-restart the service
  }
};

export { pool, connectDb };
