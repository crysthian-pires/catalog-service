import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = typeof err?.status === "number" ? err.status : 500;
  const code = err?.code || "internal_error";
  const message = err?.message || "Internal Server Error";
  //TODO: Log minimalista (trocar por logger depois)
  console.error("[error]", { status, code, message });
  res.status(status).json({ error: code, message });
}
