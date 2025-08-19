import { Request, Response, NextFunction } from "express";

/**
 * Auth simples para dev:
 * - Se AUTH_BYPASS = "true": passa direto
 * - Caso contrário: exige Authorization: Bearer <token> (sem validar por enquanto)
 */
export function auth(req: Request, res: Response, next: NextFunction) {
  if (process.env.AUTH_BYPASS === "true") return next();

  const authz = req.header("authorization") || "";
  const hasBearer = /^bearer\s+\S+/i.test(authz);
  if (!hasBearer) {
    return res.status(401).json({ error: "unauthorized" });
  }
  // TODO: validar token com JWKS
  return next();
}
