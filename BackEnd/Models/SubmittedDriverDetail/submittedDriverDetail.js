import { pool } from "../../Config/DbConfig.js"



export const fecthDriverSubmittedDetail = async () => {

    try {

        const result = await pool.query(
            `
            SELECT DISTINCT

                -- Driver
                DD."DriverDetailId",
                DD."DriverName",
                DD."MobileNumber",
                DD."TruckNumber",

                

                -- Zone
                ZM."ZoneMasterId",
                ZM."ZoneMasterName",

                -- Route
                RP."RoutePlanId",
                RP."RoutePlanPoint",

                -- Assign Route
                AR."AssignRouteId",

                -- Completed Date
                MAX(SS."CreatedAt") AS "CompletedAt"

            FROM "DATA"."AssignRoute" AR

            INNER JOIN "DATA"."DriverDetail" DD
                ON AR."DriverDetailId" = DD."DriverDetailId"

            INNER JOIN "LKP"."ZoneMaster" ZM
                ON AR."ZoneMasterId" = ZM."ZoneMasterId"

            INNER JOIN "DATA"."RoutePlan" RP
                ON AR."RoutePlanId" = RP."RoutePlanId"

            INNER JOIN "DATA"."RouteStationStatus" RSS
                ON AR."AssignRouteId" = RSS."AssignRouteId"

            INNER JOIN "DATA"."StationSubmission" SS
                ON RSS."RouteStationStatusId" = SS."RouteStationStatusId"

            WHERE
                AR."IsRouteSuccess" = FALSE

            GROUP BY

                DD."DriverDetailId",
                DD."DriverName",
                DD."MobileNumber",
                DD."TruckNumber",

                ZM."ZoneMasterId",
                ZM."ZoneMasterName",

                RP."RoutePlanId",
                RP."RoutePlanPoint",

                AR."AssignRouteId"

            ORDER BY
                "CompletedAt" DESC;
            `
        );

        return result.rows;

    } catch (error) {

        throw error;

    }

};

export const fetchDriverSubmittedStationDetail = async (AssignRouteId) => {
    try {

        const result = await pool.query(
            `
            SELECT

                RSS."RouteStationStatusId",
                RSS."StatusId",
                RSS."VisitedAt",

                SS."StationSubmissionId",
                SS."Remarks",

                ED."ExcelDataId",
                ED."Taluk",
                ED."Station",
                ED."VoltageClass",
                ED."InChangreAEJEname",
                ED."ContactNumber",
                ED."SubStationAddress",
                ED."PinCode",
                ED."Latitude",
                ED."Longitude",

                STF."StationSubmissionFileId",
                STF."FileTypeId",
                STF."FileName"

            FROM "DATA"."RouteStationStatus" RSS

            INNER JOIN "DATA"."ExcelData" ED
                ON RSS."ExcelDataId" = ED."ExcelDataId"

            INNER JOIN "DATA"."StationSubmission" SS
                ON RSS."RouteStationStatusId" = SS."RouteStationStatusId"

            LEFT JOIN "DATA"."StationSubmissionFile" STF
                ON SS."StationSubmissionId" = STF."StationSubmissionId"

            WHERE
                RSS."AssignRouteId" = $1
                AND RSS."StatusId" = 3

            ORDER BY
                ED."ExcelDataId",
                STF."FileTypeId";
            `,
            [AssignRouteId]
        );

       const stations = [];

for (const row of result.rows) {

    let station = stations.find(
        item => item.stationSubmissionId === row.StationSubmissionId
    );

    if (!station) {

        station = {

            routeStationStatusId: row.RouteStationStatusId,
            statusId: row.StatusId,
            visitedAt: row.VisitedAt,

            stationSubmissionId: row.StationSubmissionId,
            remarks: row.Remarks,

            excelDataId: row.ExcelDataId,
            taluk: row.Taluk,
            station: row.Station,
            voltageClass: row.VoltageClass,
            inChargeAEJEName: row.InChangreAEJEname,
            contactNumber: row.ContactNumber,
            subStationAddress: row.SubStationAddress,
            pinCode: row.PinCode,
            latitude: row.Latitude,
            longitude: row.Longitude,

            files: []

        };

        stations.push(station);
    }

    if (row.StationSubmissionFileId) {

        station.files.push({

            stationSubmissionFileId: row.StationSubmissionFileId,

            fileTypeId: row.FileTypeId,

            fileTypeName:
                row.FileTypeId == 8
                    ? "DC Photo"
                    : row.FileTypeId == 9
                    ? "Annexure Photo"
                    : row.FileTypeId == 10
                    ? "Box Photo"
                    : "Unknown",

            fileName: row.FileName

        });

    }

}

return stations;

    } catch (error) {
        throw error;
    }
};


export const fetchFileView = async (StationSubmissionFileId, FileTypeId) => {
    try {

        const result = await pool.query(
            `
            SELECT
                "StationSubmissionFileId",
                "FileTypeId",
                "FileName",
                "FilePath"
            FROM "DATA"."StationSubmissionFile"
            WHERE
                "StationSubmissionFileId" = $1
                AND "FileTypeId" = $2
            LIMIT 1;
            `,
            [
                StationSubmissionFileId,
                FileTypeId
            ]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];

    } catch (error) {
        throw error;
    }
};