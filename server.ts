const openaiRouter = require("./app/routes/openai");
const authRouter = require("./app/routes/auth");
const bookingRouter = require("./app/routes/booking");
const adminRouter = require("./app/routes/admin");
const specializationRouter = require("./app/routes/specialization");
const specialistRouter = require("./app/routes/specialist");
const socialmediaRouter = require("./app/routes/socialmedia");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./app/middlewares/error-middleware");
const authMiddleware = require("./app/middlewares/auth-middleware");
const {PrismaClient} =  require("@prisma/client");
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
app.use("/", specializationRouter);
app.use("/", socialmediaRouter);
app.use("/", specialistRouter);

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
