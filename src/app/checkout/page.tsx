import type { Metadata } from "next";
import { sanityFetch, siteSettingsQuery, type SiteSettings } from "@/lib/sanity";
import CheckoutForm from "@/components/storefront/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ failed?: string }>;
}) {
  const [settings, params] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    searchParams,
  ]);
  const failed = params.failed === "1";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-3xl font-bold tracking-tight text-stone-900">Checkout</h1>
      {failed && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
          Payment was cancelled or did not complete. You can try again below — your items are still in the cart.
        </div>
      )}
      <CheckoutForm settings={settings || {}} />
    </section>
  );
}