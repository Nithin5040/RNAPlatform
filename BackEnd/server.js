import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./Config/DbConfig.js";
import applyRoutes from "./Routes/AllRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// Allow localhost, any *.vercel.app, *.onrender.com, or a custom domain via FRONTEND_URL env var
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

    const isLocalhost = origin.startsWith("http://localhost");
    const isVercel = origin.endsWith(".vercel.app");
    const isRender = origin.endsWith(".onrender.com");
    const isCustom = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;

    if (isLocalhost || isVercel || isRender || isCustom) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

applyRoutes(app);

// Render provides PORT automatically; fallback to 3000 for local dev
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDb();
  console.log(`Server is running on port ${PORT}`);
});