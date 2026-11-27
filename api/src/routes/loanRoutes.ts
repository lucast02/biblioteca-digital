import { Router } from "express";
import { emprestimoSchema } from "@biblioteca/shared";
import { loanController } from "../controllers/loanController";
import { validarBody } from "../middlewares/validarSchema";

const router = Router();
router.get("/", loanController.list);
router.get("/:id", loanController.get);
router.post("/", validarBody(emprestimoSchema), loanController.create);
router.put("/:id", validarBody(emprestimoSchema), loanController.update);
router.delete("/:id", loanController.remove);
export default router;
