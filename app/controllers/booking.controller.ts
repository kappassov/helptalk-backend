import { Prisma, PrismaClient } from '@prisma/client'
import { INTEGER } from 'sequelize'

const prisma = new PrismaClient()

class BookingController {
    static create_booking = async (req: any, res: any) => {
        try {
            const { patient_id, specialist_id, appointed_at, comments } = req.body
            const start_time = new Date(appointed_at)
            const end_time = new Date(appointed_at)
            end_time.setHours(end_time.getHours() + 1) // assume the meeting is 1 hour
            console.log(start_time);
            if (start_time < new Date()) {
                return res.status(400).json("The date is in the past.")
            }
            const room = await prisma.room.create({
                data: {
                    name: "video-room"
                },
            });
            const post = await prisma.appointment.create({
                data: {
                    patient: { connect: { id: patient_id } },
                    specialist: { connect: { id: specialist_id } },
                    appointed_at,
                    end_time: end_time,
                    comments,
                    room: { connect: { id: room.id } },
                    approved: false
                },
            });
            return res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static update_booking = async (req: any, res: any) => {
        try {
            const { id, appointed_at, comments, approved } = req.body
            const post = await prisma.appointment.update({
                where: {id: id},
                data: {
                    appointed_at,
                    comments,
                    approved,
                },
            })
            return res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static delete_booking = async (req: any, res: any) => {
        try {
            const { id, appointed_at, comments, approved } = req.body
            const post = await prisma.appointment.delete({
                where: {id: id},
            })
            res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static approve_booking = async (req: any, res: any) => {
        try {
            const { id} = req.body
            const result:any = await prisma.$queryRaw(Prisma.sql`
            select f1.*
            from "public"."Appointment" f1
            where not exists (select 1
              from "public"."Appointment" f2
              where tsrange(f2.appointed_at, f2.end_time, '[]') && tsrange(f1.appointed_at, f1.end_time, '[]')
                and f2.id <> f1.id )
            ;`)
            var conflict = true
            for (var r of result) {
                if(r.id == id)
                    conflict = false
            }
            if( conflict == true ) {
                res.status(400).json("Conflicting appointments")
            }
            const post = await prisma.appointment.update({
                where: {id: id},
                data: {
                    approved: true
                },
            })
            res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

export default BookingController;