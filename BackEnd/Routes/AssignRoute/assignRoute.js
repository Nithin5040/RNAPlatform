import express from "express"
import {fetchAssignDpdwn,insertAssigneRoutesForDriver} from "../../Controllers/AssignRoute/AssignController.js"

const router = express.Router()


router.post("/fecthAssignDpdwn", fetchAssignDpdwn)
router.post("/insertAssigndriver", insertAssigneRoutesForDriver)






export default router