import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Faça login para acessar este recurso." });
    return;
  }

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json({ message: "Token inválido." });
      return;
    }
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
