import { Router, Request, Response } from "express";
import UserController from "../controllers/user.controller";
import { body, validationResult } from "express-validator";

const authRouter = Router();

authRouter.post("/login", async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = req.body;
      const role = await UserController.login(user);
      return res.status(201).json(role);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
});

export default authRouter;