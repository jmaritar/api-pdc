import type { Context } from "hono";
import { loginSchema } from "../schema/auth";
import prisma from "../client/prisma";
import { sign, verify } from "hono/jwt";
import { envConfig } from "@/env";
import bcrypt from "bcrypt";

export class AuthController {
  // Endpoint para iniciar sesión
  async login(c: Context) {
    try {
      const body = await c.req.json();
      const validate = await loginSchema.safeParse(body);
      if (!validate.success) {
        return c.json({ error: validate.error }, 400);
      }
      const { email, password } = validate.data;

      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return c.json({ error: "Email/Password Incorrect" }, 400);
      }

      // Comparar contraseñas
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return c.json({ error: "Email/Password Incorrect" }, 400);
      }

      // Generar token de acceso con payload que incluye el rol
      const secret = envConfig.JWT_SECRET as string;
      const accessToken = await sign(
        {
          id: user.id_user,
          email: user.email,
          role: user.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5, // 5 horas
        },
        secret,
        "HS256"
      );

      // Generar refresh token (aquí lo usamos para actualizar el accessToken)
      const refreshToken = await sign(
        {
          id: user.id_user,
          type: "refresh",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 días
        },
        secret,
        "HS256"
      );

      // Guardar la sesión en la BD
      await prisma.session.create({
        data: {
          user_id: user.id_user,
          token: accessToken,
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 60 * 60 * 5 * 1000),
        },
      });

      return c.json(
        {
          message: "Login Success",
          data: {
            accessToken,
            refreshToken,
          },
        },
        200
      );
    } catch (error) {
      console.error("Error in login:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  // Endpoint para refrescar el token usando el refresh token
  async refreshToken(c: Context) {
    try {
      const body = await c.req.json();
      const { refreshToken } = body;
      if (!refreshToken) {
        return c.json({ error: "Refresh token is required" }, 400);
      }

      const secret = envConfig.JWT_SECRET as string;
      const payload = await verify(refreshToken, secret) as { id: string };
      if (!payload) {
        return c.json({ error: "Invalid refresh token" }, 401);
      }

      // Verificar que la sesión exista
      const session = await prisma.session.findUnique({
        where: { refresh_token: refreshToken },
      });
      if (!session) {
        return c.json({ error: "Session not found" }, 401);
      }

      // Obtener el usuario para incluir su rol y otros datos en el nuevo token
      const user = await prisma.user.findUnique({
        where: { id_user: payload.id },
      });
      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      const newAccessToken = await sign(
        {
          id: user.id_user,
          email: user.email,
          role: user.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5,
        },
        secret,
        "HS256"
      );

      // Actualizar la sesión en la BD
      await prisma.session.update({
        where: { id_session: session.id_session },
        data: {
          token: newAccessToken,
          expires_at: new Date(Date.now() + 60 * 60 * 5 * 1000),
        },
      });

      return c.json(
        {
          message: "Token refreshed successfully",
          data: { accessToken: newAccessToken },
        },
        200
      );
    } catch (error) {
      console.error("Error in refreshToken:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
}
