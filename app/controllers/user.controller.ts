import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import prisma from "../models/prisma-client";
import config from "../config/config";

export type User = {
    email: string;
    password: string;
    role_id: number;
  };

class UserController {
  static login = async (user: User) => {

    const { email, password } = user;
    
    const db_result = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    
    if (db_result != null && db_result.password != password) {
        return {"false": "0"};
    }
  
    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
    { email: user.email},
    config.jwtSecret,
    { expiresIn: "1h" }
    );
  
    return {"true": db_result.role_id};
  };
}

export default UserController;