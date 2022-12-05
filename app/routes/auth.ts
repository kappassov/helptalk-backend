export {};
const express = require("express");
const UserController  = require("../controllers/user.controller");

const authRouter = express.Router();

authRouter.post("/login", UserController.login);

authRouter.post("/loginGoogle", UserController.loginByGoogle);

authRouter.post("/register/patient", UserController.register_patient);

authRouter.post("/register/specialist", UserController.register_specialist);

authRouter.post("/refresh", UserController.refresh);

authRouter.get("/loginByAccessToken", UserController.loginByAccessToken);

module.exports = authRouter;
