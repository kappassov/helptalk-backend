const bcrypt = require('bcryptjs');
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
    password: string;
    first_name: string;
    last_name: string;
};

class UserController {
  static login = async (user: User) => {

    const { email, password } = user;

    const db_result = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    if (db_result == null || !bcrypt.compareSync(password, db_result.password)) {
        return {"false": "0"};
    }
  
    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
    { email: user.email},
    config.jwtSecret,
    { expiresIn: "1h" }
    );

    const role = await prisma.role.findUnique({
        where: {
            id: db_result.role_id,
        },
    });
  
    return {"true": role.name, "token": token};
  };

  static register_patient = async (patient: Patient) => {
    const { email, password, first_name, last_name } = patient;

    const role = await prisma.role.findUnique({where: {name: "patient"}});

    const user = await prisma.user.create({
        data: {
            email: email,
            password: bcrypt.hashSync(password, 8),
            role_id: role.id
        },
    });

    return prisma.patient.create({
        data: {
            first_name: first_name,
            last_name: last_name,
            email: user.email,
        },
      });
    
  };

//   static register_specialist = async (specialist: Specialist) => {

    
//   };
}

export default UserController;