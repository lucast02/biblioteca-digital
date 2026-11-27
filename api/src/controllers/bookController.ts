import type { Request, Response, NextFunction } from "express";
import { bookService } from "../services/bookService";
import { ApiError } from "../errors/ApiError";

const parseId = (value: string | string[]) => {
  if (typeof value !== "string") throw new ApiError(400, "O ID informado é inválido.");
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "O ID informado Ã© invÃ¡lido.");
  return id;
};

export const bookController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await bookService.list()); } catch (error) { next(error); }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await bookService.get(parseId(req.params.id))); } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await bookService.create(req.body)); } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await bookService.update(parseId(req.params.id), req.body)); } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try { await bookService.remove(parseId(req.params.id)); res.status(204).send(); } catch (error) { next(error); }
  },
};

