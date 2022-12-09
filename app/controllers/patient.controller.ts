export {};
const prisma = require("../models/prisma-client");

class PatientController {
  static getPatientById = async (req, res) => {
    try {
      const { id } = req.body;
      console.log(id);
      const get = await prisma.patient.findUnique({
        where: { id: id },
      });
      console.log("gmm");
      console.log(get);
      res.status(201).json(get);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
  static getAllPatients = async (req, res) => {
    try {
      const { id } = req.body;
      const get = await prisma.patient.findMany();
      res.status(201).json(get);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
}

module.exports = PatientController;
