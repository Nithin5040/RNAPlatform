
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { pool } from "../../Config/DbConfig.js";

import { fecthDriverSubmittedDetail, fetchDriverSubmittedStationDetail, fetchFileView } from "../../Models/SubmittedDriverDetail/submittedDriverDetail.js"


export const fetchDriverSubmittedDetails = async (req, res) => {

    const {
        flagId,
        AssignRouteId,
        stationSubmissionFileId,
        FileTypeId
    } = req.body;

    try {

        let result;

        if (parseInt(flagId) === 1) {

            result = await fecthDriverSubmittedDetail();

            return res.status(200).json({
                status: true,
                message: "The Details Fetched Successfully.",
                count: result.length,
                result
            });

        }
        else if (parseInt(flagId) === 2) {

            result = await fetchDriverSubmittedStationDetail(AssignRouteId);

            return res.status(200).json({
                status: true,
                message: "The Details Fetched Successfully.",
                count: result.length,
                result
            });

        }
        else if (parseInt(flagId) === 3) {

            if (!stationSubmissionFileId) {
                return res.status(400).json({
                    status: false,
                    message: "stationSubmissionFileId is required."
                });
            }

            if (!FileTypeId) {
                return res.status(400).json({
                    status: false,
                    message: "FileTypeId is required."
                });
            }

            result = await fetchFileView(
                stationSubmissionFileId,
                FileTypeId
            );

            if (!result) {
                return res.status(404).json({
                    status: false,
                    message: "File not found."
                });
            }

            if (!fs.existsSync(result.FilePath)) {
                return res.status(404).json({
                    status: false,
                    message: "Physical file not found."
                });
            }

            const contentType =
                mime.lookup(path.extname(result.FilePath)) ||
                "application/octet-stream";

            res.setHeader("Content-Type", contentType);

            const stream = fs.createReadStream(result.FilePath);

            return stream.pipe(res);

        }
        else {

            return res.status(404).json({
                status: false,
                message: "FlagId is Required"
            });

        }

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: "Internal Server Error.",
            error: error.message
        });

    }

};

export const fetchDriverDetailDropdwon = async (req, res) => {
    try {
        const { flagId, ZoneMasterId } = req.body;
        // Flag 1: Fetch Zone Dropdown
        if (parseInt(flagId) === 1) {
            const query = `
                SELECT "ZoneMasterId", "ZoneMasterName" 
                FROM "LKP"."ZoneMaster" 
                WHERE "IsDisabled" = false OR "IsDisabled" IS NULL 
                ORDER BY "ZoneMasterId" ASC;
            `;
            const { rows } = await pool.query(query);
            return res.status(200).json({
                status: true,
                message: "The DropDown Fetched Successfully.",
                result: rows
            });
        }
        // Flag 2: Fetch Route Plans Dropdown for selected Zone
        else if (parseInt(flagId) === 2) {
            const query = `
                SELECT "RoutePlanId", "RoutePlanPoint" 
                FROM "DATA"."RoutePlan" 
                WHERE "ZoneMasterId" = $1 AND ("IsDisabled" = false OR "IsDisabled" IS NULL) 
                ORDER BY "RoutePlanId" ASC;
            `;
            const { rows } = await pool.query(query, [parseInt(ZoneMasterId)]);
            return res.status(200).json({
                status: true,
                message: "The DropDown Fetched Successfully.",
                result: rows
            });
        }
        // Flag 3: Fetch Drivers Dropdown
        else if (parseInt(flagId) === 3) {
            const query = `
                SELECT "DriverDetailId", "DriverName", "MobileNumber", "TruckNumber" 
                FROM "DATA"."DriverDetail" 
                WHERE ("IsDisabled" = false OR "IsDisabled" IS NULL) 
                ORDER BY "DriverName" ASC;
            `;
            const { rows } = await pool.query(query);
            return res.status(200).json({
                status: true,
                message: "The DropDown Fetched Successfully.",
                result: rows
            });
        }
        else {
            return res.status(400).json({
                status: false,
                message: "Valid flagId is required."
            });
        }
    } catch (error) {
        console.error("Error in fetchDriverDetailDropdwon:", error);
        return res.status(500).json({
            status: false,
            message: error.message || "Internal Server Error"
        });
    }
};