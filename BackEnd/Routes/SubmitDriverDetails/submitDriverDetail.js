
import express from "express"
import { fetchDriverSubmittedDetails } from "../../Controllers/SubmittedDriverDetail/submittedDriverDetail.js"

const router = express.Router()

router.post("/fetchDriverSubmittedDetails", fetchDriverSubmittedDetails)
router.post("/fetchDriverDetailDropdwon", fetchDriverSubmittedDetails)
router.post("/fetchDriverSubmittedDpdn", fetchDriverSubmittedDetails)

export default router