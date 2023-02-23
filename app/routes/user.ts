export {};
const express = require("express");
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminRouter = express.Router();

adminRouter.get("/user/getByEmail", authMiddleware, UserController.getByEmail);

adminRouter.post("/user/uploadAvatar", UserController.upload_avatar);

module.exports = adminRouter;
