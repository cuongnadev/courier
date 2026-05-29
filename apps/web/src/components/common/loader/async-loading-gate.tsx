import { useState } from "react";

import { AppLoading } from "@/components/common/loader/app-loading";

type AsyncLoadingGateProps = {
  isLoading: boolean;
  label?: string;
  fullScreen?: boolean;
  children: React.ReactNode;
};

export function AsyncLoadingGate({
  isLoading,
  label = "Loading...",
  fullScreen = true,
  children,
}: AsyncLoadingGateProps) {
  const [canContinue, setCanContinue] = useState(false);

  if (canContinue) {
    return children;
  }

  if (!canContinue) {
    return (
      <AppLoading
        label={label}
        isComplete={!isLoading}
        fullScreen={fullScreen}
        onFinish={() => setCanContinue(true)}
      />
    );
  }

  return children;
}