import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./Config/DbConfig.js";
import applyRoutes from "./Routes/AllRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL, // Set this in Vercel dashboard to your frontend domain
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

try {
  await connectDb();
} catch (err) {
  console.error("DB connection failed at startup:", err.message);
  // Don't crash the function — individual requests will fail gracefully
}

applyRoutes(app);

export default app;