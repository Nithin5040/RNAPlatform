import * as backendHelpers from "../Helpers/Urls.js";
import loginRoute from "../Routes/UserRoute/loginRoute.js"
import uploadXl from "../Routes/XLUpload/Upload.js"
import userRoute from "../Routes/UserRoute/userRoute.js"
import RoutePlan from "../Routes/RoutePlan/routePlan.js"


const applyRoutes = (app) => {
    app.use(backendHelpers.USER_CREATION, userRoute);
    app.use(backendHelpers.LOGIN_USER, loginRoute);

    //this is the master excel upload screen api 
    app.use(backendHelpers.XL_UPLOAD, uploadXl)
    app.use(backendHelpers.ROUTE_PLAN, RoutePlan)


}


export default applyRoutes;