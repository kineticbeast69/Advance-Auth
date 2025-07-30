import express from "express";
import { userDetails } from "../controller/user.controller.js";
import { authUserMiddleware } from "../middlewares/authUser.middleware.js";
const UserRoute = express.Router();

UserRoute.get("/user-details", authUserMiddleware, userDetails);

export default UserRoute;
