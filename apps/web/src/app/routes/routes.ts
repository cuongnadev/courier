import { createRoute } from '@tanstack/react-router'

import { RootRoute } from './__root';

/**
 * Layouts
 */

import AuthLayout from '@/app/layouts/AuthLayout';
import MainLayout from '@/app/layouts/MainLayout';


/**
 * Main pages
 */

import IndexRedirectPage from "@/app/pages/main/index-redirect";
import DashboardPage from "@/app/pages/main/dashboard";
import CollectionsPage from "@/app/pages/main/collections";
import LoginPage from "@/app/pages/auth/login";
import RegisterPage from "@/app/pages/auth/register";

export const indexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: IndexRedirectPage,
});

export const authLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'auth',
  component: AuthLayout,
});

export const mainLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/workspaces/$workspaceId",
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

export const collectionDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: "/collections/$collectionId",
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
  indexRoute,
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  mainLayoutRoute.addChildren([dashboardRoute, collectionsRoute, collectionDetailRoute]),
]);