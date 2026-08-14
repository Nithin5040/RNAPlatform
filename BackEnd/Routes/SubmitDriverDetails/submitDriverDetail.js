
import express from "express"
import { fetchDriverSubmittedDetails, fetchDriverDetailDropdwon } from "../../Controllers/SubmittedDriverDetail/submittedDriverDetail.js"

const router = express.Router()

router.post("/fetchDriverSubmittedDetails", fetchDriverSubmittedDetails)
router.post("/fetchDriverDetailDropdwon", fetchDriverDetailDropdwon)
router.post("/fetchDriverSubmittedDpdn", fetchDriverDetailDropdwon)

export default router
