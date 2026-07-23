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

export const updateDriverDetails=async(DriverName,MobileNumber,TruckNumber,OdometerReading,DriverDetailId)=>{
    try {
        let query=`UPDATE "DATA"."DriverDetail" 
        SET 
        "DriverName"=$1,
        "MobileNumber"=$2,
        "TruckNumber"=$3,
        "OdometerReading"=$4
        WHERE "DriverDetailId"=$5
           RETURNING *`;
        let result=await pool.query(query,[DriverName,MobileNumber,TruckNumber,OdometerReading,DriverDetailId]);
        return result.rows[0]
    } catch (error) {
        throw error
    }
}




