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
              avatar: true,
              socialmedia: {
                select: {
                  name: true,
                },
              },
            },
          },
          specializations: true,
          ratings: true, 
          appointments: {
            select: {
              reviews: true
            }
          }
        },
      });
      return res.status(201).json(specialist);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static withdraw = async(req, res) => {
    try {
      const { email, balance } = req.body;

      const updated = await prisma.user.update({
        where: { email: email },
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

  static updateProfile = async (req, res) => {
    try {
      const { email, socialmedia_account, phone, price } = req.body;

      const specialist = await prisma.specialist.findFirst({
        where: {email: email}
      })

      const updatedSpec = await prisma.specialist.update({
        where: { id: specialist.id },
        data: {
          price: Number(price),
        },
      });

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

module.exports = SpecialistController;
