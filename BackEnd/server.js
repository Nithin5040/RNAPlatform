import express from "express";
const app = express();
import cors from "cors"
import { connectDb } from "./Config/DbConfig.js";
import applyRoutes from "./Routes/AllRoutes.js"
import dotenv from "dotenv";
import { json } from "body-parser";
dotenv.config();

app.use(express.json())

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Disposition", "content-type"],
  credentials: true
}));


applyRoutes(app);


app.listen(process.env.PORT, async () => {
  await connectDb()
  console.log(`server is running on port ${process.env.PORT}.....`);
})
