export {};
const express = require("express");
const AdminController  = require("../controllers/admin.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminRouter = express.Router();

adminRouter.get("/admin/getAll", authMiddleware, AdminController.getSpecialists);
adminRouter.post("/admin/approveSpecialist", authMiddleware, AdminController.approveSpecialist);

module.exports = adminRouter;
