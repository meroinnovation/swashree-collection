import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="font-display text-7xl font-bold text-rose-200">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold text-stone-900">Page not found</h1>
      <p className="mt-2 text-sm text-stone-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-rose-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-800"
      >
        Back to Home
      </Link>
    </section>
  );
}