import { createRoute } from '@tanstack/react-router'
import { RootRoute } from './__root'
import { lazy } from 'react';

export const dashboardRoute = createRoute({
  getParentRoute: () => RootRoute,
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
// ... other routes

export const routeTree = RootRoute.addChildren([
  dashboardRoute,
])