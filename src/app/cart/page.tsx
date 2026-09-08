import type { Metadata } from "next";
import { sanityFetch, siteSettingsQuery, type SiteSettings } from "@/lib/sanity";
import CartView from "@/components/storefront/CartView";

export const metadata: Metadata = { title: "Your Cart" };

export default async function CartPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  return <CartView settings={settings || {}} />;
}