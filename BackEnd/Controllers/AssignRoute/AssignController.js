import { fetchZoneDropdown, fetchAssignRoute, fecthAssignDriver, InsertAssignRoute, fecthDriverAssignedDetails } from "../../Models/AssignModel/assignModel.js"

export const fetchAssignDpdwn = async (req, res) => {
    const { flagId, ZoneMasterId } = req.body
    try {
        let result

        if (parseInt(flagId) === 1) {
            result = await fetchZoneDropdown()
        } else if (parseInt(flagId) === 2) {
            result = await fetchAssignRoute(ZoneMasterId)
        } else if (parseInt(flagId) === 3) {
            result = await fecthAssignDriver()
        } else {
            return res.status(404).json({ status: false, message: "Flagid is Requireed" })
        }

        return res.status(200).json({ status: false, message: "Dropdown Fetched Successfully", result })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

export const insertAssigneRoutesForDriver = async (req, res) => {

    const {
        flagId,
        ZoneMasterId,
        RoutePlanId,
        DriverDetailId,
        CreatedByUserId
    } = req.body;

    try {

        //==========================================
        // Flag Validation
        //==========================================

        if (parseInt(flagId) !== 1) {
            return res.status(400).json({
                status: false,
                message: "Invalid FlagId."
            });
        }

        //==========================================
        // Zone Validation
        //==========================================

        if (!ZoneMasterId) {
            return res.status(400).json({
                status: false,
                message: "ZoneMasterId is required."
            });
        }

        //==========================================
        // Route Validation
        //==========================================

        if (!RoutePlanId) {
            return res.status(400).json({
                status: false,
                message: "RoutePlanId is required."
            });
        }

        //==========================================
        // Driver Validation
        //==========================================

        if (!DriverDetailId) {
            return res.status(400).json({
                status: false,
                message: "DriverDetailId is required."
            });
        }

        //==========================================
        // User Validation
        //==========================================

        if (!CreatedByUserId) {
            return res.status(400).json({
                status: false,
                message: "CreatedByUserId is required."
            });
        }

        //==========================================
        // Insert
        //==========================================

        const result = await InsertAssignRoute({
            ZoneMasterId,
            RoutePlanId,
            DriverDetailId,
            CreatedByUserId
        });

        return res.status(200).json({
            status: true,
            message: "Assigned Route Inserted Successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }

};


export const fetchAssignRouteDetails = async (req, res) => {

    const { flagId, DriverDetailId } = req.body;

    try {

        //=========================================
        // Flag Validation
        //=========================================

        if (parseInt(flagId) !== 1) {
            return res.status(400).json({
                status: false,
                message: "FlagId is required."
            });
        }

        //=========================================
        // Driver Validation
        //=========================================

        if (!DriverDetailId) {
            return res.status(400).json({
                status: false,
                message: "DriverDetailId is required."
            });
        }

        //=========================================
        // Fetch Data
        //=========================================

        const result = await fecthDriverAssignedDetails(DriverDetailId);

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "No Route Assigned for this Driver."
            });
        }

        return res.status(200).json({
            status: true,
            message: "Assigned Route Details Fetched Successfully.",
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }

};

