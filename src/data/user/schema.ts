import { z } from '@hono/zod-openapi';

export const userSchemaObject = {
  id_user: z.string().uuid(),
  email: z.string().email().max(255).openapi({ example: 'user@example.com' }),
  password: z.string().max(255).openapi({ example: 'securepassword' }),
  name: z.string().max(100).nullable().optional().openapi({ example: 'John Doe' }),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'HR']).openapi({ example: 'ADMIN' }),
  is_active: z.boolean().default(true).openapi({ example: true }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
  updated_at: z.string().datetime().nullable().optional().openapi({ example: null }),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
};

export const userSchema = z.object(userSchemaObject);
export const userSchemaOpenApi = userSchema.openapi('User');
export const userSchemaFields = z.enum(Object.keys(userSchemaObject) as [string, ...string[]]);

export type User = z.infer<typeof userSchema>;
export type CreateUser = Omit<User, 'id_user' | 'created_at' | 'updated_at'>;
export type UpdateUser = Partial<Omit<User, 'id_user' | 'created_at' | 'updated_at'>>;
