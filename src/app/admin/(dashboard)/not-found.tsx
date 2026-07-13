import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary-text mb-2">
          Page not found
        </h2>
        <p className="text-muted-text text-sm mb-4">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/admin"
          className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm hover:bg-accent-blue/90 transition-colors inline-block"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
