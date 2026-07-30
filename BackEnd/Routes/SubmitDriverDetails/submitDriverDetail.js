
import express from "express"
import { fetchDriverSubmittedDetails } from "../../Controllers/SubmittedDriverDetail/submittedDriverDetail.js"

const router = express.Router()

router.post("/fetchDriverSubmittedDetails", fetchDriverSubmittedDetails)

export default router