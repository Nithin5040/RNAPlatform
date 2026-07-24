import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./Config/DbConfig.js";
import applyRoutes from "./Routes/AllRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// Dynamically allow localhost, any Vercel deployment, or a custom domain via env var
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const isLocalhost = origin.startsWith("http://localhost");
    const isVercel = origin.endsWith(".vercel.app");
    const isCustom = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;

    if (isLocalhost || isVercel || isCustom) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
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