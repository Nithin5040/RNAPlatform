import express from "express"
import { fetchAssignDpdwn, insertAssigneRoutesForDriver, fetchAssignRouteDetails, submitStationDetail } from "../../Controllers/AssignRoute/AssignController.js"
import { stationUpload } from "../../Middlewares/StationDetails/stationdetail.js"

const router = express.Router()


router.post("/fecthAssignDpdwn", fetchAssignDpdwn)
router.post("/insertAssigndriver", insertAssigneRoutesForDriver)



//this are the mobile apis========================================
//this is the fecthing the driver details when the driver login ok 

router.post("/fetchAssignRouteDetails", fetchAssignRouteDetails)

router.post("/submitStationDetail", stationUpload.array("files", 20), submitStationDetail)
// ==================================================================







export default router