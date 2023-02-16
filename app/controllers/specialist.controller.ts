export {};
const prisma = require("../models/prisma-client");

class SpecialistController {
  static getAll = async (req, res) => {
    try {
      const specialists = await prisma.specialist.findMany({
        include: {
          user: {
            select: {
              phone: true,
              socialmedia_account: true,
              socialmedia: {
                select: {
                  name: true,
                },
              },
            },
          },
          specializations: true,
        },
      });
      return res.status(201).json(specialists);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static getById = async (req, res) => {
    try {
      const { specialist_id } = req.body;
      const specialist = await prisma.specialist.findUnique({
        where: {
          id: specialist_id,
        },
        include: {
          user: {
            select: {
              phone: true,
              socialmedia_account: true,
              socialmedia: {
                select: {
                  name: true,
                },
              },
            },
          },
          specializations: true,
        },
      });
      return res.status(201).json(specialist);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static withdraw = async(req, res) => {
    try {
      const { id, balance } = req.body;
      const specialist = await prisma.specialist.findUnique({
        where: { id: id },
      });

      const updated = await prisma.user.update({
        where: { email: specialist.email },
        data: {
          balance: {
            increment: balance * (-1),
          },
        },
      });
      
      return res.status(201).json(updated);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = SpecialistController;
