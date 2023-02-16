export {};
const express = require("express");
const SpecialistController = require("../controllers/specialist.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const specialistRouter = express.Router();

specialistRouter.post("/specialist/withdraw", authMiddleware, SpecialistController.withdraw);
specialistRouter.post("/specialist/updateProfile", authMiddleware, SpecialistController.updateProfile);
specialistRouter.get("/specialist/getAll", SpecialistController.getAll);
specialistRouter.post("/specialist/getById", SpecialistController.getById);

module.exports = specialistRouter;
