import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import NotFound from '@/app/pages/not-found'
import { AppLoading } from '@/components/common/loader/app-loading';

interface RouterContext {
  queryClient: QueryClient
}

export const RootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Suspense fallback={
        <AppLoading
          label="Loading..."
          isComplete={false}
          fullScreen
          onFinish={() => { }}
        />
      }
    >
      <Outlet />
    </Suspense>
  ),

  notFoundComponent: () => <NotFound fullScreen />,

  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-6">
      <div className="w-full max-w-md rounded-[24px] border border-[#E4E4E7] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-red-50">
          <span className="text-2xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-bold text-[#18181B]">Có lỗi xảy ra</h1>

        <p className="mt-3 text-sm leading-6 text-[#71717A]">
          {error.message}
        </p>
      </div>
    </div>
  ),
})