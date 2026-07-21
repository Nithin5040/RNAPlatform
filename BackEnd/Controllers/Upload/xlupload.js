import XLSX from "xlsx";
import fs from "fs";
//import { pool } from "../Config/DbConfig.js";
import { insertXl, fetchZoneMaster, fecthRoutes } from "../../Models/Upload/Xlupload.js"

export const uploadExcel = async (req, res) => {

    const {
        ZoneMasterId,
        RoutePlanId,
        CreatedByUserId
    } = req.body;

    try {

        //====================================
        // File Validation
        //====================================

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Excel file is required."
            });
        }

        //====================================
        // Body Validation
        //====================================

        if (!ZoneMasterId) {
            return res.status(400).json({
                status: false,
                message: "ZoneMasterId is required."
            });
        }

        if (!RoutePlanId) {
            return res.status(400).json({
                status: false,
                message: "RoutePlanId is required."
            });
        }

        if (!CreatedByUserId) {
            return res.status(400).json({
                status: false,
                message: "CreatedByUserId is required."
            });
        }

        //====================================
        // Read Excel
        //====================================

        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {

            header: [
                "SlNo",
                "Taluk",
                "Station",
                "VoltageClass",
                "InChangreAEJEname",
                "ContactNumber",
                "SubStationAddress",
                "PinCode",
                "LatitudeLongitude"
            ],

            range: 1,
            defval: ""

        });

        if (rows.length === 0) {

            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                status: false,
                message: "Uploaded Excel is empty."
            });

        }

        //====================================
        // Call Model
        //====================================

        const result = await insertXl({

            ZoneMasterId,
            RoutePlanId,
            CreatedByUserId,

            ExcelFileName: req.file.originalname,
            ExcelFilePath: req.file.path,

            rows

        });

        return res.status(200).json({
            status: true,
            message: "Excel uploaded successfully.",
            result
        });

    }
    catch (error) {

        // Delete uploaded file if processing fails
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }

};


export const MasterRouteDropdown = async (req, res) => {
    const { flagId, ZoneMasterId } = req.body
    try {
        let result

        if (parseInt(flagId) === 1) {
            result = await fetchZoneMaster()
        } else if (parseInt(flagId) === 2) {
            result = await fecthRoutes(ZoneMasterId)
        } else {
            return res.status(404).json({ status: false, message: "FlagId Is Required" })
        }
        return res.status(200).json({ status: false, Message: "The Dropdown Fetched successfully.", result })
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}