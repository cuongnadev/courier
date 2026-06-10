import { RouterProvider } from "@tanstack/react-router"
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useBootstrapSession } from "@/features/auth/hooks/use-bootstrap-session";
import { router } from "./router"
import { AsyncLoadingGate } from "@/components/common/loader/AsyncLoadingGate";


function App() {
  const { isBootstrapping } = useBootstrapSession();

  return (
    <AsyncLoadingGate
      isLoading={isBootstrapping}
      fullScreen
      label="Checking login session..."
    >
      <>
        <RouterProvider router={router} />
        {import.meta.env.DEV && <TanStackRouterDevtools router={router} />}
      </>
    </AsyncLoadingGate>
  );
}

export default App