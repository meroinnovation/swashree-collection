import Link from "next/link";
import type { ReactElement, SVGProps } from "react";
import type { SiteSettings } from "@/lib/sanity";
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconTiktok,
  IconWhatsapp,
} from "@/components/icons";

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: { slug: string; name: string }[];
}) {
  const storeName = settings.storeName || "Swashree Collection";
  const year = new Date().getFullYear();
  type Social = {
    href: string;
    Icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
    label: string;
  };
  const socials: Social[] = [
    { href: settings.facebook || "", Icon: IconFacebook, label: "Facebook" },
    { href: settings.instagram || "", Icon: IconInstagram, label: "Instagram" },
    { href: settings.tiktok || "", Icon: IconTiktok, label: "TikTok" },
    {
      href: settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` : "",
      Icon: IconWhatsapp,
      label: "WhatsApp",
    },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="border-t border-stone-100 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-rose-800 font-display text-lg font-black text-white">
                S
              </span>
              <span className="font-display text-lg font-bold text-stone-900">{storeName}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
              {settings.footerText ||
                "Curated gifts and fine collections for every occasion. Handpicked with love in Nepal — delivery across Kathmandu Valley and nationwide."}
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-rose-300 hover:text-rose-700"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="text-stone-500 hover:text-rose-700">
                  All Products
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="text-stone-500 hover:text-rose-700">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/cart" className="text-stone-500 hover:text-rose-700">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-500">
              {settings.phone && (
                <li className="flex items-center gap-2.5">
                  <IconPhone className="h-4 w-4 shrink-0 text-rose-600" />
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-rose-700">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <IconMail className="h-4 w-4 shrink-0 text-rose-600" />
                  <a href={`mailto:${settings.email}`} className="hover:text-rose-700">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <IconWhatsapp className="h-4 w-4 shrink-0 text-rose-600" />
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-rose-700"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-stone-200 pt-6 text-xs text-stone-400 sm:flex-row">
          <p>
            © {year} {storeName}. All rights reserved.
          </p>
          <p>
            Handcrafted with <span className="text-rose-500">♥</span> in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}