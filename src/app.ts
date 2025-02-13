import { Hono, type Context } from "hono";
import { serve } from "@hono/node-server"; 
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import prisma from "./client/prisma";
import apiRouter from "./router/router";
import { envConfig } from "./env";
import bcrypt from 'bcrypt';
import { seedDatabase } from "./seeds";

const app = new Hono();

app.use("*", etag(), logger());
app.use("*", prettyJSON());
app.use("*", cors());

app.get("/", (c) => {
    console.log("Hello World");
    
    return c.json({
        message: "Welcome To Hono Api!",
    });
});

app.get("/seed", async (c: Context) => {
    await seedDatabase();
    return c.json({ message: "Database seeded successfully" }, 201);
});

app.mount("/api", apiRouter.fetch);
app.notFound((c) => c.json({ message: "Not Found" }, 404));

const port = envConfig.APP_PORT || 3000;

serve({
    fetch: app.fetch,
    port
});

console.log(`🚀 Server is running on http://localhost:${port}`);
