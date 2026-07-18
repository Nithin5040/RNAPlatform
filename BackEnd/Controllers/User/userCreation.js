import { FetchZoneNameDrpdwn, FetchCircleDrpdwn, FetchDivisionDrpdwn, FetchDistrictDrpdwn, FetchTalukDrpdwn, FetchGenderDrpdwn, FetchRoleDrpdwn } from "../../Models/UserCreation/User.js"
import {pool} from "../../Config/DbConfig.js";

import {
    insertUser,
    getZoneMasterId,
    insertUserZoneAccess
} from "../../Models/UserCreation/User.js";


export const userCreationDropDown = async (req, res) => {
    const { flagId, zoneCode, circleCode, divisionCode, districtCode } = req.body
    try {
        let result

        if (parseInt(flagId) === 1) {
            result = await FetchZoneNameDrpdwn()
        } else if (parseInt(flagId) === 2) {
            result = await FetchCircleDrpdwn(zoneCode)
        } else if (parseInt(flagId) === 3) {
            result = await FetchDivisionDrpdwn(circleCode)
        } else if (parseInt(flagId) === 4) {
            result = await FetchDistrictDrpdwn(divisionCode)
        } else if (parseInt(flagId) === 5) {
            result = await FetchTalukDrpdwn(districtCode)
        } else if (parseInt(flagId) === 6) {
            result = await FetchGenderDrpdwn()
        } else if (parseInt(flagId) === 7) {
            result = await FetchRoleDrpdwn()
        } else {
            return res.status(404).json({ status: false, message: "FlagID is Required" })
        }

        return res.status(200).json({ status: true, message: "Dropdown Fetched Successfully.", result })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server" })
    }
}


export const insertUserCreation = async (req, res) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const {
            firstName,
            lastName,
            mobileNumber,
            email,
            password,
            roleId,
            genderId,
            createdByUserName,
            createdByUserId,
            zoneAccess
        } = req.body;

        //------------------------------------
        // Hash Password
        //------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        //------------------------------------
        // Insert User
        //------------------------------------

        const userId = await insertUser(client, {
            firstName,
            lastName,
            mobileNumber,
            email,
            password: hashedPassword,
            roleId,
            genderId,
            createdByUserName
        });

        //------------------------------------
        // Insert Zone Access
        //------------------------------------

        for (const zone of zoneAccess) {

            const zoneData = await getZoneMasterId(client, zone);

            if (!zoneData) {

                await client.query("ROLLBACK");

                return res.status(404).json({
                    status: false,
                    message: `Zone mapping not found for Station : ${zone.stationName}`
                });
            }

            await insertUserZoneAccess(
                client,
                userId,
                zoneData.ZoneMasterId,
                createdByUserId
            );
        }

        await client.query("COMMIT");

        return res.status(201).json({
            status: true,
            message: "User created successfully."
        });

    }
    catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });

    }
    finally {

        client.release();

    }
};