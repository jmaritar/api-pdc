import { type Context, type Next } from 'hono';
import { decode } from 'hono/jwt';

export const authenticate = async (c: Context, next: Next) => {
  console.info('Authenticating user...');

  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return c.json({ error: 'Authorization header missing' }, 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ error: 'Bearer token missing' }, 401);
  }

  try {
    const decodedToken = await decode(token);
    const { exp, id } = decodedToken.payload;

    console.info('Decoded token:', decodedToken.payload);

    if (!exp || !id) {
      return c.json({ error: 'Token is invalid' }, 401);
    }

    if (Date.now() >= exp * 1000) {
      return c.json({ error: 'Token has expired' }, 401);
    }

    console.info('Token verified:', decodedToken.payload);
    c.set('user', decodedToken.payload);

    await next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return c.json({ error: 'Token verification failed' }, 401);
  }
};
