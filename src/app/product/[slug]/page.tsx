import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productBySlugQuery, sanityFetch, siteSettingsQuery, type SiteSettings, type ProductDetail } from "@/lib/sanity";
import { npr } from "@/lib/format";
import Gallery from "@/components/storefront/Gallery";
import ProductActions from "@/components/storefront/ProductActions";
import ProductGrid from "@/components/storefront/ProductGrid";
import RichText from "@/components/storefront/RichText";
import { IconTruck } from "@/components/icons";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await sanityFetch<ProductDetail>(productBySlugQuery, { slug });
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    sanityFetch<ProductDetail>(productBySlugQuery, { slug }),
    sanityFetch<SiteSettings>(siteSettingsQuery),
  ]);

  if (!product) notFound();

  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);
  const tags = product.tags || [];

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-medium text-stone-400">
          <Link href="/" className="hover:text-rose-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-rose-700">Shop</Link>
          {product.category?.slug && (
            <>
              <span>/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-rose-700">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-stone-600">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Gallery images={product.images || []} name={product.name} />

          <div className="lg:pt-2">
            <Link
              href={`/category/${product.category?.slug}`}
              className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600 hover:text-rose-800"
            >
              {product.category?.name}
            </Link>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-rose-700">{npr(product.price)}</span>
              {onSale && (
                <>
                  <span className="text-lg text-stone-400 line-through">{npr(product.compareAtPrice)}</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    SAVE {npr((product.compareAtPrice || 0) - product.price)}
                  </span>
                </>
              )}
            </div>

            {product.shortDescription && (
              <p className="mt-5 leading-relaxed text-stone-600">{product.shortDescription}</p>
            )}

            <div className="mt-7">
              <ProductActions
                product={{
                  _id: product._id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  image: product.images?.[0]?.url,
                  sizes: product.sizes,
                  colors: product.colors,
                  inStock: product.inStock,
                  isGiftWrappable: product.isGiftWrappable,
                }}
                whatsapp={settings?.whatsapp}
              />
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
              <IconTruck className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <p>
                <span className="font-semibold text-stone-900">Delivery:</span>{" "}
                {settings?.extraDeliveryNote ||
                  `Rs. ${settings?.deliveryFee || 100} flat across the Valley`}
                {settings?.freeShippingOver ? ` · free above ${npr(settings.freeShippingOver)}` : ""}
              </p>
            </div>

            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t}
                    href={`/shop?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-500 transition hover:border-rose-300 hover:text-rose-700"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-display mb-4 text-2xl font-bold text-stone-900">Product Details</h2>
            <RichText value={product.description} />
          </div>
        )}
      </section>

      {/* Related */}
      {product.related && product.related.length > 0 && (
        <section className="border-t border-stone-100 bg-stone-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-display mb-8 text-2xl font-bold text-stone-900">You may also like</h2>
            <ProductGrid products={product.related} columns={4} />
          </div>
        </section>
      )}
    </>
  );
}