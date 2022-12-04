export {};
const prisma = require("../models/prisma-client");

class SpecializationController{
    static getSpecializations = async (req, res) => {
        try {
            const specializations = await prisma.specialization.findMany();
            res.status(201).json(specializations);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = SpecializationController;