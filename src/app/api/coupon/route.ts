import { NextResponse } from "next/server";
import { projectId } from "@/sanity/env";
import { validateCoupon } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";
  const subtotal = Number(url.searchParams.get("subtotal")) || 0;
  if (!projectId) {
    return NextResponse.json({ valid: false, message: "Coupons are not enabled yet." });
  }
  const result = await validateCoupon(code, subtotal);
  return NextResponse.json(result);
}