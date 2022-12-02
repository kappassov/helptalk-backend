import prisma from "../models/prisma-client";
import { Request, Response } from "express";

class AdminController{
    static getSpecialists = async (req: Request, res: Response) => {
        try {
            const post = await prisma.specialist.findMany()
            res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

export default AdminController;