export {};
const prisma = require("../models/prisma-client");
import { where } from 'sequelize';
import {v4 as uuidv4} from 'uuid';

class BookingController {
  static get_all = async (req, res) => {
    try {
      const appointments = await prisma.appointment.findMany();
      return res.status(201).json(appointments);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static get_by_patient_id = async (req, res) => {
    try {
      const { id } = req.body;
      const appointment = await prisma.appointment.findMany({
        where: {
          patient_id: id,
        },
        include: {
          specialist: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
          reviews: true 
        },
      });
      return res.status(201).json(appointment);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static get_by_specialist_id = async (req, res) => {
    try {
      const { id } = req.body;
      const appointment = await prisma.appointment.findMany({
        where: {
          specialist_id: id,
        },
      });
      return res.status(201).json(appointment);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static create_booking = async (req, res) => {
      try {
          const { patient_id, specialist_id, appointed_at, comments } = req.body
          const start_time = new Date(appointed_at)
          const end_time = new Date(appointed_at)
          end_time.setHours(end_time.getHours() + 1) // assume the meeting is 1 hour
          if (start_time < new Date()) {
              return res.status(400).json("The date is in the past.")
          }

          var find = await prisma.appointment.findMany({
              where: {
                patient_id: patient_id,
                specialist_id: specialist_id,
                approved: false
              },
            })
          if(find.length != 0) {
              return res.status(400).json("You already have a pending appointment with this specialist.")
          }

          await check_conflicts(patient_id, specialist_id, start_time, end_time, res)
          
          const sufficient_balance = await check_balance(patient_id, specialist_id);
          if (sufficient_balance == false){
            return res.status(400).json("Insufficient balance, please top up!");
          }

          const post = await prisma.appointment.create({
              data: {
                  patient: { connect: { id: patient_id } },
                  specialist: { connect: { id: specialist_id } },
                  appointed_at,
                  end_time: end_time,
                  comments,
                  room_id: uuidv4(),
                  approved: false
              },
          });
          return res.status(201).json(post)
      } catch (error: any) {
          return res.status(500).json(error.message);
      }
  };

  static update_booking = async (req, res) => {
    try {
      const { id, appointed_at, comments, approved } = req.body;
      const post = await prisma.appointment.update({
        where: { id: id },
        data: {
          appointed_at,
          comments,
          approved,
        },
      });
      return res.status(201).json(post);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static delete_booking = async (req, res) => {
    try {
      const { id } = req.body;
      const appointment = await prisma.appointment.delete({
        where: { id: id },
      });
      return res.status(201).json(appointment);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static approve_booking = async (req, res) => {
    try {
      const { id } = req.body;
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: id,
        },
      });
      await check_conflicts(
        appointment.patient_id,
        appointment.specialist_id,
        appointment.appointed_at,
        appointment.end_time,
        res
      );
      
      const patient = await prisma.patient.findUnique({
        where: {
          id: appointment.patient_id,
        },
      });

      const specialist = await prisma.specialist.findUnique({
        where: {
          id: appointment.specialist_id,
        },
      });

      const updateSpecialist = await prisma.user.update({
        where: { email: specialist.email },
        data: {
          balance: {
            increment: specialist.price * 0.9,
          },
        },
      });  

      const updatePatient = await prisma.user.update({
        where: { email: patient.email },
        data: {
          balance: {
            increment: specialist.price * (-1),
          },
        },
      });  
      
      const post = await prisma.appointment.update({
        where: { id: id },
        data: {
          approved: true,
        },
      });
      return res.status(201).json(post);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };
}

module.exports = BookingController;

async function check_conflicts(
  patient_id,
  specialist_id,
  start_time,
  end_time,
  res
) {
  var find = await prisma.appointment.findMany({
    where: {
      patient_id: patient_id,
      approved: true,
    },
  });
  for (const f of find) {
    if (
      (start_time >= f.appointed_at && start_time <= f.end_time) ||
      (end_time >= f.appointed_at && end_time <= f.end_time)
    )
      res.status(400).json("Conflicting appointment.");
  }
  find = await prisma.appointment.findMany({
    where: {
      specialist_id: specialist_id,
      approved: true,
    },
  });
  for (const f of find) {
    if (
      (start_time >= f.appointed_at && start_time <= f.end_time) ||
      (end_time >= f.appointed_at && end_time <= f.end_time)
    )
      res.status(400).json("Conflicting appointment.");
  }
}


async function check_balance(
  patient_id,
  specialist_id
) {
  var patient = await prisma.patient.findUnique({
    where: {
      id: patient_id,
    },
  });
  var user = await prisma.user.findUnique({
    where:{
      email: patient.email
    }
  });

  var specialist = await prisma.specialist.findUnique({
    where: {
      id: specialist_id,
    },
  });

  if(user.balance <= specialist.price){
    return false;
  }
}
