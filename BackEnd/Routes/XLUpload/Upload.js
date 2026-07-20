import express from "express";
import { upload } from "../../Middlewares/PdfMiddleWare/upload.js";
import { uploadExcel } from "../../Controllers/Upload/xlupload.js";

const router = express.Router();

router.post("/Upload",upload.single("excel"),uploadExcel);

export default router;