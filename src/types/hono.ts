import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import "hono";

export interface HonoEnv {
    
}

declare module "hono" {
  interface HonoRequest {
    parsedJwt?: any;
  }
}

export type AppRouteHandler<TRouteConfig extends RouteConfig> = RouteHandler<TRouteConfig, HonoEnv>;