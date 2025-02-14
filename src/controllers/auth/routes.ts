import { OpenAPIHono } from '@hono/zod-openapi';

import { type HonoEnv } from '@/types/hono';

import { loginRoute, loginRouteHandler } from './login';
import { loginAdminRoute, loginAdminRouteHandler } from './login-admin';

const authRoutes = new OpenAPIHono<HonoEnv>()
  // @ts-expect-error
  .openapi(loginRoute, loginRouteHandler)
  // @ts-expect-error
  .openapi(loginAdminRoute, loginAdminRouteHandler);
export default authRoutes;
