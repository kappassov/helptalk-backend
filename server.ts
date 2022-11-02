import { PrismaClient } from "@prisma/client";
import authRouter from "./app/routes/auth";
import openaiRoute from "./app/routes/openai.route";
const express = require("express");
const cors = require("cors");
const app = express();
import { book } from "./booking/appointment";

const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/book", book);
app.use("/", authRouter);
app.use("/", openaiRoute);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "SENIOR PROJECT BACKEND" });
});

app.listen(PORT, () => console.log("Listening on port %s", PORT));
