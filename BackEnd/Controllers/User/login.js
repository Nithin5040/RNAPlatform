import bcrypt from "bcrypt";
import { findUserByMobileNumber } from "../../Models/Login/login.js";

export const login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        // Validation
        if (!mobileNumber || !password) {
            return res.status(400).json({
                status: false,
                message: "Mobile number and password are required."
            });
        }

        // Find user
        const user = await findUserByMobileNumber(mobileNumber);

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid mobile number or password."
            });
        }

        // Check if user is disabled
        if (user.IsDisabled) {
            return res.status(403).json({
                status: false,
                message: "Your account has been disabled. Please contact the administrator."
            });
        }

        // Compare password
        const passwordMatched = await bcrypt.compare(password, user.Password);

        if (!passwordMatched) {
            return res.status(401).json({
                status: false,
                message: "Invalid mobile number or password."
            });
        }

        // Remove password before sending response
        delete user.Password;

        return res.status(200).json({
            status: true,
            message: "Login successful.",
            data: user
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};