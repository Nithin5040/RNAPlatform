import { pool } from "../../Config/DbConfig.js"

import axios from "axios";


export const fetchZoneDropdown = async () => {
    try {
        const result = await pool.query(`
            
            SELECT
                DIstinct URE."ZoneMasterId",
                ZM."ZoneMasterName"
            FROM "DATA"."UploadRouteExcel" URE
            INNER JOIN "LKP"."ZoneMaster" ZM
                ON URE."ZoneMasterId" = ZM."ZoneMasterId"
            WHERE
                URE."IsDisabled" = FALSE
                
            ORDER BY
                ZM."ZoneMasterName";
            
            `)
        return result.rows
    } catch (error) {
        throw error
    }
}


export const fetchAssignRoute = async (ZoneMasterId) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT
                RP."RoutePlanId",
                RP."RoutePlanPoint"
            FROM "DATA"."UploadRouteExcel" URE
            INNER JOIN "DATA"."RoutePlan" RP
                ON URE."RoutePlanId" = RP."RoutePlanId"
            WHERE
                URE."ZoneMasterId" = $1
                AND URE."IsDisabled" = FALSE
                AND RP."IsDisabled" = FALSE
                AND URE."IsRouteSuccess" = FALSE
            ORDER BY
                RP."RoutePlanPoint";
            
            `, [ZoneMasterId])
        return result.rows
    } catch (error) {
        throw error
    }
}


export const fecthAssignDriver = async () => {
    try {
        const result = await pool.query(`
            
SELECT
    D."DriverDetailId",
    D."DriverName",
    D."TruckNumber",
    D."MobileNumber"
FROM "DATA"."DriverDetail" D
WHERE
    D."IsDisabled" = FALSE
    AND NOT EXISTS
    (
        SELECT 1
        FROM "DATA"."AssignRoute" AR
        WHERE
            AR."DriverDetailId" = D."DriverDetailId"
            AND AR."IsRouteSuccess" = true
    )
ORDER BY D."DriverName";

            `)
        return result.rows
    } catch (error) {
        throw error
    }
}


export const InsertAssignRoute = async ({
    ZoneMasterId,
    RoutePlanId,
    DriverDetailId,
    CreatedByUserId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        //=================================================
        // Check Zone
        //=================================================

        const zone = await client.query(
            `
            SELECT 1
            FROM "LKP"."ZoneMaster"
            WHERE
                "ZoneMasterId"=$1
                AND "IsDisabled"=FALSE
            `,
            [ZoneMasterId]
        );

        if (zone.rowCount === 0) {
            throw new Error("Invalid Zone.");
        }

        //=================================================
        // Check Route
        //=================================================

        const route = await client.query(
            `
            SELECT 1
            FROM "DATA"."RoutePlan"
            WHERE
                "RoutePlanId"=$1
                AND "ZoneMasterId"=$2
                AND "IsDisabled"=FALSE
            `,
            [RoutePlanId, ZoneMasterId]
        );

        if (route.rowCount === 0) {
            throw new Error("Selected Route does not belong to the selected Zone.");
        }

        //=================================================
        // Check Driver
        //=================================================

        const driver = await client.query(
            `
            SELECT 1
            FROM "DATA"."DriverDetail"
            WHERE
                "DriverDetailId"=$1
                AND "IsDisabled"=FALSE
            `,
            [DriverDetailId]
        );

        if (driver.rowCount === 0) {
            throw new Error("Invalid Driver.");
        }

        //=================================================
        // Check User
        //=================================================

        const user = await client.query(
            `
            SELECT 1
            FROM "DATA"."User"
            WHERE "UserId"=$1
            `,
            [CreatedByUserId]
        );

        if (user.rowCount === 0) {
            throw new Error("Invalid User.");
        }

        //=================================================
        // Route Already Assigned
        //=================================================

        const assignedRoute = await client.query(
            `
            SELECT 1
            FROM "DATA"."AssignRoute"
            WHERE
                "RoutePlanId"=$1
            `,
            [RoutePlanId]
        );

        if (assignedRoute.rowCount > 0) {
            throw new Error("This Route is already assigned.");
        }

        //=================================================
        // Driver Already Assigned
        //=================================================

        const assignedDriver = await client.query(
            `
            SELECT 1
            FROM "DATA"."AssignRoute"
            WHERE
                "DriverDetailId"=$1 AND "IsRouteSuccess" = true
            `,
            [DriverDetailId]
        );

        if (assignedDriver.rowCount > 0) {
            throw new Error("Driver is already assigned to another Route.");
        }

        //=================================================
        // Insert
        //=================================================

        const result = await client.query(
            `
            INSERT INTO "DATA"."AssignRoute"
            (
                "ZoneMasterId",
                "RoutePlanId",
                "DriverDetailId",
                "CreatedAt",
                "CreatedByUserId",
                "IsRouteSuccess"
            )
            VALUES
            (
                $1,
                $2,
                $3,
                NOW(),
                $4,
                true
            )
            RETURNING *;
            `,
            [
                ZoneMasterId,
                RoutePlanId,
                DriverDetailId,
                CreatedByUserId,
            ]
        );

        //=================================================
        // Update UploadRouteExcel
        //=================================================

        await client.query(
            `
            UPDATE "DATA"."UploadRouteExcel"
            SET
                "IsRouteSuccess" = TRUE,
                "UpdatedAt" = NOW()
            WHERE
                "ZoneMasterId" = $1
                AND "RoutePlanId" = $2
                AND "IsDisabled" = FALSE;
            `,
            [
                ZoneMasterId,
                RoutePlanId
            ]
        );


        //=================================================
        // Get UploadRouteExcelId
        //=================================================

        const uploadExcel = await client.query(
            `
    SELECT
        "UploadRouteExcelId"
    FROM "DATA"."UploadRouteExcel"
    WHERE
        "ZoneMasterId" = $1
        AND "RoutePlanId" = $2
        AND "IsDisabled" = FALSE
    `,
            [
                ZoneMasterId,
                RoutePlanId
            ]
        );

        if (uploadExcel.rowCount === 0) {
            throw new Error("Uploaded Excel not found.");
        }

        const uploadRouteExcelId =
            uploadExcel.rows[0].UploadRouteExcelId;


        //=================================================
        // Fetch all ExcelDataIds
        //=================================================

        const excelStations = await client.query(
            `
    SELECT
        "ExcelDataId"
    FROM "DATA"."ExcelData"
    WHERE
        "UploadRouteExcelId" = $1
        AND "IsDisabled" = FALSE
    ORDER BY "ExcelDataId"
    `,
            [
                uploadRouteExcelId
            ]
        );


        //=================================================
        // Insert RouteStationStatus
        //=================================================

        const assignRouteId = result.rows[0].AssignRouteId;

        for (const station of excelStations.rows) {

            await client.query(
                `
                INSERT INTO "DATA"."RouteStationStatus"
                (
                    "AssignRouteId",
                    "ExcelDataId",
                    "StatusId",
                    "CreatedAt"
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    NOW()
                )
                `,
                [
                    assignRouteId,
                    station.ExcelDataId,
                    1 // Pending
                ]
            );

        }

        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();

    }

};


export const fecthDriverAssignedDetails = async (DriverDetailId) => {

    try {

        const result = await pool.query(
            `
            SELECT

                -- Driver
                DD."DriverDetailId",
                DD."DriverName",
                DD."MobileNumber",
                DD."TruckNumber",
                DD."RoleId",

                RL."RoleName",

                -- Assign Route
                AR."AssignRouteId",

                -- Zone
                ZM."ZoneMasterId",
                ZM."ZoneMasterName",

                -- Route
                RP."RoutePlanId",
                RP."RoutePlanPoint",

                -- Upload Excel
                URE."UploadRouteExcelId",

                -- Station
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

                -- Status
                RSS."RouteStationStatusId",
                RSS."StatusId",
                SM."StatusName",
                RSS."VisitedAt",
                RSS."Remarks"

            FROM "DATA"."DriverDetail" DD

            INNER JOIN "LKP"."Role" RL
                ON DD."RoleId" = RL."RoleId"

            INNER JOIN
            (
                SELECT *
                FROM "DATA"."AssignRoute"
                WHERE
                    "DriverDetailId" = $1
                    AND "IsRouteSuccess" = TRUE
                ORDER BY "AssignRouteId" DESC
                LIMIT 1
            ) AR
            ON DD."DriverDetailId" = AR."DriverDetailId"

            INNER JOIN "LKP"."ZoneMaster" ZM
                ON AR."ZoneMasterId" = ZM."ZoneMasterId"

            INNER JOIN "DATA"."RoutePlan" RP
                ON AR."RoutePlanId" = RP."RoutePlanId"

            INNER JOIN "DATA"."UploadRouteExcel" URE
                ON URE."ZoneMasterId" = AR."ZoneMasterId"
                AND URE."RoutePlanId" = AR."RoutePlanId"
                AND URE."IsDisabled" = FALSE

            INNER JOIN "DATA"."ExcelData" ED
                ON ED."UploadRouteExcelId" = URE."UploadRouteExcelId"
                AND ED."IsDisabled" = FALSE

            LEFT JOIN "DATA"."RouteStationStatus" RSS
                ON RSS."AssignRouteId" = AR."AssignRouteId"
                AND RSS."ExcelDataId" = ED."ExcelDataId"

            LEFT JOIN "LKP"."StatusMaster" SM
                ON SM."StatusId" = RSS."StatusId"

            WHERE
                DD."DriverDetailId" = $1
                AND DD."IsDisabled" = FALSE

            ORDER BY ED."ExcelDataId";
            `,
            [DriverDetailId]
        );

        if (result.rowCount === 0) {
            return null;
        }

        //-------------------------------------------------
        // Build OSRM Coordinates
        //-------------------------------------------------

        const coordinates = result.rows
            .map(row => `${row.Longitude},${row.Latitude}`)
            .join(";");

        const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

        const { data } = await axios.get(url);

        const route = data.routes[0];
        const legs = route.legs;

//===============================================================================
        //-------------------------------------------------
        // Vishvin Office -> First Station
        //-------------------------------------------------

        const companyLatitude = "12.971600";
        const companyLongitude = "77.594600";

        const companyUrl =
            `https://router.project-osrm.org/route/v1/driving/${companyLongitude},${companyLatitude};${result.rows[0].Longitude},${result.rows[0].Latitude}?overview=false`;

        const companyResponse = await axios.get(companyUrl);

        const companyRoute = companyResponse.data.routes[0];
//===========================================================================

        //-------------------------------------------------
        // First Row
        //-------------------------------------------------

        const firstRow = result.rows[0];

        //-------------------------------------------------
        // Running Distance
        //-------------------------------------------------

        let totalDistance = 0;
        let totalDuration = 0;

        //-------------------------------------------------
        // Response
        //-------------------------------------------------

        return {

            driverDetails: {

                driverDetailId: firstRow.DriverDetailId,
                driverName: firstRow.DriverName,
                mobileNumber: firstRow.MobileNumber,
                truckNumber: firstRow.TruckNumber,
                roleId: firstRow.RoleId,
                roleName: firstRow.RoleName

            },

            assignedRoute: {

                zone: {

                    zoneMasterId: firstRow.ZoneMasterId,
                    zoneMasterName: firstRow.ZoneMasterName

                },

                route: {

                    routePlanId: firstRow.RoutePlanId,
                    routePlanPoint: firstRow.RoutePlanPoint,

                    totalRouteDistanceKM: Number((route.distance / 1000).toFixed(2)),
                    totalRouteDurationMinutes: Number((route.duration / 60).toFixed(2))

                },

                stationCount: result.rows.length,

                stations: result.rows.map((row, index) => {

                    let distance = null;

                    if (row.StatusId == 3) {

                        if (index === 0) {

                            totalDistance += companyRoute.distance;
                            totalDuration += companyRoute.duration;

                            distance = {

                                previousStation: "Vishvin Technology Pvt. Ltd.",
                                previousStationAddress: "Above Super Market, Bengaluru",

                                startLatitude: companyLatitude,
                                startLongitude: companyLongitude,

                                distanceFromPreviousMeters:
                                    Number(companyRoute.distance.toFixed(2)),

                                distanceFromPreviousKM:
                                    Number((companyRoute.distance / 1000).toFixed(2)),

                                durationFromPreviousSeconds:
                                    Number(companyRoute.duration.toFixed(2)),

                                durationFromPreviousMinutes:
                                    Number((companyRoute.duration / 60).toFixed(2)),

                                totalTravelledKM:
                                    Number((totalDistance / 1000).toFixed(2))

                            };

                        } else {

                            totalDistance += legs[index - 1].distance;
                            totalDuration += legs[index - 1].duration;

                            distance = {

                                previousStation: result.rows[index - 1].Station,

                                distanceFromPreviousMeters:
                                    Number(legs[index - 1].distance.toFixed(2)),

                                distanceFromPreviousKM:
                                    Number((legs[index - 1].distance / 1000).toFixed(2)),

                                durationFromPreviousSeconds:
                                    Number(legs[index - 1].duration.toFixed(2)),

                                durationFromPreviousMinutes:
                                    Number((legs[index - 1].duration / 60).toFixed(2)),

                                totalTravelledKM:
                                    Number((totalDistance / 1000).toFixed(2))

                            };

                        }

                    }

                    return {

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

                        status: {

                            routeStationStatusId: row.RouteStationStatusId,
                            statusId: row.StatusId,
                            statusName: row.StatusName,
                            visitedAt: row.VisitedAt

                        },

                        distance

                    };

                })

            }

        };

    } catch (error) {

        throw error;

    }

};

export const insertStationDetail = async ({
    RouteStationStatusId,
    DriverDetailId,
    Remarks,
    FileTypeIds,
    Files
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        //=================================================
        // Check Route Station Status Exists
        //=================================================

        const checkRouteStation = await client.query(
            `
            SELECT
                "RouteStationStatusId",
                "StatusId"
            FROM "DATA"."RouteStationStatus"
            WHERE
                "RouteStationStatusId" = $1
            `,
            [RouteStationStatusId]
        );

        if (checkRouteStation.rowCount === 0) {
            throw new Error("Invalid Route Station.");
        }

        //=================================================
        // Already Completed
        //=================================================

        if (checkRouteStation.rows[0].StatusId == 2) {
            throw new Error("This station is already completed.");
        }

        //=================================================
        // Check Driver
        //=================================================

        const checkDriver = await client.query(
            `
            SELECT 1
            FROM "DATA"."DriverDetail"
            WHERE
                "DriverDetailId" = $1
                AND "IsDisabled" = FALSE
            `,
            [DriverDetailId]
        );

        if (checkDriver.rowCount === 0) {
            throw new Error("Invalid Driver.");
        }

        //=================================================
        // Prevent Duplicate Submission
        //=================================================

        const checkSubmission = await client.query(
            `
            SELECT 1
            FROM "DATA"."StationSubmission"
            WHERE
                "RouteStationStatusId" = $1
            `,
            [RouteStationStatusId]
        );

        if (checkSubmission.rowCount > 0) {
            throw new Error("Station already submitted.");
        }

        //=================================================
        // Insert StationSubmission
        //=================================================

        const submission = await client.query(
            `
            INSERT INTO "DATA"."StationSubmission"
            (
                "RouteStationStatusId",
                "Remarks",
                "CreatedAt",
                "CreatedByDriverId"
            )
            VALUES
            (
                $1,
                $2,
                NOW(),
                $3
            )
            RETURNING "StationSubmissionId";
            `,
            [
                RouteStationStatusId,
                Remarks,
                DriverDetailId
            ]
        );

        const stationSubmissionId =
            submission.rows[0].StationSubmissionId;

        //=================================================
        // Insert Files
        //=================================================

        for (let i = 0; i < Files.length; i++) {

            await client.query(
                `
                INSERT INTO "DATA"."StationSubmissionFile"
                (
                    "StationSubmissionId",
                    "FileTypeId",
                    "FileName",
                    "FilePath",
                    "CreatedAt"
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    NOW()
                )
                `,
                [
                    stationSubmissionId,
                    FileTypeIds[i],
                    Files[i].originalname,
                    Files[i].path
                ]
            );

        }

        //=================================================
        // Update Route Station Status
        //=================================================

        await client.query(
            `
            UPDATE "DATA"."RouteStationStatus"
            SET
                "StatusId" = 3,
                "VisitedAt" = NOW(),
                "UpdatedAt" = NOW()
            WHERE
                "RouteStationStatusId" = $1
            `,
            [
                RouteStationStatusId
            ]
        );

        //=================================================
// Get AssignRouteId
//=================================================

const assignRouteResult = await client.query(
    `
    SELECT
        "AssignRouteId"
    FROM "DATA"."RouteStationStatus"
    WHERE
        "RouteStationStatusId" = $1
    `,
    [RouteStationStatusId]
);

const assignRouteId =
    assignRouteResult.rows[0].AssignRouteId;



    //=================================================
// Check Pending Stations
//=================================================

const pendingStations = await client.query(
    `
    SELECT
        COUNT(*) AS "PendingCount"
    FROM "DATA"."RouteStationStatus"
    WHERE
        "AssignRouteId" = $1
        AND "StatusId" <> 3
    `,
    [assignRouteId]
);

const pendingCount =
    Number(pendingStations.rows[0].PendingCount);




    //=================================================
// Update Assign Route
//=================================================

if (pendingCount === 0) {

    await client.query(
        `
        UPDATE "DATA"."AssignRoute"
        SET
            "IsRouteSuccess" = FALSE,
            "UpdatedAt" = NOW()
        WHERE
            "AssignRouteId" = $1
        `,
        [assignRouteId]
    );

}

        await client.query("COMMIT");

        return {

            stationSubmissionId,

            totalFiles: Files.length,

            status: "Completed"

        };

    }
    catch (error) {

        await client.query("ROLLBACK");

        throw error;

    }
    finally {

        client.release();

    }

};



// export const fecthDistanceLocations = async () => {

//     try {

//         const query = `
//             SELECT
//                 "ExcelDataId",
//                 "Station",
//                 "Latitude",
//                 "Longitude"
//             FROM "DATA"."ExcelData"
//             WHERE "IsDisabled" = false
//             ORDER BY "ExcelDataId";
//         `;

//         const { rows } = await pool.query(query);

//         if (rows.length < 2) {
//             return {
//                 totalDistanceInMeters: 0,
//                 totalDistanceInKM: 0,
//                 stationDistances: []
//             };
//         }

//         const coordinates = rows
//             .map(item => `${item.Longitude},${item.Latitude}`)
//             .join(";");

//         const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

//         const { data } = await axios.get(url);

//         const route = data.routes[0];

//         // Station-to-Station distance
//         const stationDistances = [];

//         for (let i = 0; i < route.legs.length; i++) {

//             stationDistances.push({

//                 FromStationId: rows[i].ExcelDataId,
//                 FromStation: rows[i].Station,

//                 ToStationId: rows[i + 1].ExcelDataId,
//                 ToStation: rows[i + 1].Station,

//                 DistanceInMeters: Number(route.legs[i].distance.toFixed(2)),
//                 DistanceInKM: Number((route.legs[i].distance / 1000).toFixed(2)),

//                 DurationInSeconds: Number(route.legs[i].duration.toFixed(2)),
//                 DurationInMinutes: Number((route.legs[i].duration / 60).toFixed(2))

//             });

//         }

//         return {

//             TotalDistanceInMeters: Number(route.distance.toFixed(2)),
//             TotalDistanceInKM: Number((route.distance / 1000).toFixed(2)),

//             TotalDurationInSeconds: Number(route.duration.toFixed(2)),
//             TotalDurationInMinutes: Number((route.duration / 60).toFixed(2)),

//             StationDistances: stationDistances

//         };

//     } catch (error) {

//         throw error;

//     }

// };