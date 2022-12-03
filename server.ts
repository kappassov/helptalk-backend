import openaiRouter from "./app/routes/openai";
import { PrismaClient } from "@prisma/client";
import authRouter from "./app/routes/auth";
import adminRouter from "./app/routes/admin";
import cookieParser from "cookie-parser";
import bookingRouter from "./app/routes/booking";
import errorMiddleware from "./app/middlewares/error-middleware";
import authMiddleware from "./app/middlewares/auth-middleware";
const express = require("express");
const cors = require("cors");
const app = express();

const prisma = new PrismaClient();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", openaiRouter);
app.use("/", authRouter);
app.use("/", bookingRouter);
app.use("/", adminRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "SENIOR PROJECT BACKEND" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "HIII" });
});

try {
  app.listen(PORT, () => console.log("Listening on port %s", PORT));
} catch (e) {
  console.log(e);
}
