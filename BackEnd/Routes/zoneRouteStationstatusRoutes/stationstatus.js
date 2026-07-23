import { zoneDrpDwn,assignRouteStatuscount } from "../../Controllers/ZoneRouteStationStatus/zone.js";
import express from "express";
const router=express.Router();


router.post("/zoneDrpDwn",zoneDrpDwn);
router.post("/assignRouteStatuscount",assignRouteStatuscount)

export default router;