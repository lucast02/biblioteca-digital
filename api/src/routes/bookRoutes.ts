import { Router } from "express";
import { livroSchema } from "@biblioteca/shared";
import { bookController } from "../controllers/bookController";
import { validarBody } from "../middlewares/validarSchema";

const router = Router();
router.get("/", bookController.list);
router.get("/:id", bookController.get);
router.post("/", validarBody(livroSchema), bookController.create);
router.put("/:id", validarBody(livroSchema), bookController.update);
router.delete("/:id", bookController.remove);
export default router;
