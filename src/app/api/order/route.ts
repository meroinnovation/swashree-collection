import { NextResponse } from "next/server";
import { projectId } from "@/sanity/env";
import { client, siteSettingsQuery, type SiteSettings, type OrderItem } from "@/lib/sanity";
import { createOrder, validateCoupon, incrementCouponUse } from "@/lib/orders";
import { generateOrderNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

type Body = {
  customer: { name: string; phone: string; email?: string; city?: string; address?: string; note?: string };
  items: Array<{ productId: string; quantity: number; size?: string; color?: string }>;
  couponCode?: string;
  paymentMethod?: "cod" | "esewa" | "khalti";
};

export async function POST(request: Request) {
  try {
    if (!projectId) {
      return NextResponse.json({ error: "Orders are not enabled yet (admin panel needs setup)." }, { status: 503 });
    }
    const body = (await request.json()) as Body;

    if (!body?.customer?.name || !body?.customer?.phone) {
      return NextResponse.json({ error: "Name and phone number are required." }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const paymentMethod = body.paymentMethod || "cod";
    if (!["cod", "esewa", "khalti"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }

    const ids = body.items.map((i) => i.productId);
    const products = await client.fetch<Array<{ _id: string; name: string; price: number; inStock?: boolean }>>(
      `*[_type == "product" && _id in $ids]{ _id, name, price, inStock }`,
      { ids }
    );
    const productMap = new Map(products.map((p) => [p._id, p]));
    const canFetch = products.length === body.items.length;

    if (!canFetch) {
      return NextResponse.json({ error: "One or more products are no longer available." }, { status: 400 });
    }

    const items: OrderItem[] = body.items.map((i) => {
      const product = productMap.get(i.productId)!;
      if (product.inStock === false) {
        throw new Error(`${product.name} is out of stock.`);
      }
      return {
        productId: i.productId,
        name: product.name,
        price: product.price,
        quantity: Math.min(Math.max(1, Number(i.quantity) || 1), 20),
        size: i.size,
        color: i.color,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    let couponCode: string | undefined;
    let discount = 0;
    if (body.couponCode) {
      const couponResult = await validateCoupon(body.couponCode, subtotal);
      if (!couponResult.valid) {
        return NextResponse.json({ error: couponResult.message || "Invalid coupon." }, { status: 400 });
      }
      couponCode = couponResult.code;
      discount = couponResult.discountAmount || 0;
    }

    const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
    const afterDiscount = subtotal - discount;
    const deliveryFee =
      settings?.freeShippingOver && afterDiscount >= settings.freeShippingOver
        ? 0
        : settings?.deliveryFee || 100;
    const total = afterDiscount + deliveryFee;

    const orderNumber = generateOrderNumber();
    await createOrder({
      orderNumber,
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
        email: body.customer.email || "",
        city: body.customer.city || "",
        address: body.customer.address || "",
        note: body.customer.note || "",
      },
      items,
      subtotal,
      discount,
      deliveryFee,
      total: Math.round(total),
      couponCode,
      paymentMethod,
      paymentStatus: "pending",
    });

    if (couponCode && paymentMethod === "cod") {
      await incrementCouponUse(couponCode);
    }

    return NextResponse.json({ orderNumber, total: Math.round(total), paymentMethod });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place the order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}