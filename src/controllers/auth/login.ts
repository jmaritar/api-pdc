import prisma from '@/client/prisma';
import { getUserData } from '@/data/user/get-user';
import { userSchema } from '@/data/user/schema';
import { envConfig } from '@/env';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';
import { compare } from 'bcrypt';
import { sign } from 'hono/jwt';

export const loginSchema = {
  body: userSchema.pick({
    email: true,
    password: true,
  }),
  response: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
};

export const loginRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login',
  description: 'Login user and return token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: loginSchema.response,
        },
      },
      description: 'User logged in successfully',
    },
    401: {
      description: 'Invalid email or password',
    },
  },
});

// JWT_EXPIRE="15m"
// JWT_REFRESH_EXPIRE="7d"

export const loginRouteHandler: AppRouteHandler<typeof loginRoute> = async c => {
  const { email, password } = c.req.valid('json');

  try {
    const user = await getUserData(email);

    const validPassword = await compare(password, user?.password || '');

    if (!user || validPassword === false) {
      return c.json({ error: 'Invalid email or password' }, { status: 401 });
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
