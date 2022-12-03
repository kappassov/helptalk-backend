import ApiError from "../services/error";

const bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import prisma from "../models/prisma-client";
import Token from "../services/token";

class UserController {
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const db_result = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (
        db_result == null ||
        !bcrypt.compareSync(password, db_result.password)
      ) {
        return res.status(201).json({ result: false });
      }

      const role = await prisma.role.findUnique({
        where: {
          id: db_result.role_id,
        },
      });
      let first_name, last_name;
      if (role.name == "patient") {
        const patient = await prisma.patient.findFirst({
          where: {
            email: email,
          },
        });
        first_name = patient.first_name;
        last_name = patient.last_name;
      } else if (role.name == "specialist") {
        const specialist = await prisma.specialist.findFirst({
          where: {
            email: email,
          },
        });
        first_name = specialist.first_name;
        last_name = specialist.last_name;
      } else {
        first_name = "Admin";
        last_name = "Admin";
      }
      const refreshToken = db_result.token;
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json({
        result: true,
        role: role.name,
        first_name: first_name,
        last_name: last_name,
        token: Token.generateToken({ email }),
      });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static register_patient = async (req: Request, res: Response) => {
    try {
      const { email, password, first_name, last_name } = req.body;
      const role = await prisma.role.findUnique({ where: { name: "patient" } });
      const { accessToken, refreshToken } = Token.generateToken({
        email,
      });

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
              },
            ],
          },
          token: refreshToken,
        },
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json({
        result: true,
        first_name: first_name,
        last_name: last_name,
        token: { accessToken, refreshToken },
      });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static register_specialist = async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        specialization_name,
        price,
        path,
      } = req.body;

      const role = await prisma.role.findUnique({
        where: { name: "specialist" },
      });

      if (
        email == null ||
        password == null ||
        first_name == null ||
        last_name == null ||
        specialization_name == null ||
        price == null
      ) {
        return res
          .status(500)
          .json({ result: false, message: "Some parameters are missing!" });
      }
      const specialization = await prisma.specialization.findUnique({
        where: { name: specialization_name },
      });

      if (specialization == null) {
        return res
          .status(404)
          .json({ result: false, message: "Specialization is not found!" });
      }
      const { accessToken, refreshToken } = Token.generateToken({
        email,
      });
      const user = await prisma.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 8),
          role_id: role.id,
          specialists: {
            create: [
              {
                first_name: first_name,
                last_name: last_name,
                price: Number(price),
                confirmed: false,
                specialization: {
                  connect: {
                    id: specialization.id,
                  },
                },
                documents: {
                  create: [
                    {
                      path: path,
                    },
                  ],
                },
              },
            ],
          },
          token: refreshToken,
        },
      });

      return res.status(201).json({
        result: true,
        first_name: first_name,
        last_name: last_name,
        token: { accessToken, refreshToken },
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  static loginByAccessToken = async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    console.log("loginByAccessToken");
    console.log(accessToken);
    const userData = Token.validateAccessToken(accessToken);
    console.log(userData);
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }
    const db_result = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (db_result == null) {
      return res.status(201).json({ result: false });
    }

    const role = await prisma.role.findUnique({
      where: {
        id: db_result.role_id,
      },
    });
    let first_name, last_name;
    if (role.name == "patient") {
      const patient = await prisma.patient.findFirst({
        where: {
          email: userData.email,
        },
      });
      first_name = patient.first_name;
      last_name = patient.last_name;
    } else if (role.name == "specialist") {
      const specialist = await prisma.specialist.findFirst({
        where: {
          email: userData.email,
        },
      });
      first_name = specialist.first_name;
      last_name = specialist.last_name;
    } else {
      first_name = "Admin";
      last_name = "Admin";
    }

    return res.status(201).json({
      result: true,
      role: role.name,
      first_name: first_name,
      last_name: last_name,
      email: userData.email,
      token: Token.generateToken({ email: userData.email }),
    });
  };

  static refresh = async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      console.log("refreshing");
      console.log(refreshToken);
      if (!refreshToken) {
        return res.status(401).json({ message: "error" });
      }
      const userData = Token.validateRefreshToken(refreshToken);
      console.log(userData);
      if (!userData) {
        return res.status(401).json({ message: "error" });
      }
      const userFromDb = await prisma.user.findFirst({
        where: {
          email: userData.email,
        },
      });
      if (userFromDb == null) {
        return res.status(201).json({ result: false });
      }

      const role = await prisma.role.findUnique({
        where: {
          id: userFromDb.role_id,
        },
      });
      let first_name, last_name;
      if (role.name == "patient") {
        const patient = await prisma.patient.findFirst({
          where: {
            email: userData.email,
          },
        });
        first_name = patient.first_name;
        last_name = patient.last_name;
      } else if (role.name == "specialist") {
        const specialist = await prisma.specialist.findFirst({
          where: {
            email: userData.email,
          },
        });
        first_name = specialist.first_name;
        last_name = specialist.last_name;
      } else {
        first_name = "Admin";
        last_name = "Admin";
      }
      const { accessToken, refreshToken: newRefreshToken } =
        Token.generateToken({
          email: userFromDb.email,
        });
      prisma.user.update({
        where: { email: userData.email },
        data: {
          token: newRefreshToken,
        },
      });
      console.log("everythings fine");
      console.log(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json({
        accessToken,
        newRefreshToken,
        userFromDb,
        role: role.name,
        first_name: first_name,
        last_name: last_name,
        email: userData.email,
      });
    } catch (e) {
      throw e;
    }
  };
}

export default UserController;
