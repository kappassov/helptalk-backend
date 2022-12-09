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
      res.status(201).json(specialists);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static getById = async (req, res) => {
    try {
      const { specialist_id } = req.body;
      console.log(specialist_id);
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
      console.log("help");
      res.status(201).json(specialist);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
}

module.exports = SpecialistController;
