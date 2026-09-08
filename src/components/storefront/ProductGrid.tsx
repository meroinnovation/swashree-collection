import type { Product } from "@/sanity/schemas";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 2 | 3 | 4;
}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
        <p className="text-sm text-stone-500">
          No products yet. Add products from the admin panel at{" "}
          <span className="font-semibold text-rose-700">/studio</span>.
        </p>
      </div>
    );
  }
  const colsMap: Record<2 | 3 | 4, string> = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4",
  };
  const cols = colsMap[columns];
  return (
    <div className={`grid ${cols} gap-4 sm:gap-6`}>
      {products.map((p, i) => (
        <ProductCard key={p._id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}