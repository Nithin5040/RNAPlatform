import { pool } from "../../Config/DbConfig.js";

export const insertXl = async (rows) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        for (const row of rows) {

            await client.query(
                `
                INSERT INTO "LKP"."ZoneMaster"
                (
                    "ZoneName",
                    "ZoneCode",
                    "CircleName",
                    "CircleCode",
                    "DivisionName",
                    "DivisionCode",
                    "StationName",
                    "StationNameCode",
                    "VoltageClass",
                    "Taluk",
                    "TalukCode",
                    "DistrictName",
                    "DistrictCode",
                    "InChargeAEJEName",
                    "ContactNumber",
                    "Pincode",
                    "SubStationAddressWithPincode",
                    "CreatedAt",
                    "CreatedByUserName"
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8,
                    $9,$10,$11,$12,$13,$14,$15,$16,$17,
                    NOW(),
                    $18
                )
                `,
                [
                    row.ZoneName,
                    row.ZoneCode,
                    row.CircleName,
                    row.CircleCode,
                    row.DivisionName,
                    row.DivisionCode,
                    row.StationName,
                    row.StationNameCode,
                    row.VoltageClass?.toString(),
                    row.Taluk,
                    row.TalukCode,
                    row.DistrictName,
                    row.DistrictCode,
                    row.InChargeAEJEName,
                    row.ContactNumber?.toString(),
                    row.Pincode?.toString(),
                    row.SubStationAddressWithPincode,
                    "User"
                ]
            );
        }

        await client.query("COMMIT");

    } catch (error) {

        await client.query("ROLLBACK");
        console.error("Insert Error:", error);
        throw error;

    } finally {

        client.release();

    }
};