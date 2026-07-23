import { pool } from "../../Config/DbConfig.js";

export const ZoneDrpDwn=async()=>{
    try {
        let result=await pool.query(`SELECT "ZoneMasterId","ZoneMasterName" FROM "LKP"."ZoneMaster" WHERE "IsDisabled"=FALSE`);
        return result.rows
    } catch (error) {
        throw error
    }
}
// export const AssignRouteStatuscount = async () => {
//     try {
//         const query = `
//             SELECT json_agg(data ORDER BY data."ZoneMasterId") AS "RouteStatus"
//             FROM (
//                 SELECT
//                     zm."ZoneMasterId",
//                     json_build_object(
//                         'ZoneMasterName', zm."ZoneMasterName",
//                         'TotalAssignedCount', COUNT(DISTINCT ar."AssignRouteId"),
//                         'PendingCount',
//                             COUNT(*) FILTER (WHERE rss."StatusId" = 1),
//                         'CompletedCount',
//                             COUNT(*) FILTER (WHERE rss."StatusId" = 3)
//                     ) AS data
//                 FROM "LKP"."ZoneMaster" zm 
//                 LEFT JOIN "DATA"."AssignRoute" ar
//                     ON ar."ZoneMasterId" = zm."ZoneMasterId"
//                 LEFT JOIN "DATA"."RouteStationStatus" rss
//                     ON rss."AssignRouteId" = ar."AssignRouteId"
//                 GROUP BY
//                     zm."ZoneMasterId",
//                     zm."ZoneMasterName"
//             ) data;
//         `;

//         const result = await pool.query(query);

//         return result.rows[0];
//     } catch (error) {
//         throw error;
//     }
// };


export const AssignRouteStatuscount = async () => {
    try {
        const query = `
            SELECT json_agg(data ORDER BY data."ZoneMasterId") AS "RouteStatus"
            FROM (
                SELECT
                    zm."ZoneMasterId",
                    json_build_object(
                        'ZoneMasterName', zm."ZoneMasterName",
                        'TotalAssignedCount', COUNT(DISTINCT ar."AssignRouteId"),
                        'PendingCount',
                            COUNT(*) FILTER (WHERE rss."StatusId" = 1),
                        'CompletedCount',
                            COUNT(*) FILTER (WHERE rss."StatusId" = 3)
                    ) AS data
                FROM "LKP"."ZoneMaster" zm
                LEFT JOIN "DATA"."AssignRoute" ar
                    ON ar."ZoneMasterId" = zm."ZoneMasterId"
                    AND ar."IsRouteSuccess" = TRUE
                LEFT JOIN "DATA"."RouteStationStatus" rss
                    ON rss."AssignRouteId" = ar."AssignRouteId"
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