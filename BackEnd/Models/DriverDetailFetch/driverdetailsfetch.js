import { pool } from "../../Config/DbConfig.js";

export const FetchDrvrDetails = async () => {
    try {
        const result = await pool.query(`
            SELECT 
                DD."DriverDetailId",
                DD."DriverName",
                DD."MobileNumber",
                DD."TruckNumber",
                DD."OdometerReading",
                R."RoleName"
            FROM "DATA"."DriverDetail" DD
            INNER JOIN "LKP"."Role" R
                ON DD."RoleId" = R."RoleId"
            WHERE DD."IsDisabled" = false;
            `);

        return result.rows;
    } catch (error) {
        throw error;
    }
};




