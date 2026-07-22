import { pool } from "../../Config/DbConfig.js";


export const insertXl = async ({
    ZoneMasterId,
    RoutePlanId,
    CreatedByUserId,
    ExcelFileName,
    ExcelFilePath,
    rows
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        //====================================================
        // Check Zone Exists
        //====================================================

        const checkZone = await client.query(
            `
            SELECT 1
            FROM "LKP"."ZoneMaster"
            WHERE
                "ZoneMasterId" = $1
                AND "IsDisabled" = FALSE
            `,
            [ZoneMasterId]
        );

        if (checkZone.rowCount === 0) {
            throw new Error("Selected Zone does not exist.");
        }

        //====================================================
        // Check Route Exists
        //====================================================

        const checkRoute = await client.query(
            `
            SELECT 1
            FROM "DATA"."RoutePlan"
            WHERE
                "RoutePlanId" = $1
                AND "ZoneMasterId" = $2
            `,
            [RoutePlanId, ZoneMasterId]
        );

        if (checkRoute.rowCount === 0) {
            throw new Error("Selected Route does not belong to the selected Zone.");
        }

        //====================================================
// Check Excel Already Uploaded
//====================================================

const checkUpload = await client.query(
    `
    SELECT 1
    FROM "DATA"."UploadRouteExcel"
    WHERE
        "RoutePlanId" = $1
        AND "IsDisabled" = FALSE
    `,
    [RoutePlanId]
);

if (checkUpload.rowCount > 0) {
    throw new Error("An Excel file has already been uploaded for the selected Route.");
}

        //====================================================
        // Insert UploadRouteExcel
        //====================================================

        const uploadResult = await client.query(
            `
            INSERT INTO "DATA"."UploadRouteExcel"
            (
                "ZoneMasterId",
                "RoutePlanId",
                "ExcelFileName",
                "ExcelFilePath",
                "CreatedAt",
                "CreatedByUserId"
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                NOW(),
                $5
            )
            RETURNING "UploadRouteExcelId";
            `,
            [
                ZoneMasterId,
                RoutePlanId,
                ExcelFileName,
                ExcelFilePath,
                CreatedByUserId
            ]
        );

        const uploadRouteExcelId =
            uploadResult.rows[0].UploadRouteExcelId;

        //====================================================
        // Insert Excel Rows
        //====================================================

        for (const row of rows) {

            //----------------------------------------
            // Split Latitude & Longitude
            //----------------------------------------

            let latitude = null;
            let longitude = null;

            if (row.LatitudeLongitude) {

                const parts = row.LatitudeLongitude
                    .toString()
                    .split(",");

                latitude = parts[0] ? parts[0].trim() : null;
                longitude = parts[1] ? parts[1].trim() : null;

            }

            //----------------------------------------
            // Insert ExcelData
            //----------------------------------------

            await client.query(
                `
                INSERT INTO "DATA"."ExcelData"
                (
                    "UploadRouteExcelId",
                    "Taluk",
                    "Station",
                    "VoltageClass",
                    "InChangreAEJEname",
                    "ContactNumber",
                    "SubStationAddress",
                    "PinCode",
                    "Latitude",
                    "Longitude"
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
                )
                `,
                [
                    uploadRouteExcelId,
                    row.Taluk || null,
                    row.Station || null,
                    row.VoltageClass || null,
                    row.InChangreAEJEname || null,
                    row.ContactNumber || null,
                    row.SubStationAddress || null,
                    row.PinCode || null,
                    latitude,
                    longitude
                ]
            );
        }

        await client.query("COMMIT");

        return {
            UploadRouteExcelId: uploadRouteExcelId,
            TotalRecords: rows.length
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


export const fetchZoneMaster =async()=>{
    try {
        const result = await pool.query(`
            
        SELECT "ZoneMasterId", "ZonePrefix" FROM "LKP"."ZoneMaster" WHERE "IsDisabled" = false    
        `)
        return result.rows
    } catch (error) {
        throw error
    }
}

export const fecthRoutes = async (ZoneMasterId) => {
    try {

        const result = await pool.query(
            `
            SELECT
                RP."RoutePlanId" AS "RoutePlanId",
                RP."RoutePlanPoint" AS "RoutePlanPoint"
            FROM "DATA"."RoutePlan" RP
            WHERE
                RP."IsDisabled" = FALSE
                AND RP."ZoneMasterId" = $1
                AND NOT EXISTS (
                    SELECT 1
                    FROM "DATA"."UploadRouteExcel" URE
                    WHERE
                        URE."RoutePlanId" = RP."RoutePlanId"
                        AND URE."IsDisabled" = FALSE
                )
            ORDER BY
                RP."RoutePlanPoint";
            `,
            [ZoneMasterId]
        );

        return result.rows;

    } catch (error) {
        throw error;
    }
};
