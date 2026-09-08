"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { IconWhatsapp } from "@/components/icons";

type ProductActionsProps = {
  product: {
    _id: string;
    slug?: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image?: string;
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
    isGiftWrappable?: boolean;
  };
  whatsapp?: string;
};

export default function ProductActions({ product, whatsapp }: ProductActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [added, setAdded] = useState(false);

  const outOfStock = product.inStock === false;
  const needSize = (product.sizes?.length || 0) > 0 && !size;
  const needColor = (product.colors?.length || 0) > 0 && !color;

  const handleAdd = () => {
    addItem({
      productId: product._id,
      slug: product.slug || product._id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      qty: 1,
      size,
      color,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const waMessage = encodeURIComponent(
    `Hello! I'm interested in "${product.name}" (Rs. ${product.price}). Is it available?`
  );

  return (
    <div className="space-y-5">
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
            Size: <span className="text-stone-900">{size || "Select"}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-w-11 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  size === s
                    ? "border-rose-700 bg-rose-700 text-white"
                    : "border-stone-300 text-stone-700 hover:border-rose-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
            Color: <span className="text-stone-900">{color || "Select"}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  color === c
                    ? "border-rose-700 bg-rose-700 text-white"
                    : "border-stone-300 text-stone-700 hover:border-rose-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={outOfStock || (needSize || needColor)}
          onClick={handleAdd}
          className="flex-1 rounded-full bg-rose-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-700/20 transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? "Added to Cart ✓" : outOfStock ? "Out of Stock" : needSize || needColor ? "Select Options" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="rounded-full border border-stone-300 px-8 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-rose-400 hover:text-rose-700"
        >
          View Cart
        </button>
      </div>

      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${waMessage}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          <IconWhatsapp className="h-4 w-4" />
          Order on WhatsApp
        </a>
      )}

      {product.isGiftWrappable && (
        <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
          🎁 Gift wrapping included — tell us in the order note or on WhatsApp.
        </p>
      )}
    </div>
  );
}