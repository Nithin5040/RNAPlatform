import { pool } from "../../Config/DbConfig";

export const FetchCircleDrpdwn=async()=>{
    try {
    let query=`SELECT " CircleName","CircleCode" FROM "LKP"."ZoneMaster" WHERE "IsDisabled"=false`;
let result=await pool.query(query);
return result.rows
    } catch (error) {
        throw error 
    }
}

export const FetchDistrictDrpdwn=async()=>{
    try {
        let query=`SELECT "DistrictName","DistrictCode" FROM "LKP"."District" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchDivisionDrpdwn=async()=>{
    try {
        let query=`SELECT "DivisionName","DivisionCode" FROM "LKP"."Division" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchGenderDrpdwn=async()=>{
    try {
        let query=`SELECT "GenderName","GenderId" FROM "LKP"."Gender" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchRoleDrpdwn=async()=>{
    try {
        let query=`SELECT "RoleName","RoleCode" FROM "LKP"."Role" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}
export const FetchTalukDrpdwn=async()=>{
    try {
        let query=`SELECT "TalukName","TalukCode" FROM "LKP"."Taluk" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchZoneNameDrpdwn=async()=>{
    try {
        let query=`SELECT "ZoneName","zoneCode" FROM "LKP"."ZoneName" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}

export const FetchZoneMasterDrpdwn=async()=>{
    try {
        let query=`SELECT "ZoneName","ZoneCode" FROM "LKP"."ZoneMaster" WHERE "IsDisabled"=false`;
        let result=await pool.query(query);
        return result.rows
    } catch (error) {
        throw error
    }
}


