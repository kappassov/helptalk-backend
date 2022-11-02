import express from "express";
import controller from "../controllers/openai.controller";
const router = express.Router();

router.post("/openai", controller.sendPrompt);

export = router;
