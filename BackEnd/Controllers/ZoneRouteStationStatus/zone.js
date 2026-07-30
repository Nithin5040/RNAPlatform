import { ZoneDrpDwn, AssignRoutecount, AssignRootFetchbasedonZoneMaster, SubstationCountBasedonAssignedRoot } from "../../Models/AssignRoute/assignRoute.js";



export const zoneDrpDwn = async (req, res) => {
    const { flagId } = req.body
    try {
        if (!flagId) {
            return res.status(400).json({
                status: false,
                message: "Please enter flagId"
            });
        }

        if (Number(flagId) === 1) {
            const result = await ZoneDrpDwn();

            return res.status(200).json({
                status: true,
                message: "Zone Master DropDown Fetched Successfully",
                data: result

            });
        }

        return res.status(400).json({
            status: false,
            message: "Please enter a valid flagId"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const assignRoutescount = async (req, res) => {
    const { flagId } = req.body
    try {
        if (!flagId) {
            return res.status(400).json({
                status: false,
                message: "Please enter flagId"
            });
        }

        else if (Number(flagId) === 2) {
            const result = await AssignRoutecount();

            return res.status(200).json({
                status: true,
                message: "AssignRouteStatuscount data Fetched Successfully",
                data: result

            });
        }
        return res.status(400).json({
            status: false,
            message: "Please enter a valid flagId"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}


export const assignRootFetchbasedonZoneMaster = async (req, res) => {
    const { flagId, ZoneMasterId } = req.body
    try {
        if (!flagId) {
            return res.status(400).json({
                status: false,
                message: "Please enter flagId"
            });
        }

        else if (Number(flagId) === 3) {
            const result = await AssignRootFetchbasedonZoneMaster(ZoneMasterId);

            return res.status(200).json({
                status: true,
                message: "AssignRouteFetch details Fetched Successfully",
                data: result

            });
        }
        return res.status(400).json({
            status: false,
            message: "Please enter a valid flagId"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }


}

export const substationCountBasedonAssignedRoot = async (req, res) => {
    const { flagId, AssignRouteId } = req.body

    try {
        if (!flagId) {
            return res.status(400).json({
                status: false,
                message: "Please enter flagId"
            });
        }

        if (Number(flagId) === 4) {
            const result = await SubstationCountBasedonAssignedRoot(AssignRouteId);

            return res.status(200).json({
                status: true,
                message: "SubStationCount and Details Fetched Successfully",
                data: result

            });
        }
        return res.status(400).json({
            status: false,
            message: "Please enter a valid flagId"
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}