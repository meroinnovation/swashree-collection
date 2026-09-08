import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlugQuery, productsByCategoryQuery, sanityFetch, type Category } from "@/lib/sanity";
import type { Product } from "@/sanity/schemas";
import ProductGrid from "@/components/storefront/ProductGrid";
import { SmartImage } from "@/components/image";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await sanityFetch<Category>(categoryBySlugQuery, { slug });
  return { title: category?.name || "Category" };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    sanityFetch<Category>(categoryBySlugQuery, { slug }),
    sanityFetch<Product[]>(productsByCategoryQuery, { slug }),
  ]);

  if (!category) notFound();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative h-64 sm:h-80">
          <SmartImage
            src={category.image?.url}
            alt={category.name}
            priority
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-stone-900/20" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-white">Shop</Link>
            </nav>
            <h1 className="font-display text-4xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="mt-2 max-w-2xl text-sm text-white/85">{category.description}</p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm font-medium text-stone-500">
          {products?.length || 0} {products?.length === 1 ? "item" : "items"} in this collection
        </p>
        <ProductGrid products={products || []} columns={4} />
      </section>
    </>
  );
}