import { z } from '@hono/zod-openapi';

export const logSchemaObject = {
  id_log: z.string().uuid(),
  user_id: z.string().uuid().nullable().optional(),
  table_name: z.string().max(100).openapi({ example: 'User' }),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'DEACTIVATE']).openapi({ example: 'CREATE' }),
  record_id: z.string().uuid(),
  before_data: z.any().nullable().optional().openapi({ example: null }),
  after_data: z
    .any()
    .nullable()
    .optional()
    .openapi({ example: { name: 'Updated Name' } }),
  ip_address: z.string().max(50).nullable().optional().openapi({ example: '192.168.1.1' }),
  device_info: z.string().max(255).nullable().optional().openapi({ example: 'Mozilla/5.0' }),
  reason: z.string().max(255).nullable().optional().openapi({ example: 'Updated user role' }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
};

export const logSchema = z.object(logSchemaObject);
export const logSchemaOpenApi = logSchema.openapi('Log');
export const logSchemaFields = z.enum(Object.keys(logSchemaObject) as [string, ...string[]]);

export type Log = z.infer<typeof logSchema>;
export type CreateLog = Omit<Log, 'id_log' | 'created_at'>;
export type UpdateLog = Partial<Omit<Log, 'id_log' | 'created_at'>>;
