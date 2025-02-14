import { UserRoleType } from '@/db/types';
import { z } from '@hono/zod-openapi';

export const userSchemaObject = {
    id_user: z.string().uuid(),
    email: z.string().email().openapi({
        example: "user@example.com"
    }),
    password: z.string().min(8).max(255).openapi({
        example: "password123"
    }),
    name: z.string().max(255).openapi({
        example: "User Name"
    }),
    role: z.nativeEnum(UserRoleType).openapi({
        example: UserRoleType.ADMIN,
    }),
    is_active: z.boolean().openapi({
        example: true
    }),
    created_at: z.union([z.coerce.date(), z.string()]).openapi({
        example: new Date().toISOString()
    }),
    updated_at: z.union([z.coerce.date(), z.string()]).nullable().optional().openapi({
        example: null
    }),
}

export const userSchema = z.object(userSchemaObject);
export const userSchemaOpenApi = userSchema.openapi('User');
export const userSchemaFields = z.enum(Object.keys(userSchemaObject) as [string, ...string[]]);

export type User = z.infer<typeof userSchema>;

export type CreateUser = Omit<User, 'id_user' | 'created_at' | 'updated_at'>;