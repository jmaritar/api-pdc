import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { loginRoute, loginRouteHandler } from './login';

const authRoutes = new OpenAPIHono<HonoEnv>().openapi(
  loginRoute,
//   @ts-ignore
  loginRouteHandler
)

export default authRoutes;