import authRoutes from './auth/routes';
export const routes = [authRoutes] as const;

export type AppRoutes = (typeof routes)[number];
