import { Router } from "express";
import { leitorSchema } from "@biblioteca/shared";
import { readerController } from "../controllers/readerController";
import { validarBody } from "../middlewares/validarSchema";

const router = Router();
router.get("/", readerController.list);
router.get("/:id", readerController.get);
router.post("/", validarBody(leitorSchema), readerController.create);
router.put("/:id", validarBody(leitorSchema), readerController.update);
router.delete("/:id", readerController.remove);
export default router;
