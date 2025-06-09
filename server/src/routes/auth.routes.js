import { Router } from "express";
const authRoutes = Router();
import { login, signup } from "../controller/auth.controller.js";
authRoutes.route("/login").post(login);
authRoutes.route("/register").post(signup);

export default authRoutes;
