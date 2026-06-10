import { createRoute } from '@tanstack/react-router'

import { RootRoute } from './__root';

import { ROUTE_PATHS } from "@/constants/route-paths";

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
import RequestPage from '@/app/pages/main/requests';

export const indexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: ROUTE_PATHS.ROOT,
  component: IndexRedirectPage,
});

export const authLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: 'auth',
  component: AuthLayout,
});

export const mainLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: ROUTE_PATHS.WORKSPACE.ROOT,
  component: MainLayout,
});


/**
 * Pages routes
 */

export const dashboardRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: ROUTE_PATHS.WORKSPACE.DASHBOARD,

  component: DashboardPage,
});

export const collectionsRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: ROUTE_PATHS.WORKSPACE.COLLECTIONS,

  component: CollectionsPage,
});

export const collectionDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: ROUTE_PATHS.WORKSPACE.COLLECTION_DETAIL,
  component: CollectionsPage,
});

export const requestDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: ROUTE_PATHS.WORKSPACE.REQUEST_DETAIL,
  component: RequestPage,
});

export const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTE_PATHS.AUTH.LOGIN,
  component: LoginPage,
});
export const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: ROUTE_PATHS.AUTH.REGISTER,
  component: RegisterPage,
});
// ... other routes

export const routeTree = RootRoute.addChildren([
  indexRoute,
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  mainLayoutRoute.addChildren([
    dashboardRoute,
    collectionsRoute,
    collectionDetailRoute,
    requestDetailRoute
  ]),
]);