import { z } from '@hono/zod-openapi';

export const companySchemaObject = {
  id_company: z.string().uuid(),
  legal_name: z.string().max(255).openapi({ example: 'PDC Solutions' }),
  trade_name: z.string().max(255).openapi({ example: 'TechCorp' }),
  nit: z.string().max(50).openapi({ example: '123456789' }),
  phone: z.string().max(20).nullable().optional().openapi({ example: '+123456789' }),
  email: z.string().email().nullable().optional().openapi({ example: 'info@techcorp.com' }),
  address: z.string().max(255).nullable().optional().openapi({ example: '123 Main St' }),
  company_type_id: z.string().uuid().nullable().optional(),
  country_id: z.string().uuid(),
  department_id: z.string().uuid(),
  municipality_id: z.string().uuid(),
  is_active: z.boolean().default(true).openapi({ example: true }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
  updated_at: z.string().datetime().nullable().optional().openapi({ example: null }),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
};

export const companySchema = z.object(companySchemaObject);
export const companySchemaOpenApi = companySchema.openapi('Company');
export const companySchemaFields = z.enum(
  Object.keys(companySchemaObject) as [string, ...string[]]
);

export type Company = z.infer<typeof companySchema>;
export type CreateCompany = Omit<Company, 'id_company' | 'created_at' | 'updated_at'>;
export type UpdateCompany = Partial<Omit<Company, 'id_company' | 'created_at' | 'updated_at'>>;
