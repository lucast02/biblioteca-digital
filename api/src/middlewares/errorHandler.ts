import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ApiError } from "../errors/ApiError";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ message: error.message, ...(error.errors ? { errors: error.errors } : {}) });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      const field = Array.isArray(target) ? String(target[0]) : String(target ?? "campo");
      const label: Record<string, string> = {
        email: "E-mail", isbn: "ISBN", cpf: "CPF",
      };
      const message = `${label[field] ?? field} já cadastrado. Informe um valor diferente.`;
      res.status(409).json({ message, errors: { [field]: message } });
      return;
    }
    if (error.code === "P2003") {
      res.status(400).json({ message: "Não foi possível salvar: confira os registros relacionados selecionados." });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({ message: "Registro não encontrado." });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ message: "Erro interno do servidor." });
};
