import express from "express";
const router=express.Router();

import { FetchDriverDetails } from "../../Controllers/DriverDetailsFetch/driverdetailFetch.js";

router.post("/FetchDriverDetails",FetchDriverDetails)

export default router;