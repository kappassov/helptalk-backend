export {};
const prisma = require("../models/prisma-client");

class SpecializationController{
    static getSpecializations = async (req, res) => {
        try {
            const post = await prisma.specialization.findMany()
            res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = SpecializationController;