import Link from "next/link";
import type { SiteSettings } from "@/lib/sanity";
import CartButton from "./CartButton";
import MobileMenu from "./MobileMenu";

export default function Header({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: { slug: string; name: string }[];
}) {
  const storeName = settings.storeName || "Swashree Collection";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/90 backdrop-blur">
      {settings.announcement && (
        <div className="bg-rose-900 px-4 py-2 text-center text-xs font-medium tracking-wide text-rose-50 sm:text-sm">
          {settings.announcement}
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <MobileMenu categories={categories} />
        </div>

        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-800 font-display text-lg font-black text-white">
            S
          </span>
          <div className="min-w-0 font-display leading-tight">
            <span className="block truncate text-lg font-bold tracking-tight text-stone-900">
              {storeName}
            </span>
            {settings.tagline && (
              <span className="block truncate text-[11px] font-medium uppercase tracking-[0.18em] text-rose-600/80">
                {settings.tagline}
              </span>
            )}
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-rose-50 hover:text-rose-800"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-rose-50 hover:text-rose-800"
          >
            Shop All
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-rose-50 hover:text-rose-800"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-rose-50 hover:text-rose-800"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-rose-50 hover:text-rose-800"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden rounded-full bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800 sm:inline-flex"
          >
            Shop Now
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}