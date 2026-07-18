import XLSX from "xlsx";
import fs from "fs";
//import { pool } from "../Config/DbConfig.js";
import { insertXl } from "../../Models/Upload/Xlupload.js"

export const uploadExcel = async (req, res) => {

    try {

        const workbook = XLSX.readFile(req.file.path);

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: [
                "ZoneName",
                "ZoneCode",
                "CircleName",
                "CircleCode",
                "DivisionName",
                "DivisionCode",
                "DistrictName",
                "DistrictCode",
                "VoltageClass",
                "Taluk",
                "TalukCode",
                "StationName",
                "StationNameCode",
                "InChargeAEJEName",
                "ContactNumber",
                "SubStationAddressWithPincode",
                "Pincode"
            ],
            range: 1
        });

        console.log(rows);
        await insertXl(rows)

        res.status(200).json({ status: true, message: "XL Data Inserted Successfully" })

    } catch (err) {

        console.log(err);

        res.status(500).json({ status: false, message: "Internal Server Error", error: err.message, stack: err.stack });

    }
};