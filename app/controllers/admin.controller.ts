export {};
const express = require("express");
const prisma = require("../models/prisma-client");

class AdminController{
    static getSpecialists = async (req, res) => {
        try {
            const post = await prisma.specialist.findMany()
            return res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static approveSpecialist = async (req, res) => {
        try {
            const {email, answer}  = req.body;

            const specialist = await prisma.specialist.findFirst({
                where: {email: email}
              })
        
            const updated = await prisma.specialist.update({
                where: { id: specialist.id },
                data: {
                    confirmed: answer,
                },
            });

            return res.status(200).json({ result: true });
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = AdminController;