import { z } from '@hono/zod-openapi';

export const countrySchemaObject = {
  id_country: z.string().uuid(),
  name: z.string().max(100).openapi({ example: 'Guatemala' }),
  code: z.string().max(10).nullable().optional().openapi({ example: 'GT' }),
  phone_code: z.string().max(10).nullable().optional().openapi({ example: '+502' }),
  currency_code: z.string().max(10).nullable().optional().openapi({ example: 'GTQ' }),
  currency_name: z.string().max(50).nullable().optional().openapi({ example: 'Quetzal' }),
  currency_symbol: z.string().max(10).nullable().optional().openapi({ example: 'Q' }),
  flag: z
    .string()
    .max(255)
    .nullable()
    .optional()
    .openapi({ example: 'https://flagcdn.com/w320/gt.png' }),
  language: z.string().max(50).nullable().optional().openapi({ example: 'Spanish' }),
  capital: z.string().max(100).nullable().optional().openapi({ example: 'Guatemala City' }),
  is_active: z.boolean().default(true).openapi({ example: true }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
  updated_at: z.string().datetime().nullable().optional().openapi({ example: null }),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
};

export const countrySchema = z.object(countrySchemaObject);
export const countrySchemaOpenApi = countrySchema.openapi('Country');
export const countrySchemaFields = z.enum(
  Object.keys(countrySchemaObject) as [string, ...string[]]
);

export type Country = z.infer<typeof countrySchema>;
export type CreateCountry = Omit<Country, 'id_country' | 'created_at' | 'updated_at'>;
export type UpdateCountry = Partial<Omit<Country, 'id_country' | 'created_at' | 'updated_at'>>;
