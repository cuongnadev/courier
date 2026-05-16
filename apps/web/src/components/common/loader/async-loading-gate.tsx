import { useState } from "react";

import { AppLoading } from "@/components/common/loader/app-loading";

type AsyncLoadingGateProps = {
  isLoading: boolean;
  label?: string;
  children: React.ReactNode;
};

export function AsyncLoadingGate({
  isLoading,
  label = "Loading...",
  children,
}: AsyncLoadingGateProps) {
  const [canContinue, setCanContinue] = useState(false);

  if (!canContinue) {
    return (
      <AppLoading
        label={label}
        isComplete={!isLoading}
        onFinish={() => setCanContinue(true)}
      />
    );
  }

  return children;
}