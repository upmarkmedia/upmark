"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary-text mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-text text-sm mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm hover:bg-accent-blue/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
