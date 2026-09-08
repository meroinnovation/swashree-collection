import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch, siteSettingsQuery, type SiteSettings } from "@/lib/sanity";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const storeName = settings?.storeName || "Swashree Collection";

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-rose-600">Our Story</p>
      <h1 className="font-display mt-3 text-center text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        About {storeName}
      </h1>

      <div className="mt-12 space-y-6 text-base leading-relaxed text-stone-600">
        <p>
          <span className="font-semibold text-stone-900">{storeName}</span> began with a simple idea — that
          the most meaningful gifts are the ones chosen with heart. We curate a collection of fashion,
          accessories and gift items that make every occasion feel special, from birthdays to festivals
          like Tihar, Dashain and New Year.
        </p>
        <p>
          Based in Nepal, we understand local tastes, festivals and delivery realities. That is why we offer
          flexible options felt at home: <span className="font-semibold text-stone-900">Cash on Delivery</span>,
          <span className="font-semibold text-stone-900"> eSewa</span> and{" "}
          <span className="font-semibold text-stone-900">Khalti</span>, same-day delivery across the Valley and
          nationwide courier service.
        </p>
        <p>
          Every item we list is handpicked, quality-checked and wrapped with care. If it is not something we
          would gift to our own family, it does not make the collection.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Handpicked", text: "Every product is personally selected and checked for quality." },
          { title: "Locally loved", text: "Curated for Nepali tastes, festivals and occasions." },
          { title: "Hassle-free", text: "COD, eSewa, Khalti and easy WhatsApp ordering." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-stone-100 bg-stone-50 p-6">
            <h3 className="font-display text-lg font-bold text-rose-700">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-rose-900 px-8 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Ready to find something special?</h2>
        <p className="mt-3 text-sm text-rose-100">
          Browse the collection or message us on WhatsApp — we are happy to help you choose.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="rounded-full bg-amber-400 px-8 py-3.5 text-sm font-bold text-stone-900 transition hover:bg-amber-300">
            Shop Now
          </Link>
          <Link href="/contact" className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}