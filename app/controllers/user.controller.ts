import { userInfo } from "os";
import { stringify } from "querystring";

export {};
const ApiError = require("../services/error");

const bcrypt = require("bcryptjs");
const Token = require("../services/token");
const prisma = require("../models/prisma-client");

class UserController {
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("login");
      console.log(email, password);
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
      let first_name, last_name, id;
      if (role.name == "patient") {
        const patient = await prisma.patient.findFirst({
          where: {
            email: email,
          },
        });
        id = patient.id;
        first_name = patient.first_name;
        last_name = patient.last_name;
      } else if (role.name == "specialist") {
        const specialist = await prisma.specialist.findFirst({
          where: {
            email: email,
          },
        });
        id = specialist.id;
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
        id: id,
        role: role.name,
        first_name: first_name,
        last_name: last_name,
        token: Token.generateToken({ email }),
      });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static loginByGoogle = async (req, res) => {
    try {
      const { email } = req.body;

      const db_result = await prisma.user.findUnique({
        where: {
          email: email,
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
      let first_name, last_name, id;
      if (role.name == "patient") {
        const patient = await prisma.patient.findFirst({
          where: {
            email: email,
          },
        });
        id = patient.id;
        first_name = patient.first_name;
        last_name = patient.last_name;
      } else if (role.name == "specialist") {
        const specialist = await prisma.specialist.findFirst({
          where: {
            email: email,
          },
        });
        id = specialist.id;
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
        id: id,
        role: role.name,
        first_name: first_name,
        last_name: last_name,
        token: Token.generateToken({ email }),
      });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static register_patient = async (req, res) => {
    try {
      console.log("is this even working");
      const { email, password, first_name, last_name, phone, socialmedia_id, socialmedia_account } = req.body;
      
      const role = await prisma.role.findUnique({ where: { name: "patient" } });

      const { accessToken, refreshToken } = Token.generateToken({
        email,
      });
      const user = await prisma.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 8),
          role_id: role.id,
          socialmedia_id: socialmedia_id,
          socialmedia_account: socialmedia_account,
          phone: phone,
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

      const patient = await prisma.patient.findFirst({
        where: {
          email: email
        }
      });
      
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json({
        result: true,
        id: patient.id,
        first_name: first_name,
        last_name: last_name,
        token: { accessToken, refreshToken },
      });
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  };

  static register_specialist = async (req, res) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        phone,
        specializations,
        socialmedia_id, 
        socialmedia_account,
        description,
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
        phone == null ||
        description == null ||
        specializations == null ||
        price == null
      ) {
        return res
          .status(500)
          .json({ result: false, message: "Some parameters are missing!" });
      }  
      const { accessToken, refreshToken } = Token.generateToken({
        email,
      });
      const user = await prisma.user.create({
        data: {
          email: email,
          password: bcrypt.hashSync(password, 8),
          phone: phone,
          socialmedia_id: socialmedia_id, 
          socialmedia_account: socialmedia_account,
          role_id: role.id,
          specialists: {
            create: [
              {
                first_name: first_name,
                last_name: last_name,
                price: Number(price),
                description: description,
                confirmed: false,
                specializations: {
                  connect: 
                    specializations.map((specialization) => {
                      return {
                        id: specialization
                      }
                    })
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

      const specialist = await prisma.specialist.findFirst({
        where: {
          email: email
        }
      });

      return res.status(201).json({
        result: true,
        id: specialist.id,
        first_name: first_name,
        last_name: last_name,
        token: { accessToken, refreshToken },
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  static loginByAccessToken = async (req, res) => {
    try {
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
    } catch (e) {
      console.log(e);
    }
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

module.exports = UserController;
