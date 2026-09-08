"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMenu, IconX } from "@/components/icons";

export default function MobileMenu({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-rose-300 hover:text-rose-700 md:hidden"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <span className="font-display text-lg font-bold text-rose-800">Swashree Collection</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-800"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-800"
                >
                  Shop All
                </Link>
                <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Collections
                </p>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-800"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-800"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-800"
                >
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}