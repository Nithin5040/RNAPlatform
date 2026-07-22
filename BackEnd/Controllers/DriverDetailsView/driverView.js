import { viewDriverFiles } from "../../Models/DriverDetailsView/view.js";

//,viewFCPhoto,viewOdometerReading,viewPermitFilePhoto,viewRCPhoto,viewTruckPhoto,viewDriverAadhar,

import fs from "fs";
import path from "path";
//import { streamFileAndDelete } from "../../helpers/PdfHelper/PdfHelper.js";


export const ViewDriverPhoto = async (req, res) => {
    const { fileTypeId,DriverDetailId } = req.body;

    try {
        if (!fileTypeId) {
            return res.status(400).json({
                status: false,
                message: "fileTypeId is required"
            });
        }

        const files = await viewDriverFiles(fileTypeId,DriverDetailId);

        if (!files.length) {
            return res.status(404).json({
                status: false,
                message: "File not found"
            });
        }

        const { FilePath, FileTypeName } = files[0];

        if (!FilePath) {
            return res.status(404).json({
                status: false,
                message: "File path not available"
            });
        }

        const absolutePath = path.resolve(FilePath.trim());

        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({
                status: false,
                message: "File does not exist on server"
                
            });
        }

        const ext = path.extname(absolutePath).toLowerCase();

        // If image
        if ([".jpg", ".jpeg", ".png"].includes(ext)) {

            const contentType =
                ext === ".png"
                    ? "image/png"
                    : "image/jpeg";

            res.setHeader("Content-Type", contentType);

            res.setHeader(
                "Content-Disposition",
                `inline; filename="${FileTypeName}${ext}"`
            );

            return fs.createReadStream(absolutePath).pipe(res);
        }

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
            
        });
    }
};