import type { Request, Response, NextFunction } from "express";
import { readerService } from "../services/readerService";
import { ApiError } from "../errors/ApiError";

const parseId = (value: string | string[]) => {
  if (typeof value !== "string") throw new ApiError(400, "O ID informado é inválido.");
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "O ID informado Ã© invÃ¡lido.");
  return id;
};

export const readerController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await readerService.list()); } catch (error) { next(error); }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await readerService.get(parseId(req.params.id))); } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await readerService.create(req.body)); } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await readerService.update(parseId(req.params.id), req.body)); } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try { await readerService.remove(parseId(req.params.id)); res.status(204).send(); } catch (error) { next(error); }
  },
};

