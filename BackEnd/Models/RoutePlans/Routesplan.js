import { pool } from "../../Config/DbConfig.js"




export const FetchZones = async () => {
    try {
        const result = await pool.query(`
            SELECT "ZoneMasterId", "ZoneMasterName" FROM "LKP"."ZoneMaster" WHERE "IsDisabled" = false

            `)
        return result.rows
    } catch (error) {
        throw error
    }
}

export const fetchZonePoint = async (zonemasterId) => {
    try {
        const result = await pool.query(`
            SELECT "ZoneMasterId", "ZonePrefix" FROM "LKP"."ZoneMaster" WHERE "IsDisabled" = false AND "ZoneMasterId" = $1

            `, [zonemasterId])
        return result.rows
    } catch (error) {
        throw error
    }
}










export const RouteInsert = async ({
    ZoneMasterId,
    RouteNumber,
    CreatedByUserId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        //==============================
        // Check Zone Exists
        //==============================

        const zoneResult = await client.query(
            `
            SELECT
                "ZonePrefix"
            FROM "LKP"."ZoneMaster"
            WHERE "ZoneMasterId"=$1
            `,
            [ZoneMasterId]
        );

        if (zoneResult.rowCount === 0) {
            throw new Error("Selected Zone does not exist.");
        }

        const prefix = zoneResult.rows[0].ZonePrefix;

        //==============================
        // Generate Route Code
        //==============================

        const routePlanPoint =
            `${prefix}${String(RouteNumber).padStart(3, "0")}`;

        //==============================
        // Duplicate Validation
        //==============================

        const duplicate = await client.query(
            `
            SELECT 1
            FROM "DATA"."RoutePlan"
            WHERE "RoutePlanPoint"=$1
            `,
            [routePlanPoint]
        );

        if (duplicate.rowCount > 0) {
            throw new Error("Route Plan already exists.");
        }

        //==============================
        // Insert
        //==============================

        const insertResult = await client.query(
            `
            INSERT INTO "DATA"."RoutePlan"
            (
                "ZoneMasterId",
                "RoutePlanPoint",
                "CreatedAt",
                "CreatedByUserId"
            )
            VALUES
            (
                $1,
                $2,
                NOW(),
                $3
            )
            RETURNING *;
            `,
            [
                ZoneMasterId,
                routePlanPoint,
                CreatedByUserId
            ]
        );

        await client.query("COMMIT");
        return insertResult.rows[0];

    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }

};

export const getRoutePlan = async () => {

    try {

        const result = await pool.query(
            `
                SELECT
                RP."RoutePlanId",
                RP."ZoneMasterId",
                ZM."ZoneMasterName",
                RP."RoutePlanPoint",
                RP."CreatedAt",
                RP."UpdatedAt",
                RP."CreatedByUserId",
                U."FirstName" AS "CreatedByUserName"
            FROM "DATA"."RoutePlan" RP
            INNER JOIN "LKP"."ZoneMaster" ZM
                ON RP."ZoneMasterId" = ZM."ZoneMasterId"
            LEFT JOIN "DATA"."User" U
                ON RP."CreatedByUserId" = U."UserId"
            WHERE
                ZM."IsDisabled" = FALSE
            ORDER BY
                ZM."ZoneMasterName",
                RP."RoutePlanPoint";
            `
        );

        return result.rows;

    }
    catch (error) {
        throw error;
    }

};


export const routeUpdate = async ({
    RoutePlanId,
    ZoneMasterId,
    RoutePlanPoint
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        //=====================================
        // Check Route Exists
        //=====================================

        const checkRoute = await client.query(
            `
            SELECT 1
            FROM "DATA"."RoutePlan"
            WHERE "RoutePlanId" = $1
            `,
            [RoutePlanId]
        );

        if (checkRoute.rowCount === 0) {
            throw new Error("Route Plan does not exist.");
        }

        //=====================================
        // Check Zone Exists
        //=====================================

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

        //=====================================
        // Duplicate Validation
        //=====================================

        const duplicate = await client.query(
            `
            SELECT 1
            FROM "DATA"."RoutePlan"
            WHERE
                UPPER("RoutePlanPoint") = UPPER($1)
                AND "RoutePlanId" <> $2
            `,
            [
                RoutePlanPoint,
                RoutePlanId
            ]
        );

        if (duplicate.rowCount > 0) {
            throw new Error("Route Plan Point already exists.");
        }

        //=====================================
        // Update
        //=====================================

        const result = await client.query(
            `
            UPDATE "DATA"."RoutePlan"
            SET
                "ZoneMasterId" = $1,
                "RoutePlanPoint" = $2,
                "UpdatedAt" = NOW()
            WHERE
                "RoutePlanId" = $3
            RETURNING *;
            `,
            [
                ZoneMasterId,
                RoutePlanPoint.toUpperCase(),
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