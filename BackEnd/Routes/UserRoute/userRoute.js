import express from "express"
import {userCreationDropDown, insertUserCreation} from "../../Controllers/User/userCreation.js"

export const router = express.Router()


router.post("/userdpdwn",  userCreationDropDown)

router.post("/createUser", insertUserCreation)


export default router
