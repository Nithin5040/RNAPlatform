import express from "express";
import { upload } from "../../Middlewares/PdfMiddleWare/upload.js";
import { uploadExcel, MasterRouteDropdown } from "../../Controllers/Upload/xlupload.js";

const router = express.Router();


router.post("/Upload",upload.array("excelSheet"),uploadExcel);
router.post("/masterDropdwn", MasterRouteDropdown);



export default router;