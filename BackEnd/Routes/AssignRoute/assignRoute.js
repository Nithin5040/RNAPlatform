import express from "express"
import {fetchAssignDpdwn,insertAssigneRoutesForDriver, fetchAssignRouteDetails} from "../../Controllers/AssignRoute/AssignController.js"

const router = express.Router()


router.post("/fecthAssignDpdwn", fetchAssignDpdwn)
router.post("/insertAssigndriver", insertAssigneRoutesForDriver)


//this is the fecthing the driver details when the driver login ok 

router.post("/fetchAssignRouteDetails", fetchAssignRouteDetails)







export default router