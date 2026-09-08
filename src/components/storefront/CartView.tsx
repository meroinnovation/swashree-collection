"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { npr } from "@/lib/format";
import type { SiteSettings } from "@/lib/sanity";
import { SmartImage } from "@/components/image";
import { IconX } from "@/components/icons";

export default function CartView({ settings }: { settings: Partial<SiteSettings> }) {
  const { items, removeItem, setQty, subtotal, coupon, setCoupon } = useCart();
  const [codeInput, setCodeInput] = useState(coupon?.code || "");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [couponErr, setCouponErr] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const discount = coupon?.discountAmount || 0;
  const afterDiscount = subtotal - discount;
  const deliveryFee =
    settings.freeShippingOver && afterDiscount >= settings.freeShippingOver
      ? 0
      : settings.deliveryFee || 100;
  const total = afterDiscount + deliveryFee;

  const applyCoupon = async () => {
    const code = codeInput.trim();
    if (!code) return;
    setChecking(true);
    setCouponMsg(null);
    setCouponErr(null);
    try {
      const res = await fetch(`/api/coupon?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (data.valid) {
        setCoupon(data);
        setCouponMsg(data.message || "Coupon applied!");
      } else {
        setCoupon(null);
        setCouponErr(data.message || "Invalid coupon.");
      }
    } catch {
      setCouponErr("Could not check the coupon right now.");
    } finally {
      setChecking(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-display text-2xl font-bold text-stone-900">Your cart is empty</p>
        <p className="mt-2 text-sm text-stone-500">Looks like you have not added anything yet.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-rose-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-3xl font-bold tracking-tight text-stone-900">Your Cart</h1>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
              <Link href={`/product/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                <SmartImage src={item.image} alt={item.name} sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/product/${item.slug}`} className="text-sm font-semibold text-stone-900 hover:text-rose-700">
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="mt-0.5 text-xs text-stone-500">
                        {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold text-rose-700">{npr(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    aria-label="Remove item"
                    className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-stone-200">
                    <button
                      onClick={() => setQty(item.productId, item.qty - 1, item.size, item.color)}
                      className="px-3 py-1.5 text-stone-600 hover:text-rose-700"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.productId, item.qty + 1, item.size, item.color)}
                      className="px-3 py-1.5 text-stone-600 hover:text-rose-700"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-auto text-sm font-bold text-stone-900">{npr(item.price * item.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-2xl border border-stone-100 bg-stone-50 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-stone-900">Order Summary</h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{npr(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({coupon?.code})</span>
                <span className="font-semibold">− {npr(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery</span>
              <span className="font-semibold text-stone-900">{deliveryFee === 0 ? "FREE" : npr(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
              <span className="font-bold text-stone-900">Total</span>
              <span className="font-display font-bold text-rose-700">{npr(total)}</span>
            </div>
          </div>

          {/* Coupon */}
          <div className="mt-6">
            <div className="flex gap-2">
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="min-w-0 flex-1 rounded-full border border-stone-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                disabled={checking || !codeInput.trim()}
                className="rounded-full bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-700 disabled:opacity-40"
              >
                {checking ? "..." : "Apply"}
              </button>
            </div>
            {couponMsg && <p className="mt-2 text-xs text-emerald-600">{couponMsg}</p>}
            {couponErr && <p className="mt-2 text-xs text-red-600">{couponErr}</p>}
            {discount > 0 && (
              <button
                onClick={() => {
                  setCoupon(null);
                  setCodeInput("");
                  setCouponMsg(null);
                }}
                className="mt-2 text-xs font-medium text-stone-500 underline hover:text-rose-700"
              >
                Remove coupon
              </button>
            )}
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-rose-700 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-rose-700/20 transition hover:bg-rose-800"
          >
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-xs font-medium text-stone-500 hover:text-rose-700">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}