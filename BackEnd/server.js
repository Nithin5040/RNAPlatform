import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./Config/DbConfig.js";
import applyRoutes from "./Routes/AllRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

await connectDb();

applyRoutes(app);

export default app;