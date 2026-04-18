import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from 'react'
import NotFound from '@/app/pages/not-found'

interface RouterContext {
  queryClient: QueryClient
}

export const RootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
      <TanStackRouterDevtools />
    </Suspense>
  ),

  notFoundComponent: NotFound,

  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500">Có lỗi xảy ra</h1>
        <p className="mt-2 text-gray-600">{error.message}</p>
      </div>
    </div>
  ),
})