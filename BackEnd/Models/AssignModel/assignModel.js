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