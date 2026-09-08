"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { IconBag } from "@/components/icons";

export default function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label="Shopping cart"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:border-rose-300 hover:text-rose-700"
    >
      <IconBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}