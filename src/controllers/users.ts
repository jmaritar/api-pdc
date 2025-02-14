import type { Context } from "hono";
import prisma from "../client/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { UserRole } from "@prisma/client";
// import { createUserSchema, updateUserSchema } from "../schema/users"; // Define los schemas de validación


const createUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email"),
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .trim()
    .min(8, "Password cannot be empty"),
  role: z
    .nativeEnum(UserRole, {
      required_error: "Role is required",
    }),
});

const updateUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email"),
    name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
    password: z
    .string({
      required_error: "Password is required",
    })
    .trim()
    .min(8, "Password cannot be empty"),
    role: z
    .nativeEnum(UserRole, {
      required_error: "Role is required",
    }),
});


export class UsersController {
  // Obtener todos los usuarios
  async getAll(c: Context) {
    try {
      const users = await prisma.user.findMany();
      return c.json({ data: users }, 200);
    } catch (error) {
      console.error("Error getting users:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  // Obtener un usuario por ID (usando c.req.param("id"))
  async getById(c: Context) {
    try {
      const id = c.req.param("id");
      const user = await prisma.user.findUnique({
        where: { id_user: id },
      });
      if (!user) return c.json({ error: "User not found" }, 404);
      return c.json({ data: user }, 200);
    } catch (error) {
      console.error("Error getting user by id:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  // Crear un nuevo usuario (sólo ADMIN o HR)
  async createUsers(c: Context) {
    try {
      const body = await c.req.json();
      const validate = await createUserSchema.safeParse(body);
      if (!validate.success) {
        return c.json({ error: validate.error }, 400);
      }

      // Verificar el rol del usuario que realiza la petición (almacenado en c.req.parsedJwt)
      const tokenPayload = c.req.parsedJwt;
      if (!tokenPayload || (tokenPayload.role !== "ADMIN" && tokenPayload.role !== "HR")) {
        return c.json({ error: "Unauthorized: insufficient privileges" }, 403);
      }

      const hashedPassword = await bcrypt.hash(validate.data.password, 10);
      const user = await prisma.user.create({
        data: {
          email: validate.data.email,
          name: validate.data.name,
          password: hashedPassword,
          role: validate.data.role,
        },
      });
      return c.json({ message: "User created successfully", data: user }, 201);
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  // Actualizar un usuario (sólo ADMIN o HR)
  async updateUser(c: Context) {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      const validate = await updateUserSchema.safeParse(body);
      if (!validate.success) {
        return c.json({ error: validate.error }, 400);
      }

      // Validar rol desde el JWT
      const tokenPayload = c.req.parsedJwt;
      if (!tokenPayload || (tokenPayload.role !== "ADMIN" && tokenPayload.role !== "HR")) {
        return c.json({ error: "Unauthorized: insufficient privileges" }, 403);
      }

      // Si se actualiza la contraseña, se hashea
      let updateData = { ...validate.data };
      if (updateData.password) {
      let updateData = { ...validate.data, role: validate.data.role as UserRole };
      }

      const updatedUser = await prisma.user.update({
        where: { id_user: id },
        data: updateData,
      });

      return c.json({ message: "User updated successfully", data: updatedUser }, 200);
    } catch (error) {
      console.error("Error updating user:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }

  // Eliminar un usuario (sólo ADMIN)
  async deleteUser(c: Context) {
    try {
      const id = c.req.param("id");

      // Validar que el usuario tenga rol ADMIN
      const tokenPayload = c.req.parsedJwt;
      if (!tokenPayload || tokenPayload.role !== "ADMIN") {
        return c.json({ error: "Unauthorized: only ADMIN can delete users" }, 403);
      }

      await prisma.user.delete({
        where: { id_user: id },
      });
      return c.json({ message: "User deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting user:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
}
