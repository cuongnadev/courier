import { RouterProvider } from "@tanstack/react-router"
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { router } from "./router"


function App() {
  return (
    <>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <TanStackRouterDevtools router={router} />}
    </>
  )
}

export default App