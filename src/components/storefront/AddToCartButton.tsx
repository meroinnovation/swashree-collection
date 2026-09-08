"use client";

import { useCart } from "@/context/CartContext";

type AddToCartButtonProps = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  size?: string;
  color?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
};

export default function AddToCartButton({
  productId,
  slug,
  name,
  price,
  compareAtPrice,
  image,
  size,
  color,
  className = "",
  disabled,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        addItem({ productId, slug, name, price, compareAtPrice, image, qty: 1, size, color })
      }
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-rose-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {label}
    </button>
  );
}