import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

export function validarBody(schema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join(".") || "body";
        if (!errors[field]) errors[field] = issue.message;
      }
      res.status(400).json({ message: "Dados inválidos.", errors });
      return;
    }
    req.body = result.data;
    next();
  };
}
