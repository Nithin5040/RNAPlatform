import { pool } from "../../Config/DbConfig.js";


export const FetchZoneNameDrpdwn = async () => {
    try {
        let query = `SELECT "ZoneName","ZoneCode" FROM "LKP"."ZoneMaster" WHERE "IsDisabled"=false`;
        let result = await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}


export const FetchCircleDrpdwn = async (ZoneCode) => {
    try {
        let query = `SELECT "CircleName","CircleCode" FROM "LKP"."ZoneMaster" WHERE "ZoneCode" = $1 AND "IsDisabled"=false
`;
        let result = await pool.query(query, [ZoneCode]);
        return result.rows
    } catch (error) {
        throw error
    }
}
export const FetchDivisionDrpdwn = async (circleCode) => {
    try {
        let query = `SELECT "DivisionName","DivisionCode" FROM "LKP"."ZoneMaster" WHERE "CircleCode" = $1 AND "IsDisabled"=false
`;
        let result = await pool.query(query, [circleCode]);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchDistrictDrpdwn = async (divisionCode) => {
    try {
        let query = `SELECT "DistrictName","DistrictCode" FROM "LKP"."ZoneMaster" WHERE "DivisionCode" = $1 AND "IsDisabled"=false
`;
        let result = await pool.query(query, [divisionCode]);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchTalukDrpdwn = async (districtCode) => {
    try {
        let query = `SELECT "Taluk","TalukCode" FROM "LKP"."ZoneMaster" WHERE "DistrictCode" = $1 "IsDisabled"=false
`;
        let result = await pool.query(query, [districtCode]);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchStationDrpdwn = async (talukCode) => {
    try {
        let query = `SELECT "StationName","StationNameCode" FROM "LKP"."ZoneMaster" WHERE "TalukCode" = $1 AND "IsDisabled"=false
`;
        let result = await pool.query(query, [talukCode]);
        return result.rows
    } catch (error) {
        throw error
    }
}


export const FetchGenderDrpdwn = async () => {
    try {
        let query = `SELECT "GenderName","GenderId" FROM "LKP"."Gender" WHERE "IsDisabled"=false`;
        let result = await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchRoleDrpdwn = async () => {
    try {
        let query = `SELECT "RoleName","RoleCode" FROM "LKP"."Role" WHERE "IsDisabled"=false
`;
        let result = await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}





export const insertUser = async (client, data) => {

    const query = `
        INSERT INTO "DATA"."User"
        (
            "FirstName",
            "LastName",
            "MobileNumber",
            "Email",
            "Password",
            "RoleId",
            "GenderId",
            "CreatedByUserName",
            "UpdatedByUserName"
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$8)
        RETURNING "UserId";
    `;

    const values = [
        data.firstName,
        data.lastName,
        data.mobileNumber,
        data.email,
        data.password,
        data.roleId,
        data.genderId,
        data.createdByUserName
    ];

    const result = await client.query(query, values);

    return result.rows[0].UserId;
};


export const getZoneMasterId = async (client, zone) => {

    const query = `
        SELECT "ZoneMasterId"
        FROM "LKP"."ZoneMaster"
        WHERE
            "ZoneName"=$1
            AND "CircleName"=$2
            AND "DivisionName"=$3
            AND "DistrictName"=$4
            AND "Taluk"=$5
            AND "StationName"=$6
            AND "IsDisabled"=false
        LIMIT 1;
    `;

    const values = [
        zone.zoneName,
        zone.circleName,
        zone.divisionName,
        zone.districtName,
        zone.taluk,
        zone.stationName
    ];

    const result = await client.query(query, values);

    return result.rows[0];
};


export const insertUserZoneAccess = async (client, userId, zoneMasterId, createdByUserId) => {

    const query = `
        INSERT INTO "DATA"."UserZoneAccess"
        (
            "UserId",
            "ZoneMasterId",
            "CreatedAt",
            "CreatedByUserId",
            "UpdatedAt",
            "UpdatedByUserId"
        )
        VALUES
        ($1,$2,NOW(),$3,NOW(),$3);
    `;

    await client.query(query, [
        userId,
        zoneMasterId,
        createdByUserId
    ]);
};
