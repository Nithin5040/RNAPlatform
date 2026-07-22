import { fecthFileTypeDropdwn,insertDriverDetail } from '../../Models/DriverCreation/driverCreations.js'
import fs from "fs"
import bcrypt from "bcrypt" 

export const fetchDropdown = async (req, res) => {
    const { flagId } = req.body
    try {
        let result

        if (parseInt(flagId) === 1) {
            result = await fecthFileTypeDropdwn()
        } else {
            return res.status(404).json({ status: false, message: "Flagid is Requireed" })
        }

        return res.status(200).json({ status: false, message: "Dropdown Fetched Successfully", result })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}


export const internalDriverDetails = async (req, res) => {

    const {
        flagId,
        DriverName,
        MobileNumber,
        TruckNumber,
        Password,
        CreatedByUserId,
        FileTypeIds,
        OdometerReading
    } = req.body;

    try {

        //==========================================
        // Flag Validation
        //==========================================

        if (parseInt(flagId) !== 1) {
            return res.status(400).json({
                status: false,
                message: "Invalid FlagId."
            });
        }

        //==========================================
        // Driver Name Validation
        //==========================================

        if (!DriverName || !DriverName.trim()) {
            return res.status(400).json({
                status: false,
                message: "Driver Name is required."
            });
        }

        //==========================================
        // Mobile Validation
        //==========================================

        if (!MobileNumber || !MobileNumber.trim()) {
            return res.status(400).json({
                status: false,
                message: "Mobile Number is required."
            });
        }

        //==========================================
        // CreatedByUserId Validation
        //==========================================

        if (!CreatedByUserId) {
            return res.status(400).json({
                status: false,
                message: "CreatedByUserId is required."
            });
        }

        //==========================================
        // File Validation
        //==========================================

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Please upload at least one file."
            });
        }

        //==========================================
        // FileTypeIds Validation
        //==========================================

        if (!FileTypeIds) {
            return res.status(400).json({
                status: false,
                message: "FileTypeIds are required."
            });
        }

        let parsedFileTypeIds;

        try {

            parsedFileTypeIds = JSON.parse(FileTypeIds);

        } catch {

            return res.status(400).json({
                status: false,
                message: "Invalid FileTypeIds format."
            });

        }

        if (parsedFileTypeIds.length !== req.files.length) {

            return res.status(400).json({
                status: false,
                message: "Files count and FileTypeIds count should be same."
            });

        }

        const hashedPassword = Password
            ? await bcrypt.hash(Password.trim(), 10)
            : null;


        //==========================================
        // Call Model
        //==========================================

        const result = await insertDriverDetail({

            DriverName: DriverName.trim(),
            MobileNumber: MobileNumber.trim(),
            TruckNumber: TruckNumber?.trim() || null,
            Password: hashedPassword,
            CreatedByUserId,

            FileTypeIds: parsedFileTypeIds,

            Files: req.files,
            OdometerReading

        });

        return res.status(200).json({

            status: true,
            message: "Driver Details inserted successfully."
            // result

        });

    }
    catch (error) {

        // Delete uploaded files

        if (req.files && req.files.length > 0) {

            req.files.forEach(file => {

                if (fs.existsSync(file.path)) {

                    fs.unlinkSync(file.path);

                }

            });

        }

        return res.status(500).json({

            status: false,
            message: error.message

        });

    }

};