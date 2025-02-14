import { serve } from "@hono/node-server"; 
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { envConfig } from "./env";
import { version } from '../package.json';
import { seedDatabase } from "./seeds";
import { HonoEnv } from "./types/hono";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { apiReference } from "@scalar/hono-api-reference";
import { routes } from "./controllers/routes";

const app = new OpenAPIHono<HonoEnv>();

const allowedOrigins = [
  'https://angular-pdc.pages.dev/',
  'http://localhost:8081',
  'http://127.0.0.1:8787',
];

app.use("*", etag(), logger());
app.use("*", prettyJSON());
/* CORS */
app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

/* API Docs */
app.doc('/openapi.json',{
    openapi: '3.0.0',
    info: {
      version,
      title: `${envConfig.STAGE.toUpperCase()} API`,
      description: 'API Documentation',
    },
    externalDocs: {
      description: 'API Reference',
      url: '/reference',
    },
  });
  app.get('/swagger', swaggerUI({ url: '/openapi.json' }));
  app.get('/reference', apiReference({ spec: { url: '/openapi.json' } }));
  
  /* Security Schemes */
  app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });


app.get("/", (c) => {
    return c.json({
        message: "Welcome To Hono Api!!!",
    });
});

app.get("/seed", async (c) => {
    await seedDatabase();
    return c.json({ message: "Database seeded successfully" }, 201);
});

/* Routes */
routes.forEach(route => {
  app.route('/api/v1', route);
});

app.notFound((c) => c.json({ message: "Not Found" }, 404));

const port = envConfig.APP_PORT || 3000;

serve({
    fetch: app.fetch,
    port
});

console.log(`🚀 Server is running on http://localhost:${port}`);
