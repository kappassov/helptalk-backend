export {};
const express = require("express");
const UserController  = require("../controllers/user.controller");

const authRouter = express.Router();

authRouter.post("/login", UserController.login);

authRouter.post("/register/patient", UserController.register_patient);

authRouter.post("/register/specialist", UserController.register_specialist);

authRouter.get("/refresh", UserController.refresh);

module.exports = authRouter;
