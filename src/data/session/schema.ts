import { z } from '@hono/zod-openapi';

export const sessionSchemaObject = {
  id_session: z.string().uuid(),
  user_id: z.string().uuid(),
  token: z.string().max(255).openapi({ example: 'random_token_string' }),
  refresh_token: z.string().max(255).openapi({ example: 'random_refresh_token_string' }),
  expires_at: z.string().datetime().openapi({ example: '2023-12-31T23:59:59Z' }),
  created_at: z.string().datetime().openapi({ example: new Date().toISOString() }),
};

export const sessionSchema = z.object(sessionSchemaObject);
export const sessionSchemaOpenApi = sessionSchema.openapi('Session');
export const sessionSchemaFields = z.enum(
  Object.keys(sessionSchemaObject) as [string, ...string[]]
);

export type Session = z.infer<typeof sessionSchema>;
export type CreateSession = Omit<Session, 'id_session' | 'created_at'>;
export type UpdateSession = Partial<Omit<Session, 'id_session' | 'created_at'>>;
