import { Router } from "express";
import { autorSchema } from "@biblioteca/shared";
import { authorController } from "../controllers/authorController";
import { validarBody } from "../middlewares/validarSchema";

const router = Router();
router.get("/", authorController.list);
router.get("/:id", authorController.get);
router.post("/", validarBody(autorSchema), authorController.create);
router.put("/:id", validarBody(autorSchema), authorController.update);
router.delete("/:id", authorController.remove);
export default router;
