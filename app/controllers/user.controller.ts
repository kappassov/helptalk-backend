import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import prisma from "../models/prisma-client";
import config from "../config/config";

export type User = {
    email: string;
    password: string;
  };

class UserController {
  static login = async (user: User) => {

    const { email, password } = user;
    
    const db_result = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    
    if (db_result == null || db_result.password != password) {
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
  
    return {"true": role.name};
  };
}

export default UserController;