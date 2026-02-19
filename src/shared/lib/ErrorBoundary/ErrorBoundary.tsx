import type { ErrorInfo, ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./ErrorFallback";

const logError = (error: unknown, info: ErrorInfo) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message, info.componentStack);
};

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
