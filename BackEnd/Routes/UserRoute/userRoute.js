import express from "express"
import {userCreationDropDown} from "../../Controllers/User/userCreation.js"

export const router = express.Router()


router.post("/userdpdwn",  userCreationDropDown)


export default router
