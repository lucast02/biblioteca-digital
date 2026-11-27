import type { Request, Response, NextFunction } from "express";
import { authorService } from "../services/authorService";
import { ApiError } from "../errors/ApiError";

const parseId = (value: string | string[]) => {
  if (typeof value !== "string") throw new ApiError(400, "O ID informado é inválido.");
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "O ID informado Ã© invÃ¡lido.");
  return id;
};

export const authorController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await authorService.list()); } catch (error) { next(error); }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await authorService.get(parseId(req.params.id))); } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await authorService.create(req.body)); } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await authorService.update(parseId(req.params.id), req.body)); } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try { await authorService.remove(parseId(req.params.id)); res.status(204).send(); } catch (error) { next(error); }
  },
};

