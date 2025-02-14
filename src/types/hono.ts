import { type RouteConfig, type RouteHandler } from '@hono/zod-openapi';

import 'hono';

export type HonoEnv = object;

declare module 'hono' {
  interface HonoRequest {
    parsedJwt?: unknown;
  }
}

export type AppRouteHandler<TRouteConfig extends RouteConfig> = RouteHandler<TRouteConfig, HonoEnv>;
