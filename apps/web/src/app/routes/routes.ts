import { createRoute } from '@tanstack/react-router'
import { lazy } from 'react';

import { RootRoute } from './__root';

/**
 * layouts
 */

import AuthLayout from '@/app/layouts/auth-layout';
import MainLayout from '@/app/layouts/main-layout';

export const authLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'auth',
  component: AuthLayout,
});

export const mainLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'main',
  component: MainLayout,
});


/**
 * Pages
 */

export const dashboardRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/',

  // fetch data before rendering the route component
  // loader: async ({ context }) => {
  //   return context.queryClient.ensureQueryData({
  //     queryKey: ['dashboard'],
  //     queryFn: fetchDashboard,
  //   });
  // },

  component: lazy(() => import('@/app/pages/main/dashboard')),
});

export const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: lazy(() => import('@/app/pages/auth/login')),
});
export const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: lazy(() => import('@/app/pages/auth/register')),
});
// ... other routes

export const routeTree = RootRoute.addChildren([
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  mainLayoutRoute.addChildren([dashboardRoute]),
]);