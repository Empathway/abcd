'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-red-200 rounded">
      <h2>Something went wrong:</h2>
      <pre className="text-red-600">{error.message}</pre>
    </div>
  );
}

export default function ProtectedComponent({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
      <Toaster />
    </ErrorBoundary>
  );
}
