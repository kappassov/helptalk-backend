export {};
const express = require("express");
const UserController  = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminRouter = express.Router();

adminRouter.get("/user/getByEmail", authMiddleware, UserController.getByEmail);

module.exports = adminRouter;
