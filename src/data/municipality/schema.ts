import { z } from '@hono/zod-openapi';

export const municipalitySchemaObject = {
  id_municipality: z.string().uuid(),
  name: z.string().max(100).openapi({ example: 'Livingston' }),
  department_id: z.string().uuid(),
  is_active: z.boolean().default(true).openapi({ example: true }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
  updated_at: z.string().datetime().nullable().optional().openapi({ example: null }),
  created_by: z.string().uuid().nullable().optional(),
  updated_by: z.string().uuid().nullable().optional(),
};

export const municipalitySchema = z.object(municipalitySchemaObject);
export const municipalitySchemaOpenApi = municipalitySchema.openapi('Municipality');
export const municipalitySchemaFields = z.enum(
  Object.keys(municipalitySchemaObject) as [string, ...string[]]
);

export type Municipality = z.infer<typeof municipalitySchema>;
export type CreateMunicipality = Omit<
  Municipality,
  'id_municipality' | 'created_at' | 'updated_at'
>;
export type UpdateMunicipality = Partial<
  Omit<Municipality, 'id_municipality' | 'created_at' | 'updated_at'>
>;
