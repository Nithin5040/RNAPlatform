import * as backendHelpers from "../Helpers/Urls.js";
import loginRoute from "../Routes/UserRoute/loginRoute.js"



 const applyRoutes = (app) => {
//app.use(backendHelpers.USER_CREATION, userRoute);
app.use(backendHelpers.LOGIN_USER, loginRoute);
}


export default applyRoutes;