import * as backendHelpers from "../Helpers/Urls.js";
import loginRoute from "../Routes/UserRoute/loginRoute.js"
import uploadXl from "../Routes/XLUpload/Upload.js"
import userRoute from "../Routes/UserRoute/userRoute.js"



 const applyRoutes = (app) => {
app.use(backendHelpers.USER_CREATION, userRoute);
app.use(backendHelpers.LOGIN_USER, loginRoute);
app.use(backendHelpers.XL_UPLOAD,uploadXl)
}


export default applyRoutes;