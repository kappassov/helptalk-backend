export {};
const prisma = require("../models/prisma-client");

class PatientController {
  static getPatientById = async (req, res) => {
    try {
      const { id } = req.body;
      const patient = await prisma.patient.findUnique({
        where: {
          id: id,
        },
        include: {
          user: {
            select: {
              avatar: true,
            },
          },
        },
      });

      return res.status(201).json(patient);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static getAllPatients = async (req, res) => {
    try {
      const { id } = req.body;
      const get = await prisma.patient.findMany();
      return res.status(201).json(get);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static topUp = async (req, res) => {
    try {
      const { email, balance } = req.body;

      const updated = await prisma.user.update({
        where: { email: email },
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

  static updateProfile = async (req, res) => {
    try {
      const { email, socialmedia_account, phone } = req.body;

      const updated = await prisma.user.update({
        where: { email: email },
        data: {
          socialmedia_account: socialmedia_account,
          phone: phone,
        },
      });

      return res.status(200).json(updated);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

}

module.exports = PatientController;
