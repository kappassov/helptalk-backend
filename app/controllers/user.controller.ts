const bcrypt = require('bcryptjs');
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import prisma from "../models/prisma-client";
import config from "../config/config";

import { resolvePtr } from "dns";


export type User = {
    email: string;
    password: string;
};

export type Patient = {
    email: string;
    first_name: string;
    last_name: string;
};

class UserController {

  static login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const db_result = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (db_result == null || !bcrypt.compareSync(password, db_result.password)) {
            return res.status(201).json({"result": false});
        }

        const role = await prisma.role.findUnique({
            where: {
                id: db_result.role_id,
            },
        });
        let first_name, last_name;
        if(role.id == 1){
            const patient = await prisma.patient.findFirst({
                where: {
                    email: email,
                },
            });
            first_name = patient.first_name;
            last_name = patient.last_name;
        }else if(role.id == 2){
            const specialist = await prisma.specialist.findFirst({
                where: {
                    email: email,
                },
            });
            first_name = specialist.first_name;
            last_name = specialist.last_name;
        }else{
            first_name = "Admin";
            last_name = "Admin";
        }
    
        return res.status(201).json({"result": true, "role": role.name, "first_name": first_name, "last_name": last_name, "token": this.jwt_creation(email)});
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
  };

  static register_patient = async (req: Request, res: Response) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        const role = await prisma.role.findUnique({where: {name: "patient"}});

        const user = await prisma.user.create({
            data: {
                email: email,
                password: bcrypt.hashSync(password, 8),
                role_id: role.id,
                patients: {
                    create: [
                        {
                            first_name: first_name,
                            last_name: last_name,
                        }
                    ],
                }
            },
        });

    
        return res.status(201).json({"result": true, "name": first_name, "token": this.jwt_creation(email)});
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
  };

  // Sing JWT, valid for 1 hour
  static jwt_creation = (email: string) => {
    return jwt.sign(
        { email: email},
        config.jwtSecret,
        { expiresIn: "1h" }
    );
  };

//   static register_specialist = async (specialist: Specialist) => {

    
//   };
}

export default UserController;