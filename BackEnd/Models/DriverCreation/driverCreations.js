import { pool } from "../../Config/DbConfig.js"


export const fecthFileTypeDropdwn = async()=>{
    try {
        const result = await pool.query(`
            
            SELECT "FileTypeId", "FileTypeName" FROM "LKP"."FileType" WHERE "IsDisbled" = false

            `)
    return result.rows
    } catch (error) {
        throw error
    }
}


export const insertDriverDetail = async ({
    DriverName,
    MobileNumber,
    TruckNumber,
    Password,
    CreatedByUserId,
    FileTypeIds,
    Files,
    OdometerReading
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        //====================================================
        // Check Mobile Number Already Exists
        //====================================================

        const checkMobile = await client.query(
            `
            SELECT 1
            FROM "DATA"."DriverDetail"
            WHERE
                "MobileNumber" = $1
                AND "IsDisabled" = FALSE
            `,
            [MobileNumber]
        );

        if (checkMobile.rowCount > 0) {
            throw new Error("Mobile Number already exists.");
        }

        //====================================================
        // Check CreatedByUserId Exists
        //====================================================

        const checkUser = await client.query(
            `
            SELECT 1
            FROM "DATA"."User"
            WHERE "UserId" = $1
            `,
            [CreatedByUserId]
        );

        if (checkUser.rowCount === 0) {
            throw new Error("Invalid User.");
        }

        //====================================================
        // Validate FileTypeIds
        //====================================================

        for (const fileTypeId of FileTypeIds) {

            const checkFileType = await client.query(
                `
                SELECT 1
                FROM "LKP"."FileType"
                WHERE "FileTypeId" = $1
                `,
                [fileTypeId]
            );

            if (checkFileType.rowCount === 0) {
                throw new Error(`Invalid FileTypeId : ${fileTypeId}`);
            }

        }

        //====================================================
        // Insert Driver Detail
        //====================================================

        const driverResult = await client.query(
            `
            INSERT INTO "DATA"."DriverDetail"
            (
                "DriverName",
                "MobileNumber",
                "TruckNumber",
                "Password",
                "CreatedAt",
                "CreatedByUserId",
                "RoleId",
                "OdometerReading"
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                NOW(),
                $5,
                $6,
                $7
            )
            RETURNING "DriverDetailId";
            `,
            [
                DriverName,
                MobileNumber,
                TruckNumber,
                Password,
                CreatedByUserId,
                3,
                OdometerReading
            ]
        );

        const DriverDetailId =
            driverResult.rows[0].DriverDetailId;

        //====================================================
        // Insert Driver Files
        //====================================================

        for (let i = 0; i < Files.length; i++) {

            await client.query(
                `
                INSERT INTO "DATA"."DriverDetailFile"
                (
                    "DriverDetailId",
                    "FileTypeId",
                    "FilePath"
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    DriverDetailId,
                    FileTypeIds[i],
                    Files[i].path
                ]
            );

        }

        await client.query("COMMIT");

        return {

            DriverDetailId,
            TotalFiles: Files.length

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