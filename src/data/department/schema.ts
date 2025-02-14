import { z } from '@hono/zod-openapi';

export const departmentSchemaObject = {
  id_department: z.string().uuid(),
  name: z.string().max(100).openapi({ example: 'Izabal' }),
  country_id: z.string().uuid(),
  is_active: z.boolean().default(true).openapi({ example: true }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
  updated_at: z.string().datetime().nullable().optional().openapi({ example: null }),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
};

export const departmentSchema = z.object(departmentSchemaObject);
export const departmentSchemaOpenApi = departmentSchema.openapi('Department');
export const departmentSchemaFields = z.enum(
  Object.keys(departmentSchemaObject) as [string, ...string[]]
);

export type Department = z.infer<typeof departmentSchema>;
export type CreateDepartment = Omit<Department, 'id_department' | 'created_at' | 'updated_at'>;
export type UpdateDepartment = Partial<
  Omit<Department, 'id_department' | 'created_at' | 'updated_at'>
>;
