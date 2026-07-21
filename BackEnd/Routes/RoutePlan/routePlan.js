

import express from "express"
import {inserRoutePlan,fetchRoutePlan,updateRoutePlan, RoutePlanDropdown} from "../../Controllers/InsertRoutePlan/inserRoutePlan.js"
const router = express.Router()


router.post("/insertRoutePlan", inserRoutePlan)
router.post("/fetchRoutePlan", fetchRoutePlan)
router.post("/updateRoutePlan", updateRoutePlan)
router.post("/routePlanDropdown", RoutePlanDropdown)









export default router