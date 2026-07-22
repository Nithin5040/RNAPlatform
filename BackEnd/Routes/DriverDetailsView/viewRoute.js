import express from "express";
import { ViewDriverPhoto } from "../../Controllers/DriverDetailsView/driverView.js";
import { FetchDriverDetails } from "../../Controllers/DriverDetailsFetch/driverdetailFetch.js";
const router=express.Router();
router.post("/ViewDriverDetails",ViewDriverPhoto);


export default router;