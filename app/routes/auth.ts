import { Router, Request, Response } from "express";
import UserController from "../controllers/user.controller";

const authRouter = Router();

authRouter.post("/login", UserController.login);

authRouter.post("/register/patient", UserController.register_patient);

authRouter.post("/register/specialist", UserController.register_specialist);

authRouter.get("/refresh", UserController.refresh);

export default authRouter;
