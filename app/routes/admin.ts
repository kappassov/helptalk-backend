import express from "express";
import controller from "../controllers/admin.controller";
import authMiddleware from "../middlewares/auth-middleware";
const router = express.Router();

router.get("/admin", authMiddleware, controller.getSpecialists);

export = router;
