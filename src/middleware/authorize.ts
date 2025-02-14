import type { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import { envConfig } from "@/env";

// Middleware para validar el JWT
export const jwtMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ error: "Authorization header missing" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ error: "Bearer token missing" }, 401);
  }

  try {
    const secret = envConfig.JWT_SECRET as string;
    const payload = await verify(token, secret);
    // Guardamos el payload en el request para usarlo luego
    c.req.parsedJwt = payload;
    await next();
  } catch (error) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};

// Helper para requerir ciertos roles
export const requireRole = (roles: string[]): MiddlewareHandler => {
  return async (c, next) => {
    const payload = c.req.parsedJwt;
    if (!payload || !roles.includes(payload.role)) {
      return c.json({ error: "Unauthorized: insufficient privileges" }, 403);
    }
    await next();
  };
};
