import { UpdateDriverDetails } from "../../Controllers/DriverDetailsUpdate/driverdetailsUpadte.js";

import express from "express";
const router=express.Router();

router.post("/UpdateDriverDetails",UpdateDriverDetails)

export default router;