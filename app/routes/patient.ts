export {};
const express = require("express");
const PatientController = require("../controllers/patient.controller");
const patientRouter = express.Router();

patientRouter.get("/patient/getAll", PatientController.getAllPatients);
patientRouter.post("/patient/getById", PatientController.getPatientById);

module.exports = patientRouter;
