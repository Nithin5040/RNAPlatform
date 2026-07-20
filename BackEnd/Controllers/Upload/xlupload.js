import XLSX from "xlsx";
import { insertXl } from "../../Models/Upload/Xlupload.js";

export const uploadExcel = async (req, res) => {
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Please upload at least one Excel file."
            });
        }

        const allRows = [];

        for (const file of req.files) {

            const workbook = XLSX.readFile(file.path);

            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(worksheet, {
                header: [
                    "SLNo",
                    "ZoneName",
                    "ZoneCode",
                    "CircleName",
                    "CircleCode",
                    "DivisionName",
                    "DivisionCode",
                    "StationName",
                    "StationNameCode",
                    "VoltageClass",
                    "Taluk",
                    "TalukCode",
                    "DistrictName",
                    "DistrictCode",
                    "InChargeAEJEName",
                    "ContactNumber",
                    "Pincode",
                    "SubStationAddressWithPincode"
                ],
                range: 1
            });

            //ignoring the Sl Number Field
            const data = rows.filter(row => row.SLNo !== "SLNo");

            allRows.push(...data);
        }

        console.log("Total Files :", req.files.length);
        console.log("Total Rows :", allRows.length);

        await insertXl(allRows);

        return res.status(200).json({
            status: true,
            message: "XL Data Inserted Successfully",
            totalFiles: req.files.length,
            totalRows: allRows.length
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: err.message
        });

    }
};