import express from "express"
import {login, userLoginDetails} from "../../Controllers/User/login.js"
const router = express.Router()


router.post("/", login)
//router.post("/userLoginDetails",  userLoginDetails)



export default router