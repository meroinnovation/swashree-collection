import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { categoriesQuery, sanityFetch, siteSettingsQuery, type SiteSettings, type Category } from "@/lib/sanity";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Swashree Collection — Gifts & Fine Collections in Nepal",
    template: "%s · Swashree Collection",
  },
  description:
    "Curated gifts, fashion and fine collections in Nepal. Fast delivery in Kathmandu Valley and nationwide, with Cash on Delivery, eSewa and Khalti.",
  keywords: ["swashree collection", "gifts nepal", "online shopping nepal", "esewa", "khalti"],
  openGraph: {
    title: "Swashree Collection",
    description: "Curated gifts & fine collections in Nepal.",
    type: "website",
  },
};

async function getLayoutData() {
  const [settings, categories] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    sanityFetch<Category[]>(categoriesQuery),
  ]);
  return {
    settings: settings || ({} as SiteSettings),
    categories: (categories || [])
      .filter((c) => Boolean(c.slug))
      .map((c: Category) => ({ slug: c.slug as string, name: c.name })),
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { settings, categories } = await getLayoutData();

  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <CartProvider>
          <Header settings={settings} categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} categories={categories} />
        </CartProvider>
      </body>
    </html>
  );
}