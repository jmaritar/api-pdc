import { z } from '@hono/zod-openapi';

export const employeeSchemaObject = {
  id_employee: z.string().uuid(),
  name: z.string().max(255).openapi({ example: 'John Doe' }),
  age: z.number().min(18).max(85).openapi({ example: 30 }),
  phone: z.string().max(20).nullable().optional().openapi({ example: '+123456789' }),
  email: z.string().email().nullable().optional().openapi({ example: 'john.doe@example.com' }),
  company_id: z.string().uuid().nullable().optional(),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({ example: new Date().toISOString() }),
  updated_at: z
    .union([z.coerce.date(), z.string()])
    .nullable()
    .optional()
    .openapi({ example: null }),
};

export const employeeSchema = z.object(employeeSchemaObject);
export const employeeSchemaOpenApi = employeeSchema.openapi('Employee');
export const employeeSchemaFields = z.enum(
  Object.keys(employeeSchemaObject) as [string, ...string[]]
);

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployee = Omit<Employee, 'id_employee' | 'created_at' | 'updated_at'>;
