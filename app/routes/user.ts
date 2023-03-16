export {};
const express = require("express");
const UserController  = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const userRouter = express.Router();

userRouter.get("/user/getByEmail", authMiddleware, UserController.getByEmail);
userRouter.post("/user/uploadAvatar", UserController.uploadAvatar);


module.exports = userRouter;
