export {};
const prisma = require("../models/prisma-client");

class PatientController {
  static getPatientById = async (req, res) => {
    try {
      const { id } = req.body;
      const get = await prisma.patient.findUnique({
        where: { id: id },
      });
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

  static topUp = async (req, res) => {
    try {
      const { id, balance } = req.body;
      const patient = await prisma.patient.findUnique({
        where: { id: id },
      });

      const updated = await prisma.user.update({
        where: { email: patient.email },
        data: {
          balance: {
            increment: balance,
          },
        },
      });

      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
}

module.exports = PatientController;
