import { PrismaClient } from '@prisma/client'

const express = require('express');
const book = express.Router();
const prisma = new PrismaClient()

book.get("/create", async (req: any, res: any) => {
    const { patient_id, specialist_id, room_id, appointed_at, comments, approved } = req.body
    const post = await prisma.appointment.create({
        data: {
            patient: { connect: { id: patient_id } },
            specialist: { connect: { id: specialist_id } },
            appointed_at,
            comments,
            room: { connect: { id: room_id } },
            approved,
        },
        })
    res.json(post)
});

book.get("/update", async (req: any, res: any) => {
    const { id, appointed_at, comments, approved } = req.body
    const post = await prisma.appointment.update({
        where: {id: id},
        data: {
            appointed_at,
            comments,
            approved,
        },
        })
    res.json(post)
});

book.get("/delete", async (req: any, res: any) => {
    const { id, appointed_at, comments, approved } = req.body
    const post = await prisma.appointment.delete({
        where: {id: id},
    })
    res.json(post)
});

export {book}