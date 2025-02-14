import { z } from '@hono/zod-openapi';

export const employeeSchemaObject = {
  id_employee: z.string().uuid(),
  name: z.string().max(255).openapi({ example: 'John Doe' }),
  age: z.number().int().openapi({ example: 30 }),
  phone: z.string().max(20).nullable().optional().openapi({ example: '+123456789' }),
  email: z.string().email().nullable().optional().openapi({ example: 'johndoe@example.com' }),
  address: z.string().max(255).nullable().optional().openapi({ example: '456 Elm St' }),
  salary: z.number().nullable().optional().openapi({ example: 50000 }),
  start_date: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .openapi({ example: '2023-01-01T00:00:00Z' }),
  end_date: z.string().datetime().nullable().optional().openapi({ example: null }),
  position: z.string().max(100).nullable().optional().openapi({ example: 'Software Engineer' }),
  is_active: z.boolean().default(true).openapi({ example: true }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
  updated_at: z.string().datetime().nullable().optional().openapi({ example: null }),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
};

export const employeeSchema = z.object(employeeSchemaObject);
export const employeeSchemaOpenApi = employeeSchema.openapi('Employee');
export const employeeSchemaFields = z.enum(
  Object.keys(employeeSchemaObject) as [string, ...string[]]
);

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployee = Omit<Employee, 'id_employee' | 'created_at' | 'updated_at'>;
export type UpdateEmployee = Partial<Omit<Employee, 'id_employee' | 'created_at' | 'updated_at'>>;
