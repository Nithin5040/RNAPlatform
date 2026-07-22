import { RouteInsert, FetchZones, fetchZonePoint, getRoutePlan,routeUpdate } from "../../Models/RoutePlans/Routesplan.js"


export const RoutePlanDropdown = async (req, res) => {
    const { flagId, zonemasterId } = req.body
    try {
        let result

        if (parseInt(flagId) === 1) {
            result = await FetchZones()
        } else if (parseInt(flagId) === 2) {
            result = await fetchZonePoint(zonemasterId)
        } else {
            return res.status(404).json({ status: false, message: "FlagID is Required" })
        }

        return res.status(200).json({ status: true, message: "Dropdown Fetched Successfully.", result })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server" })
    }
}


export const inserRoutePlan = async (req, res) => {

    const {
        flagId,
        ZoneMasterId,
        RouteNumber,
        CreatedByUserId
    } = req.body;

    try {

        if (parseInt(flagId) !== 1) {
            return res.status(400).json({
                status: false,
                message: "Invalid FlagId."
            });
        }

        if (!ZoneMasterId) {
            return res.status(400).json({
                status: false,
                message: "Zone is required."
            });
        }

        if (!RouteNumber) {
            return res.status(400).json({
                status: false,
                message: "Route Number is required."
            });
        }

        if (!CreatedByUserId) {
            return res.status(400).json({
                status: false,
                message: "CreatedByUserId is required."
            });
        }

        const result = await RouteInsert({
            ZoneMasterId,
            RouteNumber,
            CreatedByUserId
        });

        return res.status(201).json({
            status: true,
            message: "Route Plan created successfully."
        });

    }
    catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }

};
export const fetchRoutePlan = async (req, res) => {
    const { flagId } = req.body
    try {
        let result

        if (parseInt(flagId) === 1) {
            result = await getRoutePlan()

        } else {
            return res.status(404).json({ status: false, message: "FlagID is Required" })
        }
        return res.status(200).json({ status: true, message: "The RoutePlan Data Fetched Successfully", result })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error." })
    }
}
export const updateRoutePlan = async (req, res) => {

    const {
        flagId,
        RoutePlanId,
        ZoneMasterId,
        RoutePlanPoint
    } = req.body;

    try {

        if (Number(flagId) !== 1) {
            return res.status(400).json({
                status: false,
                message: "Invalid FlagId."
            });
        }

        if (!RoutePlanId) {
            return res.status(400).json({
                status: false,
                message: "RoutePlanId is required."
            });
        }

        if (!ZoneMasterId) {
            return res.status(400).json({
                status: false,
                message: "ZoneMasterId is required."
            });
        }

        if (!RoutePlanPoint || !RoutePlanPoint.trim()) {
            return res.status(400).json({
                status: false,
                message: "RoutePlanPoint is required."
            });
        }

        const result = await routeUpdate({
            RoutePlanId,
            ZoneMasterId,
            RoutePlanPoint: RoutePlanPoint.trim().toUpperCase()
        });

        return res.status(200).json({
            status: true,
            message: "Route Plan updated successfully."
            // result
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }

};

