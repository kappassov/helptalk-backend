export {};
const express = require("express");
const PatientController = require("../controllers/patient.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const patientRouter = express.Router();

patientRouter.post("/patient/topUp", authMiddleware, PatientController.topUp);
patientRouter.post("/patient/updateProfile", authMiddleware, PatientController.updateProfile);
patientRouter.get("/patient/getAll", PatientController.getAllPatients);
patientRouter.post("/patient/getById", PatientController.getPatientById);

module.exports = patientRouter;
