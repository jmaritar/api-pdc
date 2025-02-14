import { OpenAPIHono } from '@hono/zod-openapi';

import { type HonoEnv } from '@/types/hono';

import { loginRoute, loginRouteHandler } from './login';

const authRoutes = new OpenAPIHono<HonoEnv>().openapi(
  loginRoute,
  // @ts-expect-error
  loginRouteHandler
);

export default authRoutes;
