import type { Request, Response, NextFunction } from "express";
import { loanService } from "../services/loanService";
import { ApiError } from "../errors/ApiError";

const parseId = (value: string | string[]) => {
  if (typeof value !== "string") throw new ApiError(400, "O ID informado é inválido.");
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "O ID informado Ã© invÃ¡lido.");
  return id;
};

export const loanController = {
  list: async (_req: Request, res: Response, next: NextFunction) => {
    try { res.json(await loanService.list()); } catch (error) { next(error); }
  },
  get: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await loanService.get(parseId(req.params.id))); } catch (error) { next(error); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try { res.status(201).json(await loanService.create(req.body)); } catch (error) { next(error); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try { res.json(await loanService.update(parseId(req.params.id), req.body)); } catch (error) { next(error); }
  },
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try { await loanService.remove(parseId(req.params.id)); res.status(204).send(); } catch (error) { next(error); }
  },
};

