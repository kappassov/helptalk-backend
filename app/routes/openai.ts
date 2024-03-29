export {};
const express = require("express");
const OpenaiController = require("../controllers/openai.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const openaiRouter = express.Router();

openaiRouter.post("/openai", OpenaiController.sendPrompt);

module.exports = openaiRouter;
