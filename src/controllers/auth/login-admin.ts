import { createRoute, z } from '@hono/zod-openapi';
import { sign } from 'hono/jwt';

import { envConfig } from '@/env';
import { compare } from 'bcrypt';

import prisma from '@/client/prisma';
import { getUserData } from '@/data/user/get-user';
import { userSchema } from '@/data/user/schema';
import { type AppRouteHandler } from '@/types/hono';

export const loginAdminSchema = {
  body: userSchema.pick({
    email: true,
    password: true,
  }),
  response: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
};

export const loginAdminRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/login-admin',
  tags: ['Auth'],
  summary: 'Login Admin',
  description: 'Login admin users and return token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginAdminSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: loginAdminSchema.response,
        },
      },
      description: 'Admin logged in successfully',
    },
    401: {
      description: 'Invalid email, password, or unauthorized role',
    },
  },
});

export const loginAdminRouteHandler: AppRouteHandler<typeof loginAdminRoute> = async c => {
  const { email, password } = c.req.valid('json');

  try {
    const user = await getUserData(email);

    if (!user) {
      return c.json({ error: 'User not found' }, { status: 404 });
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      return c.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return c.json({ error: 'Unauthorized - Invalid Role' }, { status: 403 });
    }

    const secretKey = envConfig.JWT_SECRET;
    const refreshSecret = envConfig.JWT_REFRESH_SECRET;
    const jwtAlgorithm = envConfig.JWT_ALGORITHM;

    const tokenPayload = {
      id: user.id_user,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
    };

    const refreshTokenPayload = {
      id: user.id_user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };

    const accessToken = await sign(tokenPayload, secretKey, jwtAlgorithm);
    const refreshToken = await sign(refreshTokenPayload, refreshSecret, jwtAlgorithm);

    await prisma.session.create({
      data: {
        user_id: user.id_user,
        token: accessToken,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 60 * 60 * 5 * 1000),
      },
    });

    return c.json(
      {
        message: 'Login Success',
        data: {
          accessToken,
          refreshToken,
        },
      },
      200
    );
  } catch {
    return c.json({ error: 'Email/Password Incorrect' }, 400);
  }
};
