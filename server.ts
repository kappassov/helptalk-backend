import { PrismaClient } from '@prisma/client'
import authRouter from "./app/routes/auth";
const express = require("express");
const cors = require("cors");
const app = express();
import {book} from "./booking/appointment"

const prisma = new PrismaClient();



app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);

app.use("/book", book)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Listening on port %s', PORT));


