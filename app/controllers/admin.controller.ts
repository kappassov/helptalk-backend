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
}

module.exports = AdminController;