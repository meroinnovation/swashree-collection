import Link from "next/link";
import { sanityFetch, siteSettingsQuery, type SiteSettings } from "@/lib/sanity";
import { npr, formatDate } from "@/lib/format";
import { getOrderByNumber, updateOrderPayment, incrementCouponUse } from "@/lib/orders";
import { khaltiLookup, esewaVerify } from "@/lib/payments/service";
import { eSewaMerchantId } from "@/lib/payments/config";
import CartClearer from "@/components/storefront/CartClearer";
import { IconWhatsapp } from "@/components/icons";

export const metadata = { title: "Order Confirmation" };
export const dynamic = "force-dynamic";

type OrderDoc = {
  orderNumber: string;
  total?: number;
  paymentStatus?: string;
  transactionId?: string;
  couponCode?: string;
  _createdAt?: string;
  customer?: { name?: string; phone?: string };
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const orderNumber = sp.order || "";
  const pidx = sp.pidx || "";
  const refId = sp.refId || "";
  const amt = sp.amt || "0";

  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery);

  let paymentStatus = "pending";
  let transactionId = sp.transaction_id || sp.txnid || pidx || refId;

  if (!orderNumber) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="font-display text-2xl font-bold text-stone-900">No order found</p>
        <Link href="/shop" className="mt-6 inline-block text-sm font-semibold text-rose-700 hover:underline">
          Back to shop
        </Link>
      </section>
    );
  }

  if (pidx) {
    try {
      const lookup = await khaltiLookup(pidx);
      if (lookup.status === "Completed") {
        paymentStatus = "paid";
        transactionId = lookup.transaction_id || pidx;
        await updateOrderPayment(orderNumber, { paymentStatus: "paid", transactionId });
        const order = await getOrderByNumber(orderNumber).catch(() => null);
        if (order?.couponCode) await incrementCouponUse(order.couponCode);
      } else {
        paymentStatus = "failed";
        await updateOrderPayment(orderNumber, { paymentStatus: "failed", transactionId: pidx }).catch(() => null);
      }
    } catch {
      // leave as pending if lookup failed
    }
  } else if (refId && eSewaMerchantId) {
    try {
      const result = await esewaVerify({ scd: eSewaMerchantId, amt, rid: refId, pid: orderNumber });
      if (result.ok) {
        paymentStatus = "paid";
        transactionId = refId;
        await updateOrderPayment(orderNumber, { paymentStatus: "paid", transactionId });
        const order = await getOrderByNumber(orderNumber).catch(() => null);
        if (order?.couponCode) await incrementCouponUse(order.couponCode);
      } else {
        paymentStatus = "failed";
        await updateOrderPayment(orderNumber, { paymentStatus: "failed", transactionId: refId }).catch(() => null);
      }
    } catch {
      // leave as pending
    }
  }

  const order = await getOrderByNumber(orderNumber).catch(() => null) as unknown as OrderDoc | null;
  const paid = paymentStatus === "paid";
  const failed = paymentStatus === "failed";
  const whatsapp = settings?.whatsapp?.replace(/[^0-9]/g, "");

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <CartClearer />

      <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl ${failed ? "bg-red-50" : paid ? "bg-emerald-50" : "bg-amber-50"}`}>
        {failed ? "⚠️" : paid ? "✅" : "🕐"}
      </div>

      <h1 className="font-display mt-6 text-center text-3xl font-bold tracking-tight text-stone-900">
        {failed ? "Payment failed" : paid ? "Payment received!" : "Order placed!"}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-stone-500">
        {failed
          ? "Your payment did not go through. Your order is saved and we will reach out on WhatsApp/phone to help you complete it."
          : paid
            ? "Thank you! Your payment is confirmed and we have started preparing your order."
            : `Thank you! Your order is confirmed. ${
                order?.customer?.name ? ` ${order.customer.name}, ` : ""
              }We will call you on your phone to arrange delivery.`}
      </p>

      <div className="mt-10 rounded-2xl border border-stone-100 bg-stone-50 p-6">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Order No.</p>
            <p className="mt-1 font-bold text-stone-900">{order?.orderNumber || orderNumber}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Total</p>
            <p className="mt-1 font-bold text-rose-700">{npr(order?.total ?? 0)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Payment</p>
            <p className="mt-1 font-semibold text-stone-900">
              {paid ? "Paid" : failed ? "Failed" : "Pay on delivery"}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Placed</p>
            <p className="mt-1 font-semibold text-stone-900">{formatDate(order?._createdAt)}</p>
          </div>
        </div>
        {transactionId && (
          <p className="mt-4 border-t border-stone-200 pt-3 text-xs text-stone-400">
            Transaction ID: <span className="font-medium text-stone-600">{transactionId}</span>
          </p>
        )}
      </div>

      {whatsapp && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-emerald-50 p-5">
          <p className="text-sm text-emerald-800">
            For faster processing, send your order number to us on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello! I just placed order ${orderNumber}. Please confirm.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <IconWhatsapp className="h-4 w-4" /> Confirm on WhatsApp
          </a>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-full bg-rose-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-800"
        >
          Continue Shopping
        </Link>
        <Link href="/" className="rounded-full border border-stone-300 px-8 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-rose-400 hover:text-rose-700">
          Back to Home
        </Link>
      </div>
    </section>
  );
}