
import fs from "fs";
import path from "path";
import mime from "mime-types";

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