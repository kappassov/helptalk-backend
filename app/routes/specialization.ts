export {};
const express = require("express");
const SpecializationController  = require("../controllers/specialization.controller");

const SpecializationRouter = express.Router();

SpecializationRouter.post("/specialization/getAll", SpecializationController.getSpecializations);

module.exports = SpecializationRouter;
