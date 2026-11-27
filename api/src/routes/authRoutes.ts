import { Router } from "express";
import { cadastroSchema, loginSchema } from "@biblioteca/shared";
import { authController } from "../controllers/authController";
import { validarBody } from "../middlewares/validarSchema";

const router = Router();
router.post("/register", validarBody(cadastroSchema), authController.register);
router.post("/login", validarBody(loginSchema), authController.login);
export default router;
