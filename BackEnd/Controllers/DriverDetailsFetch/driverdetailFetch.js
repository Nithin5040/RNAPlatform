import { FetchDrvrDetails } from "../../Models/DriverDetailFetch/driverdetailsfetch.js";

export const FetchDriverDetails = async (req, res) => {
    const { flagId } = req.body;

    try {
        if (!flagId) {
            return res.status(400).json({
                status: false,
                message: "Please enter flagId"
            });
        }

        if (Number(flagId) === 1) {
            const result = await FetchDrvrDetails();

            return res.status(200).json({
                status: true,
                message: "Driver Details Fetched Successfully",
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
};