const openaiRouter = require("./app/routes/openai");
const authRouter = require("./app/routes/auth");
const bookingRouter = require("./app/routes/booking");
const adminRouter = require("./app/routes/admin");
const specializationRouter = require("./app/routes/specialization");
const specialistRouter = require("./app/routes/specialist");
const socialmediaRouter = require("./app/routes/socialmedia");
const patientRouter = require("./app/routes/patient");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./app/middlewares/error-middleware");
const authMiddleware = require("./app/middlewares/auth-middleware");
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();

const prisma = new PrismaClient();

app.use(cors());

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
app.use("/", patientRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({ message: "SENIOR PROJECT BACKEND" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "HIII" });
});
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId)?.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId)?.emit("user-disconnected", userId);
    });
  });
  socket.once("send-chat-message", (room, message) => {
    socket.to(room).emit("chat-message", { message: message });
  });
});

try {
  server.listen(PORT, () => console.log("Listening on port %s", PORT));
} catch (e) {
  console.log(e);
}
