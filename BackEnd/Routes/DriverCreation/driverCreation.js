import express from "express"
import { fetchDropdown, internalDriverDetails} from "../../Controllers/DriverCreation/driverCreation.js"
import {uploadDriverFiles} from "../../Middlewares/DriverDetails/drivermulterfile.js"
const router = express.Router()


router.post("/fetchDropdown", fetchDropdown)
router.post("/insertDriverDetails", uploadDriverFiles.array("files"), internalDriverDetails);











export default router