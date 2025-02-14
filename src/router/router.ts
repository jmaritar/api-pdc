import { Hono } from "hono";
import { UsersController } from "../controllers/users";
import { AuthController } from "../controllers/auth";
import { jwtMiddleware, requireRole } from "../middleware/authorize";

const app = new Hono();
const userController = new UsersController();
const authController = new AuthController();

// Endpoints públicos
app.post("/login", authController.login);
app.post("/refresh-token", authController.refreshToken);

// Middleware para rutas protegidas (valida el JWT y agrega parsedJwt)
app.use("/users/*", jwtMiddleware);

// Rutas de usuarios
app.get("/users", userController.getAll);
app.get("/users/:id", userController.getById);

// Para crear/actualizar usuarios se exige rol ADMIN o HR
app.post("/users", requireRole(["ADMIN", "HR"]), userController.createUsers);
app.put("/users/:id", requireRole(["ADMIN", "HR"]), userController.updateUser);

// Para eliminar, solo ADMIN
app.delete("/users/:id", requireRole(["ADMIN"]), userController.deleteUser);

export default app;
