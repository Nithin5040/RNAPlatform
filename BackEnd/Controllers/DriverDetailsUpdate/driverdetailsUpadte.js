import { updateDriverDetails } from "../../Models/DriverDetailFetch/driverdetailsfetch.js";

export const UpdateDriverDetails = async (req, res) => {
    const { flagId, DriverName, MobileNumber, TruckNumber, OdometerReading ,DriverDetailId} = req.body
    try {
        if (!flagId) {
            return res.status(400).json({
                status: false,
                message: "Please enter flagId"
            });
        }

        if (Number(flagId) === 2) {
            const result = await updateDriverDetails(DriverName,MobileNumber, TruckNumber, OdometerReading,DriverDetailId);

            return res.status(200).json({
                status: true,
                message: "Driver Details Updated Successfully"
              
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