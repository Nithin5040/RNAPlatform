import express from "express"
import {login} from "../../Controllers/User/login.js"
const router = express.Router()


router.post("/", login)



export default router