import { type Context, type Next } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { decode } from 'hono/jwt';

import { getCurrentLocalDateISO } from '@/utils/date';
import { pinoLogger } from '@/utils/logger';

export const authenticate = async (c: Context, next: Next) => {
  console.info('Authenticating user...');

  const bearer = bearerAuth({
    verifyToken: async (token, c) => {
      try {
        const decodedToken = await decode(token);
        const { exp } = decodedToken.payload;

        console.info('Decoded token:', decodedToken.payload);

        if (!exp) {
          pinoLogger.error('Token does not have an expiration time');
          return false;
        }

        const currentISODate = getCurrentLocalDateISO();
        const tokenExpirationDate = new Date(exp * 1000).toISOString();

        if (currentISODate >= tokenExpirationDate) {
          pinoLogger.error('Token has expired');
          return false;
        }

        pinoLogger.info('Token verified:', decodedToken.payload);
        c.set('user', decodedToken.payload);

        return true;
      } catch (error) {
        pinoLogger.error('Token verification failed:', error);
        return false;
      }
    },
  });

  await bearer(c, next);
};
