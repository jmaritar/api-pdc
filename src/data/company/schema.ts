import { z } from '@hono/zod-openapi';

export const companySchemaObject = {
  id_company: z.string().uuid(),
  name: z.string().max(255).openapi({ example: 'Tech Corp' }),
  trade_name: z.string().max(255).openapi({ example: 'TechCorp Ltd.' }),
  nit: z.string().max(50).openapi({ example: '123456789' }),
  phone: z.string().max(20).nullable().optional().openapi({ example: '+123456789' }),
  email: z.string().email().nullable().optional().openapi({ example: 'contact@techcorp.com' }),
  country_id: z.string().uuid(),
  department_id: z.string().uuid(),
  municipality_id: z.string().uuid(),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({ example: new Date().toISOString() }),
  updated_at: z
    .union([z.coerce.date(), z.string()])
    .nullable()
    .optional()
    .openapi({ example: null }),
};

export const companySchema = z.object(companySchemaObject);
export const companySchemaOpenApi = companySchema.openapi('Company');
export const companySchemaFields = z.enum(
  Object.keys(companySchemaObject) as [string, ...string[]]
);

export type Company = z.infer<typeof companySchema>;
export type CreateCompany = Omit<Company, 'id_company' | 'created_at' | 'updated_at'>;
export type UpdateCompany = Partial<Omit<Company, 'id_company' | 'created_at' | 'updated_at'>>;
