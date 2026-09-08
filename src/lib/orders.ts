import "server-only";
import { createClient, type SanityDocumentStub } from "next-sanity";
import { apiVersion, dataset, projectId, writeToken } from "@/sanity/env";
import type { OrderItem } from "@/lib/sanity";

const writeClient = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken || undefined,
});

export type OrderInput = {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    address?: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: "cod" | "esewa" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  transactionId?: string;
};

export async function createOrder(input: OrderInput) {
  if (!writeToken) throw new Error("SANITY_API_WRITE_TOKEN is not configured");

  const filter = `*[_type == "order" && orderNumber == $orderNumber][0]`;
  const existing = await writeClient.fetch(filter, { orderNumber: input.orderNumber });
  if (existing) return existing;

  return writeClient.create({
    _type: "order",
    orderNumber: input.orderNumber,
    customer: input.customer,
    items: input.items.map((i) => ({
      _key: `${i.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      _type: "item",
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      size: i.size || "",
      color: i.color || "",
      image: i.image,
    })),
    subtotal: Math.round(input.subtotal),
    discount: Math.round(input.discount),
    deliveryFee: Math.round(input.deliveryFee),
    total: Math.round(input.total),
    couponCode: input.couponCode,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    orderStatus: "new",
    transactionId: input.transactionId,
    _createdAt: new Date().toISOString(),
  } as SanityDocumentStub);
}

export async function getOrderByNumber(orderNumber: string) {
  const filter = `*[_type == "order" && orderNumber == $orderNumber][0]`;
  return writeClient.fetch(filter, { orderNumber });
}

export async function updateOrderPayment(
  orderNumber: string,
  update: { paymentStatus: "pending" | "paid" | "failed"; transactionId?: string }
) {
  const order = await getOrderByNumber(orderNumber);
  if (!order) return null;
  return writeClient
    .patch(order._id)
    .set({
      paymentStatus: update.paymentStatus,
      transactionId: update.transactionId || order.transactionId,
      orderStatus: update.paymentStatus === "paid" ? "confirmed" : order.orderStatus,
    })
    .commit();
}

export async function incrementCouponUse(code: string) {
  if (!writeToken) return;
  const coupon = await writeClient.fetch(
    `*[_type == "coupon" && code == $code][0]{_id, usedCount}`,
    { code }
  );
  if (!coupon) return;
  await writeClient
    .patch(coupon._id)
    .set({ usedCount: (coupon.usedCount || 0) + 1 })
    .commit()
    .catch(() => undefined);
}

export type ValidatedCoupon = {
  valid: boolean;
  code?: string;
  discountType?: "percent" | "flat";
  discountValue?: number;
  discountAmount?: number;
  message?: string;
};

export async function validateCoupon(code: string, subtotal: number): Promise<ValidatedCoupon> {
  const normalized = (code || "").trim().toUpperCase();
  if (!normalized) return { valid: false, message: "Enter a coupon code." };

  const result = await writeClient.fetch(
    `*[_type == "coupon" && code == $code][0]{
      discountType, discountValue, minOrderAmount, expiresAt, maxUses, usedCount, isActive
    }`,
    { code: normalized }
  );

  if (!result) return { valid: false, message: "Coupon not found." };
  if (!result.isActive) return { valid: false, message: "This coupon is inactive." };
  if (result.expiresAt && new Date(result.expiresAt).getTime() < Date.now())
    return { valid: false, message: "This coupon has expired." };
  if (result.maxUses && (result.usedCount || 0) >= result.maxUses)
    return { valid: false, message: "This coupon has already reached its usage limit." };
  if (result.minOrderAmount && subtotal < result.minOrderAmount)
    return {
      valid: false,
      message: `Minimum order of Rs. ${result.minOrderAmount} required for this coupon.`,
    };

  const discountAmount =
    result.discountType === "percent"
      ? Math.round((subtotal * result.discountValue) / 100)
      : Math.min(result.discountValue, subtotal);

  return {
    valid: true,
    code: normalized,
    discountType: result.discountType,
    discountValue: result.discountValue,
    discountAmount,
  };
}