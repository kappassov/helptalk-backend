import express from "express";
import controller from "../controllers/openai.controller";
import authMiddleware from "../middlewares/auth-middleware";
const router = express.Router();

router.post("/openai", authMiddleware, controller.sendPrompt);

export = router;
