import express from "express";
const router = express.Router();
import { Driverlogin } from "../../Controllers/DriverCreation/driverlogin.js"


router.post("/login", Driverlogin);


export default router