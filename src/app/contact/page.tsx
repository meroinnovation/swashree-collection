import type { Metadata } from "next";
import type { ReactElement, SVGProps } from "react";
import { sanityFetch, siteSettingsQuery, type SiteSettings } from "@/lib/sanity";
import { IconFacebook, IconInstagram, IconMail, IconMapPin, IconPhone, IconTiktok, IconWhatsapp } from "@/components/icons";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  const wa = settings?.whatsapp?.replace(/[^0-9]/g, "");

  const items: Array<{
    icon: (props: SVGProps<SVGSVGElement>) => ReactElement;
    label: string;
    value: string;
    href?: string;
  }> = [];
  if (settings?.phone)
    items.push({
      icon: IconPhone,
      label: "Call us",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^0-9+]/g, "")}`,
    });
  if (settings?.email)
    items.push({ icon: IconMail, label: "Email us", value: settings.email, href: `mailto:${settings.email}` });
  if (settings?.address) items.push({ icon: IconMapPin, label: "Visit / address", value: settings.address });
  if (wa)
    items.push({ icon: IconWhatsapp, label: "WhatsApp", value: `+${settings?.whatsapp}`, href: `https://wa.me/${wa}` });

  const socials = [
    { href: settings?.facebook, Icon: IconFacebook, label: "Facebook" },
    { href: settings?.instagram, Icon: IconInstagram, label: "Instagram" },
    { href: settings?.tiktok, Icon: IconTiktok, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-rose-600">Get in touch</p>
      <h1 className="font-display mt-3 text-center text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        Contact Us
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-stone-500">
        Questions about an order, custom gifting or bulk requests? We usually reply within a few hours.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-stone-50 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-rose-700 shadow-sm">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{item.label}</p>
              {item.href ? (
                <a href={item.href} target={item.label === "WhatsApp" ? "_blank" : undefined} rel="noreferrer" className="text-sm font-semibold text-stone-800 hover:text-rose-700">
                  {item.value}
                </a>
              ) : (
                <p className="text-sm font-semibold text-stone-800">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {wa && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-emerald-50 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-emerald-800">Prefer to chat?</h2>
          <p className="max-w-md text-sm text-emerald-700">
            Send us a WhatsApp message and we will help you pick the perfect gift, check stock, or place your order.
          </p>
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent("Hello Swashree Collection! I have a question.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <IconWhatsapp className="h-4 w-4" /> Start a WhatsApp chat
          </a>
        </div>
      )}

      {socials.length > 0 && (
        <div className="mt-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Follow us</p>
          <div className="mt-4 flex justify-center gap-3">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-rose-300 hover:text-rose-700"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}