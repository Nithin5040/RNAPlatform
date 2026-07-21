import { pool } from "../../Config/DbConfig.js";

export const findDriverByMobileNumber = async (mobileNumber) => {

    try {

        const query = `
            SELECT
                DD."DriverDetailId" AS "UserDriverId",
                DD."DriverName",
                DD."MobileNumber",
                DD."TruckNumber",
                DD."Password",
                DD."IsDisabled",
                DD."RoleId",
                R."RoleName"
            FROM "DATA"."DriverDetail" DD
            LEFT JOIN "LKP"."Role" R
                ON DD."RoleId" = R."RoleId"
            WHERE
                DD."MobileNumber" = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [mobileNumber]);

        return result.rows[0];

    } catch (error) {
        throw error;
    }

};