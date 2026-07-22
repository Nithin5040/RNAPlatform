
import { pool } from "../../Config/DbConfig.js"

export const viewDriverFiles = async (fileTypeId,DriverDetailId) => {
    try {
        const result = await pool.query(
            `
            SELECT
                DDF."FilePath",
                FT."FileTypeName"
            FROM "DATA"."DriverDetailFile" DDF
            LEFT JOIN "LKP"."FileType" FT
                ON DDF."FileTypeId" = FT."FileTypeId"
            
            WHERE DDF."FileTypeId" = $1 AND DDF."DriverDetailId"=$2
            LIMIT 1
            `,
            [fileTypeId,DriverDetailId]
        );

        return result.rows;
    } catch (error) {
        throw error;
    }
};





