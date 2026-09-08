import Link from "next/link";
import {
  featuredProductsQuery,
  categoriesQuery,
  sanityFetch,
  siteSettingsQuery,
  type SiteSettings,
  type Category,
} from "@/lib/sanity";
import type { Product } from "@/sanity/schemas";
import ProductGrid from "@/components/storefront/ProductGrid";
import SectionHeading from "@/components/storefront/SectionHeading";
import { SmartImage } from "@/components/image";
import { IconGift, IconShield, IconTruck, IconWhatsapp } from "@/components/icons";

export default async function HomePage() {
  const [settings, featured, categories] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    sanityFetch<Product[]>(featuredProductsQuery),
    sanityFetch<Category[]>(categoriesQuery),
  ]);

  const heroImage = settings?.heroImage?.url;
  const storeName = settings?.storeName || "Swashree Collection";

  const trust = [
    { icon: IconTruck, title: "Fast Delivery", text: "Same-day in Kathmandu Valley, nationwide by courier." },
    { icon: IconShield, title: "Secure Payments", text: "Cash on Delivery, eSewa & Khalti available." },
    { icon: IconGift, title: "Gift Ready", text: "Beautifully wrapped, ready-to-gift packaging." },
    { icon: IconWhatsapp, title: "Easy Support", text: "Order or ask questions on WhatsApp anytime." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-rose-50 to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-600">
              Swashree Collection · Nepal
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              {settings?.heroTitle || "Gifts that feel made just for them."}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:mx-0">
              {settings?.heroSubtitle ||
                "Discover handpicked gifts, fashion and fine collections curated in Nepal — delivered to your door with love."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/shop"
                className="rounded-full bg-rose-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-700/20 transition hover:bg-rose-800"
              >
                Shop Collection
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-stone-300 bg-white px-8 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-rose-400 hover:text-rose-700"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-2xl">
              <SmartImage src={heroImage} alt="Swashree Collection" priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white px-6 py-4 shadow-xl ring-1 ring-stone-100 sm:block">
              <p className="font-display text-xl font-bold text-rose-700">100%</p>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Genuine & handpicked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-stone-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trust.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trending Now"
            title={settings?.featuredHeading || "Featured Collections"}
            subtitle="A curated edit of our most-loved pieces, updated fresh every season."
            action={{ href: "/shop", label: "View All" }}
          />
          <ProductGrid products={featured} columns={4} />
        </section>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Browse by Category"
            title="Shop by Category"
            subtitle="From everyday essentials to once-in-a-lifetime occasions."
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group relative block overflow-hidden rounded-2xl bg-stone-100"
              >
                <div className="relative aspect-[4/5]">
                  <SmartImage
                    src={cat.image?.url}
                    alt={cat.name}
                    className="transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/70 to-transparent p-4 pt-12">
                  <p className="font-display text-lg font-bold text-white">{cat.name}</p>
                  <p className="text-xs font-medium text-white/80 opacity-0 transition group-hover:opacity-100">
                    Shop now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About / CTA strip */}
      <section className="bg-rose-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-300">About {storeName}</p>
            <h2 className="font-display mt-3 max-w-2xl text-2xl font-bold leading-snug text-white sm:text-3xl">
              Every order is a little act of love — wrapped, packed and delivered with care.
            </h2>
          </div>
          <Link
            href="/about"
            className="shrink-0 rounded-full bg-amber-400 px-8 py-3.5 text-sm font-bold text-stone-900 transition hover:bg-amber-300"
          >
            Read Our Story
          </Link>
        </div>
      </section>
    </>
  );
}