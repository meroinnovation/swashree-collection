"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { npr } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import type { SiteSettings } from "@/lib/sanity";
import {
  eSewaGatewayUrl,
  eSewaMerchantId,
  getSiteUrl,
  isConfiguredGateway,
} from "@/lib/payments/config";

type PaymentMethod = "cod" | "esewa" | "khalti";

export default function CheckoutForm({ settings }: { settings: Partial<SiteSettings> }) {
  const { items, subtotal, coupon } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    settings.codEnabled === false ? (isConfiguredGateway("esewa") ? "esewa" : "khalti") : "cod"
  );
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const discount = coupon?.discountAmount || 0;
  const afterDiscount = subtotal - discount;
  const deliveryFee =
    settings.freeShippingOver && afterDiscount >= settings.freeShippingOver ? 0 : settings.deliveryFee || 100;
  const total = afterDiscount + deliveryFee;

  const availableMethods = useMemo(() => {
    const methods: { id: PaymentMethod; label: string; desc: string; enabled: boolean }[] = [
      { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives.", enabled: settings.codEnabled !== false },
      { id: "esewa", label: "eSewa", desc: "Pay securely with eSewa wallet.", enabled: settings.esewaEnabled !== false && isConfiguredGateway("esewa") },
      { id: "khalti", label: "Khalti", desc: "Pay with Khalti wallet / app.", enabled: settings.khaltiEnabled !== false && isConfiguredGateway("khalti") },
    ];
    return methods.filter((m) => m.enabled);
  }, [settings]);

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const placeOrder = async () => {
    setError(null);

    if (!form.name.trim()) return setError("Please enter your full name.");
    if (form.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid phone number.");
    if (availableMethods.length === 0) return setError("No payment method is available right now.");
    if (items.length === 0) return setError("Your cart is empty.");

    setPlacing(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.qty,
            size: i.size,
            color: i.color,
          })),
          couponCode: coupon?.code,
          paymentMethod,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Could not place the order.");

      const orderNumber: string = data.orderNumber;

      if (paymentMethod === "cod") {
        router.push(`/checkout/success?order=${orderNumber}`);
        return;
      }

      if (paymentMethod === "khalti") {
        const khaltiRes = await fetch("/api/payments/khalti/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber,
            amountPaise: Math.round(total * 100),
            customerInfo: { name: form.name, email: form.email || undefined, phone: form.phone },
          }),
        });
        const khaltiData = await khaltiRes.json().catch(() => ({}));
        if (!khaltiRes.ok || !(khaltiData as { paymentUrl?: string }).paymentUrl)
          throw new Error((khaltiData as { error?: string }).error || "Could not start Khalti payment.");
        window.location.assign((khaltiData as { paymentUrl: string }).paymentUrl);
        return;
      }

      if (paymentMethod === "esewa") {
        const params = new URLSearchParams({
          amt: String(Math.round(total)),
          pdc: "0",
          psc: "0",
          txAmt: "0",
          tAmt: String(Math.round(total)),
          pid: orderNumber,
          scd: eSewaMerchantId,
          su: `${getSiteUrl()}/checkout/success?order=${orderNumber}`,
          fu: `${getSiteUrl()}/checkout?failed=1`,
          sms: "0",
        });
        window.location.href = `${eSewaGatewayUrl}?${params.toString()}`; // eslint-disable-line @next/next/no-location-assign-relative-destination
        return;
      }
    } catch (err) {
      setPlacing(false);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-5">
      {/* Form */}
      <div className="space-y-8 lg:col-span-3">
        {/* Contact */}
        <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-stone-900">Contact & Delivery</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Full Name *</label>
              <input value={form.name} onChange={update("name")} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Phone *</label>
              <input value={form.phone} onChange={update("phone")} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none" placeholder="98XXXXXXXX" inputMode="tel" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Email (optional)</label>
              <input value={form.email} onChange={update("email")} type="email" className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none" placeholder="you@email.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">City / District *</label>
              <input value={form.city} onChange={update("city")} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none" placeholder="Kathmandu" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Delivery Address *</label>
              <input value={form.address} onChange={update("address")} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none" placeholder="House, street, area, landmark" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-500">Order note (optional)</label>
              <textarea value={form.note} onChange={update("note")} rows={2} className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none" placeholder="Gift message, special instructions…" />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-stone-900">Payment Method</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {availableMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  paymentMethod === m.id ? "border-rose-600 bg-rose-50" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <span className={`text-sm font-bold ${paymentMethod === m.id ? "text-rose-700" : "text-stone-800"}`}>
                  {m.label}
                </span>
                <span className="mt-1 block text-xs text-stone-500">{m.desc}</span>
              </button>
            ))}
          </div>
          {availableMethods.length === 0 && (
            <p className="mt-3 text-sm text-red-600">No payment methods enabled. You can still order on WhatsApp.</p>
          )}
        </section>
      </div>

      {/* Summary */}
      <div className="h-fit space-y-6 rounded-2xl border border-stone-100 bg-stone-50 p-6 lg:col-span-2 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-bold text-stone-900">Order Summary</h2>
        <div className="max-h-64 space-y-3 overflow-auto pr-1">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
                <p className="text-xs text-stone-500">
                  {item.qty} × {npr(item.price)}
                  {item.size ? ` · ${item.size}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-stone-900">{npr(item.qty * item.price)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 border-t border-stone-200 pt-4 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">{npr(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Coupon ({coupon?.code})</span>
              <span>− {npr(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-600">
            <span>Delivery</span>
            <span className="font-semibold text-stone-900">{deliveryFee === 0 ? "FREE" : npr(deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
            <span className="font-bold text-stone-900">Total</span>
            <span className="font-display text-xl font-bold text-rose-700">{npr(total)}</span>
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={placing}
          className="w-full rounded-full bg-rose-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-rose-700/20 transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {placing ? "Placing order…" : paymentMethod === "cod" ? "Place Order" : `Pay with ${paymentMethod === "esewa" ? "eSewa" : "Khalti"}`}
        </button>
        <p className="text-center text-xs text-stone-400">
          By placing your order you agree to be contacted on the phone number above.
        </p>
      </div>
    </div>
  );
}