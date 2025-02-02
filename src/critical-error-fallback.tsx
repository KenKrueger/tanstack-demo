import React from "react";
import { FallbackProps } from "react-error-boundary";
import { queryClient } from "./main";

/** A UI shown when a critical error occurs at the top level.
 *  It gives the user a way to reload the entire app. */
export function CriticalErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const handleReset = () => {
    try {
      // Clear any cached state
      queryClient?.clear();
      // Reset error boundary
      resetErrorBoundary();
    } catch (e) {
      // ignore
    }
    // Ensure same domain by using origin + path
    window.location.href = `${window.location.origin}/`;
  };

  const splash = document.getElementById("splashcontainer");
  splash?.remove();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="text-gray-600">
          {import.meta.env.DEV ? error.message : "An unexpected error occurred"}
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium
            hover:bg-red-600 active:bg-red-700 transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
