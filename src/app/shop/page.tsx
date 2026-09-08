import Link from "next/link";
import { categoriesQuery, productsQuery, sanityFetch, type Category } from "@/lib/sanity";
import type { Product } from "@/sanity/schemas";
import ProductGrid from "@/components/storefront/ProductGrid";
import SectionHeading from "@/components/storefront/SectionHeading";

export const metadata = { title: "Shop All" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const q = (params.q || "").trim().toLowerCase();
  const sort = params.sort || "";

  const [products, categories] = await Promise.all([
    sanityFetch<Product[]>(productsQuery),
    sanityFetch<Category[]>(categoriesQuery),
  ]);

  let filtered = (products || []).filter((p) => {
    const inCategory = !category || p.category?.slug === category;
    const inSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      (p.shortDescription || "").toLowerCase().includes(q);
    return inCategory && inSearch;
  });

  switch (sort) {
    case "price-asc":
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case "name":
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const activeCategory = categories?.find((c) => c.slug === category);

  return (
    <>
      <section className="border-b border-stone-100 bg-gradient-to-b from-rose-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/" className="text-xs font-medium text-stone-400 hover:text-rose-700">
            Home
          </Link>
          <SectionHeading
            center={false}
            eyebrow={activeCategory ? "Category" : "Collection"}
            title={activeCategory?.name || "Shop All"}
            subtitle={activeCategory?.description || "Every piece in our collection — freshly curated."}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <Link
              href="/shop"
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                !category ? "bg-rose-700 text-white" : "border border-stone-200 text-stone-600 hover:border-rose-300"
              }`}
            >
              All Items
            </Link>
            {categories?.map((c) => (
              <Link
                key={c._id}
                href={`/shop?category=${c.slug}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === c.slug
                    ? "bg-rose-700 text-white"
                    : "border border-stone-200 text-stone-600 hover:border-rose-300"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {q && (
              <p className="text-sm text-stone-500">
                {filtered.length} result{filtered.length === 1 ? "" : "s"} for “{q}”
              </p>
            )}
            <select
              defaultValue={sort}
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set("sort", e.target.value);
                else url.searchParams.delete("sort");
                if (category) url.searchParams.set("category", category);
                window.location.href = url.toString();
              }}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 && !q && !category ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
            <p className="text-sm text-stone-500">
              No products yet. Add products from the admin panel at{" "}
              <Link href="/studio" className="font-semibold text-rose-700 underline">
                /studio
              </Link>
              .
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 py-16 text-center">
            <p className="text-sm text-stone-500">No products match your filters.</p>
            <Link href="/shop" className="mt-3 inline-block text-sm font-semibold text-rose-700 hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <ProductGrid products={filtered} columns={4} />
        )}
      </section>
    </>
  );
}