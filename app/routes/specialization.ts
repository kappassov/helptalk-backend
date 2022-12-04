export {};
const express = require("express");
const SpecializationController  = require("../controllers/specialization.controller");

const SpecializationRouter = express.Router();

SpecializationRouter.get("/specialization/getAll", SpecializationController.getSpecializations);

module.exports = SpecializationRouter;
