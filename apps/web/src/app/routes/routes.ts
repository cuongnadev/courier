import { createRoute } from '@tanstack/react-router'

import { RootRoute } from './__root';

/**
 * Layouts
 */

import AuthLayout from '@/app/layouts/auth-layout';
import MainLayout from '@/app/layouts/main-layout';


/**
 * Main pages
 */

import DashboardPage from "@/app/pages/main/dashboard";
import CollectionsPage from "@/app/pages/main/collections";
import LoginPage from "@/app/pages/auth/login";
import RegisterPage from "@/app/pages/auth/register";

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
 * Pages routes
 */

export const dashboardRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/',

  component: DashboardPage,
});

export const collectionsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/collections',

  component: CollectionsPage,
});

export const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginPage,
});
export const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: RegisterPage,
});
// ... other routes

export const routeTree = RootRoute.addChildren([
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  mainLayoutRoute.addChildren([dashboardRoute, collectionsRoute]),
]);