import {pool} from "../../Config/DbConfig.js";

export const findUserByMobileNumber = async (mobileNumber) => {
    const query = `
        SELECT
            u."UserId",
            u."FirstName",
            u."LastName",
            u."MobileNumber",
            u."Email",
            u."Password",
            u."RoleId",
            r."RoleName",
            u."GenderId",
            g."GenderName",
            u."IsDisabled",
            u."IsForcePasswordChange"
        FROM "DATA"."User" u
        LEFT JOIN "LKP"."Role" r
            ON u."RoleId" = r."RoleId"
        LEFT JOIN "LKP"."Gender" g
            ON u."GenderId" = g."GenderId"
        WHERE u."MobileNumber" = $1
        LIMIT 1;
    `;

    const result = await pool.query(query, [mobileNumber]);
    return result.rows[0];
};