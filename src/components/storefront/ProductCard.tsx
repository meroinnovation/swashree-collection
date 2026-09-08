import Link from "next/link";
import { npr } from "@/lib/format";
import type { Product } from "@/sanity/schemas";
import { SmartImage } from "@/components/image";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const image = product.images?.[0]?.url;
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const outOfStock = product.inStock === false;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/product/${product.slug || product._id}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        <SmartImage
          src={image}
          alt={product.name}
          priority={priority}
          className="transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {onSale && product.compareAtPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-900">
            Sale
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 hover:text-rose-700">
          {product.name}
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-rose-700">{npr(product.price)}</span>
          {onSale && (
            <span className="text-sm text-stone-400 line-through">{npr(product.compareAtPrice)}</span>
          )}
        </div>
        <div className="mt-3">
          <AddToCartButton
            productId={product._id}
            slug={product.slug || product._id}
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            image={product.images?.[0]?.url}
            disabled={outOfStock}
            label={outOfStock ? "Out of Stock" : "Add to Cart"}
            className="w-full px-4 py-2.5 text-xs"
          />
        </div>
      </div>
    </div>
  );
}