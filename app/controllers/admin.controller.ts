export {};
const express = require("express");
const prisma = require("../models/prisma-client");
const Token = require("../services/token");

class AdminController{
    static getSpecialists = async (req, res) => {
        try {
            const post = await prisma.specialist.findMany()
            res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = AdminController;