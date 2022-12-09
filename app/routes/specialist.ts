export {};
const express = require("express");
const SpecialistController = require("../controllers/specialist.controller");
const specialistRouter = express.Router();

specialistRouter.get("/specialist/getAll", SpecialistController.getAll);
specialistRouter.post("/specialist/getById", SpecialistController.getById);

module.exports = specialistRouter;
