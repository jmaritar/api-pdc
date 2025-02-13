import type { Context } from "hono";
import { loginSchema } from "../schema/auth";
import prisma from "../client/prisma";
import { sign } from "hono/jwt";
import { envConfig } from "@/env";
import bcrypt from 'bcrypt';

export class AuthController {

    async login(c: Context) {
        try {
            const body = await c.req.json();
            const validate = await loginSchema.safeParse(body);
            if(!validate.success){
                return c.json({
                    error: validate.error
                }, 400);
            } 
            
            const getUsers = await prisma.user.findFirst({
                where:{
                    email: validate.data.email
                }
            });

            if(!getUsers){
                return c.json({
                    error: "Email/Password Incorrect"
                }, 400);
            }

            const verify = await bcrypt.compare(validate.data.password, getUsers.password);
            if(!verify){
                return c.json({
                    error: "Email/Password Incorrect"
                }, 400);
            }

            const secret = envConfig.JWT_SECRET as string;
            const token = await sign({
                id: getUsers.id,
                email: getUsers.email,
                exp:  Math.floor(Date.now() / 1000) + 60 * 60 * 5
            }, secret, "HS256");

            return c.json({
                message: "Login Success",
                data:{
                    token: token
                }
            }, 200);

        } catch (error) {
            console.error(`Error getting users: ${error}`);
            return c.json({
                error: error
            }, 500);
        }
    }
}