export const login = async (req, res) => {
    //const sessionId = crypto.randomUUID();
    try {

        const { EmployeeId, password, spocListId } = req.body;
        if (!EmployeeId || !password) {
            return res.status(400).json({
                status: false,
                message: "EmployeeId and password are required"
            });
        }

        // Get user
        const user = await getUserByEmployeeId(EmployeeId);

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Invalid EmployeeId"
            });
        }


        // Check if user account is disabled
        if (user.IsDisabled) {
            return res.status(403).json({
                status: false,
                message: "User is not active. Please contact administration."
            });
        }

        // NEW CHECK FOR ROLE
        if (user.RoleIsDisabled) {
            return res.status(403).json({
                status: false,
                message: "Your role is disabled. Please contact administrator."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Invalid password"
            });
        }


//         const existingSession = await fetchsessionId(
//     user.UserId
// );

// console.log("existingSession", existingSession);

// if (
//     existingSession.rows.length > 0 &&
//     existingSession.rows[0]?.CurrentSessionId
// ) {
//     return res.status(409).json({
//         status: false,
//         message:
//         "This account is already logged in on another device. Please logout from previous device."
//     });
// }
//spocLogin
        if (spocListId) {
            await insertLoginSpoc(user.UserId, spocListId);
        }


        // Convert BYTEA image to Base64
        let userPhotoBase64 = null;


        if (user.UserPhoto) {
            userPhotoBase64 = user.UserPhoto.toString("base64");
        }


    const formatDateTime = (date) => {
    return (
        date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0") + " " +
        String(date.getHours()).padStart(2, "0") + ":" +
        String(date.getMinutes()).padStart(2, "0") + ":" +
        String(date.getSeconds()).padStart(2, "0")
    );
};    
        let expiresIn;
        let tokenExpireTime;
console.log("ROLE ID:", user.RoleId);
        if (user.RoleId === 1) {

            // =========================================
            // Admin → always 12 hours
            // =========================================

            expiresIn = "12h";

            const futureDate = new Date(
                Date.now() + (12 * 60 * 60 * 1000)
            );

            // =========================================
            // CHANGED HERE
            // Convert into PostgreSQL format
            // YYYY-MM-DD HH:mm:ss
            // =========================================
tokenExpireTime=formatDateTime(futureDate)
            // tokenExpireTime =
            //     futureDate.getFullYear() + "-" +
            //     String(futureDate.getMonth() + 1).padStart(2, "0") + "-" +
            //     String(futureDate.getDate()).padStart(2, "0") + " " +
            //     String(futureDate.getHours()).padStart(2, "0") + ":" +
            //     String(futureDate.getMinutes()).padStart(2, "0") + ":" +
            //     String(futureDate.getSeconds()).padStart(2, "0");
            //tokenExpireTime=futureDate.toISOString()

        } else if(user.RoleId === 4){
            expiresIn = "12h";

            const futureDate = new Date(
                Date.now() + (12 * 60 * 60 * 1000)
            );

            // =========================================
            // CHANGED HERE
            // Convert into PostgreSQL format
            // YYYY-MM-DD HH:mm:ss
            // =========================================
tokenExpireTime=formatDateTime(futureDate)
            // tokenExpireTime =
            //     futureDate.getFullYear() + "-" +
            //     String(futureDate.getMonth() + 1).padStart(2, "0") + "-" +
            //     String(futureDate.getDate()).padStart(2, "0") + " " +
            //     String(futureDate.getHours()).padStart(2, "0") + ":" +
            //     String(futureDate.getMinutes()).padStart(2, "0") + ":" +
            //     String(futureDate.getSeconds()).padStart(2, "0");
          //tokenExpireTime=futureDate.toISOString()
        }
        else if (user.RoleId === 2) {

            const now = new Date();

            // =========================================
            // Login + 12 hours
            // =========================================

            const twelveHoursLater = new Date(
                now.getTime() + (12 * 60 * 60 * 1000)
            );

            twelveHoursLater.setSeconds(0, 0);

            // =========================================
            // Today's 11:59 PM
            // =========================================

            const endOfDay = new Date(now);

            endOfDay.setHours(23, 59, 0, 0);

            // =========================================
            // Earlier time wins
            // =========================================

            const finalExpiry =
                twelveHoursLater < endOfDay
                    ? twelveHoursLater
                    : endOfDay;

            // =========================================
            // JWT expiry in seconds
            // =========================================

            expiresIn = Math.floor(
                (finalExpiry.getTime() - now.getTime()) / 1000
            );

            // =========================================
            // CHANGED HERE
            // Store as string instead of Date object
            // =========================================

            tokenExpireTime =formatDateTime(finalExpiry)
                // finalExpiry.getFullYear() + "-" +
                // String(finalExpiry.getMonth() + 1).padStart(2, "0") + "-" +
                // String(finalExpiry.getDate()).padStart(2, "0") + " " +
                // String(finalExpiry.getHours()).padStart(2, "0") + ":" +
                // String(finalExpiry.getMinutes()).padStart(2, "0") + ":" +
                // String(finalExpiry.getSeconds()).padStart(2, "0");
             //tokenExpireTime=finalExpiry.toISOString()
        }
        else {

            // =========================================
            // Default roles → 12 hours
            // =========================================

            expiresIn = "12h";

            const futureDate = new Date(
                Date.now() + (12 * 60 * 60 * 1000)
            );

            // =========================================
            // CHANGED HERE
            // PostgreSQL datetime format
            // =========================================

            tokenExpireTime =formatDateTime(futureDate)
                // futureDate.getFullYear() + "-" +
                // String(futureDate.getMonth() + 1).padStart(2, "0") + "-" +
                // String(futureDate.getDate()).padStart(2, "0") + " " +
                // String(futureDate.getHours()).padStart(2, "0") + ":" +
                // String(futureDate.getMinutes()).padStart(2, "0") + ":" +
                // String(futureDate.getSeconds()).padStart(2, "0");
                     // tokenExpireTime=futureDate.toISOString()
        }


//     await pool.query(
//     `
//     UPDATE "DATA"."User"
//     SET "CurrentSessionId" = $1
//     WHERE "UserId" = $2
//     `,
//     [
//         sessionId,
//         user.UserId
//     ]
// );

        // =========================================
        // JWT TOKEN
        // =========================================

        const token = jwt.sign(
            {
                userId: user.UserId,
                employeeId: user.EmployeeId,
                roleId: user.RoleId
                //sessionId:sessionId
            },
            process.env.JWT_SECRET,
            {
                expiresIn
            }
        );
        return res.status(200).json({

            status: true,
            message: "Login successful",
            token,
            TokenExpireTime: tokenExpireTime,
            user: {
                UserId: user.UserId,
                ReportingToId:user.ReportingToId,
                FirstName: user.FirstName,
                LastName: user.LastName,
                AadharNumber: user.AadharNumber,
                DateOfJoin: user.DateOfJoin,
                Email: user.Email,
                EmployeeId: user.EmployeeId,
                //CurrentSessionId:sessionId,
                CreatedByUserId:user.CreatedByUserId,
                RoleId: user.RoleId,
                RoleName: user.RoleName,
                SiteName: user.MainSitesName,
                SiteId: user.MainSitesId,
                DistrictName: user.DistrictName,
                StateName: user.StateName,
                ReportingName: user.ReportingName,
                MobileNumber: user.MobileNumber,
                UserPhoto: [userPhotoBase64]
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }
};