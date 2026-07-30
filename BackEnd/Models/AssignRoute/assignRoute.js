import { pool } from "../../Config/DbConfig.js";

export const ZoneDrpDwn = async () => {
    try {
        let result = await pool.query(`SELECT "ZoneMasterId","ZoneMasterName" FROM "LKP"."ZoneMaster" WHERE "IsDisabled"=FALSE`);
        return result.rows
    } catch (error) {
        throw error
    }
}


export const AssignRoutecount = async () => {
    try {
        const query = `
        SELECT
    json_agg(data ORDER BY data."ZoneMasterId") AS "RouteStatus"
FROM
(
    SELECT
        zm."ZoneMasterId",

        json_build_object(
            'ZoneMasterId', zm."ZoneMasterId",
            'ZoneMasterName', zm."ZoneMasterName",

            'TotalAssignedCount',
                COUNT(ar."AssignRouteId"),

            'PendingCount',
                COUNT(*) FILTER
                (
                    WHERE ar."IsRouteSuccess" = TRUE
                ),

            'CompletedCount',
                COUNT(*) FILTER
                (
                    WHERE ar."IsRouteSuccess" = FALSE
                )

        ) AS data

    FROM "LKP"."ZoneMaster" zm

    LEFT JOIN "DATA"."AssignRoute" ar
        ON ar."ZoneMasterId" = zm."ZoneMasterId"

    GROUP BY
        zm."ZoneMasterId",
        zm."ZoneMasterName"

) data;
        `;

        const result = await pool.query(query);

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};


export const AssignRootFetchbasedonZoneMaster=async(ZoneMasterId)=>{
    try {
        let query=`SELECT
    COALESCE
    (
        json_agg
        (
            json_build_object
            (
                'AssignRouteId', ar."AssignRouteId",

                'RoutePlanId', ar."RoutePlanId",

                'RoutePlanPoint', rp."RoutePlanPoint",

                'DriverDetailId', ar."DriverDetailId",

                'DriverName', dd."DriverName",

                'MobileNumber', dd."MobileNumber",

                'IsRouteSuccess', ar."IsRouteSuccess",

                'StatusName',
                CASE
                    WHEN ar."IsRouteSuccess" = TRUE
                        THEN 'Pending'
                    ELSE 'Completed'
                END
            )
            ORDER BY ar."AssignRouteId"
        ),
        '[]'::json
    ) AS "Routes"

FROM "DATA"."AssignRoute" ar

INNER JOIN "DATA"."DriverDetail" dd
    ON dd."DriverDetailId" = ar."DriverDetailId"

INNER JOIN "DATA"."RoutePlan" rp
    ON rp."RoutePlanId" = ar."RoutePlanId"

WHERE ar."ZoneMasterId" = $1;`;
let result=await pool.query(query,[ZoneMasterId]);
return result.rows
    } catch (error) {
        throw error
    }
}


export const SubstationCountBasedonAssignedRoot=async(AssignRouteId)=>{
    try {
        let query=`SELECT
    json_build_object
    (
        'AssignRouteId', ar."AssignRouteId",
        'ZoneMasterId', ar."ZoneMasterId",
        'RoutePlanId', ar."RoutePlanId",
        'RoutePlanPoint', rp."RoutePlanPoint",
        'DriverDetailId', ar."DriverDetailId",
        'DriverName', dd."DriverName",
        'MobileNumber', dd."MobileNumber",

        'TotalSubStationCount',
        (
            SELECT COUNT(*)
            FROM "DATA"."RouteStationStatus" rss
            WHERE rss."AssignRouteId" = ar."AssignRouteId"
        ),

        'PendingCount',
        (
            SELECT COUNT(*)
            FROM "DATA"."RouteStationStatus" rss
            WHERE rss."AssignRouteId" = ar."AssignRouteId"
              AND rss."StatusId" = 1
        ),

        'CompletedCount',
        (
            SELECT COUNT(*)
            FROM "DATA"."RouteStationStatus" rss
            WHERE rss."AssignRouteId" = ar."AssignRouteId"
              AND rss."StatusId" = 3
        ),

        'SubStations',
        (
            SELECT
                COALESCE
                (
                    json_agg
                    (
                        json_build_object
                        (
                            'ExcelDataId', rss."ExcelDataId",
                            'StationName', ed."Station",
                            'VoltageClass', ed."VoltageClass",
                            'SubStationAddress', ed."SubStationAddress",
                            'Taluk', ed."Taluk",
                            'InChargeAEJEName', ed."InChangreAEJEname",
                            'PinCode', ed."PinCode",
                            'ContactNumber', ed."ContactNumber",
                            'StatusId', rss."StatusId",
                            'StatusName',
                            CASE
                                WHEN rss."StatusId" = 1 THEN 'Pending'
                                WHEN rss."StatusId" = 3 THEN 'Completed'
                            END
                        )
                        ORDER BY rss."ExcelDataId"
                    ),
                    '[]'::json
                )
            FROM "DATA"."RouteStationStatus" rss
            INNER JOIN "DATA"."ExcelData" ed
                ON ed."ExcelDataId" = rss."ExcelDataId"
            WHERE rss."AssignRouteId" = ar."AssignRouteId"
        )

    ) AS "RouteDetails"

FROM "DATA"."AssignRoute" ar

INNER JOIN "DATA"."DriverDetail" dd
    ON dd."DriverDetailId" = ar."DriverDetailId"

INNER JOIN "DATA"."RoutePlan" rp
    ON rp."RoutePlanId" = ar."RoutePlanId"

WHERE ar."AssignRouteId" = $1;`;
let result=await pool.query(query,[AssignRouteId])
return result.rows
    } catch (error) {
        throw error
    }
}







