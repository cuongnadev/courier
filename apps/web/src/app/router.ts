import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routes/routes'
import { queryClient } from '@/lib/query-client'

export const router = createRouter({
  routeTree,
  context: {
    queryClient
  }
})

// Type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}