import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-webhook-secret") || process.env.SANITY_REVALIDATE_SECRET;
  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Revalidation not configured." }, { status: 501 });
  }
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret." }, { status: 401 });
  }
  revalidateTag("content", "minutes");
  return NextResponse.json({ ok: true, revalidated: true });
}