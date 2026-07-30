import { zoneDrpDwn,assignRoutescount,assignRootFetchbasedonZoneMaster,substationCountBasedonAssignedRoot } from "../../Controllers/ZoneRouteStationStatus/zone.js";
import express from "express";
const router=express.Router();


router.post("/zoneDrpDwn",zoneDrpDwn);
router.post("/assignRoutecount",assignRoutescount);
router.post("/assignRootFetchbasedonZoneMaster",assignRootFetchbasedonZoneMaster)

router.post("/substationCountBasedonAssignedRoot",substationCountBasedonAssignedRoot)


export default router;