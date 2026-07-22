import { pool } from "../../Config/DbConfig.js"



export const fetchZoneDropdown = async () => {
    try {
        const result = await pool.query(`
            
            SELECT
                URE."ZoneMasterId",
                ZM."ZoneMasterName"
            FROM "DATA"."UploadRouteExcel" URE
            INNER JOIN "LKP"."ZoneMaster" ZM
                ON URE."ZoneMasterId" = ZM."ZoneMasterId"
            WHERE
                URE."IsDisabled" = FALSE
                AND ZM."IsDisabled" = FALSE
                -- AND URE."IsRouteSuccess" = FALSE

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
            
        SELECT "DriverDetailId", "DriverName"  FROM  "DATA"."DriverDetail" WHERE "IsDisabled" =  false


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
                "DriverDetailId"=$1
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

                -- Zone
                ZM."ZoneMasterId",
                ZM."ZoneMasterName",

                -- Route
                RP."RoutePlanId",
                RP."RoutePlanPoint",

                -- Upload Excel
                URE."UploadRouteExcelId",

                -- Station Details
                ED."ExcelDataId",
                ED."Taluk",
                ED."Station",
                ED."VoltageClass",
                ED."InChangreAEJEname",
                ED."ContactNumber",
                ED."SubStationAddress",
                ED."PinCode",
                ED."Latitude",
                ED."Longitude"

            FROM "DATA"."DriverDetail" DD

            INNER JOIN "LKP"."Role" RL
                ON DD."RoleId" = RL."RoleId"

            INNER JOIN "DATA"."AssignRoute" AR
                ON DD."DriverDetailId" = AR."DriverDetailId"

            INNER JOIN "LKP"."ZoneMaster" ZM
                ON AR."ZoneMasterId" = ZM."ZoneMasterId"

            INNER JOIN "DATA"."RoutePlan" RP
                ON AR."RoutePlanId" = RP."RoutePlanId"

            INNER JOIN "DATA"."UploadRouteExcel" URE
                ON
                    URE."ZoneMasterId" = AR."ZoneMasterId"
                    AND URE."RoutePlanId" = AR."RoutePlanId"
                    AND URE."IsDisabled" = FALSE

            INNER JOIN "DATA"."ExcelData" ED
                ON
                    ED."UploadRouteExcelId" = URE."UploadRouteExcelId"
                    AND ED."IsDisabled" = FALSE

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

        const firstRow = result.rows[0];

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
                    routePlanPoint: firstRow.RoutePlanPoint

                },
                stationCount: result.rows.length,
                stations: result.rows.map(row => ({
                    excelDataId: row.ExcelDataId,
                    taluk: row.Taluk,
                    station: row.Station,
                    voltageClass: row.VoltageClass,
                    inChargeAEJEName: row.InChangreAEJEname,
                    contactNumber: row.ContactNumber,
                    subStationAddress: row.SubStationAddress,
                    pinCode: row.PinCode,
                    latitude: row.Latitude,
                    longitude: row.Longitude

                }))

            }

        };

    } catch (error) {

        throw error;

    }

};