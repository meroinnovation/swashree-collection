import "server-only";
import { getSiteUrl } from "./config";

export type KhaltiInitiateResult = {
  pidx: string;
  payment_url: string;
  expires_at?: string;
};

export type KhaltiLookupResult = {
  status: string;
  transaction_id?: string;
  total_amount?: number;
  ref_id?: string;
};

const khaltiSecretKey = process.env.KHALTI_SECRET_KEY || "";
const khaltiApi = (process.env.NEXT_PUBLIC_KHALTI_PAYMENT_ENDPOINT ||
  "https://khalti.com/api/v2/epayment/initiate/") as string;
const khaltiLookupUrl = (process.env.KHALTI_LOOKUP_ENDPOINT ||
  "https://khalti.com/api/v2/epayment/lookup/") as string;

export async function khaltiInitiate(params: {
  amountPaise: number;
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerInfo?: { name?: string; email?: string; phone?: string };
}): Promise<KhaltiInitiateResult> {
  if (!khaltiSecretKey) throw new Error("KHALTI_SECRET_KEY is not configured");

  const res = await fetch(khaltiApi, {
    method: "POST",
    headers: {
      Authorization: `Key ${khaltiSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: `${getSiteUrl()}/checkout/success`,
      website_url: getSiteUrl(),
      amount: params.amountPaise,
      purchase_order_id: params.purchaseOrderId,
      purchase_order_name: params.purchaseOrderName,
      customer_info: params.customerInfo,
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.pidx) {
    throw new Error(data["detail"] || data?.error || "Failed to initiate Khalti payment");
  }
  return data as KhaltiInitiateResult;
}

export async function khaltiLookup(pidx: string): Promise<KhaltiLookupResult> {
  if (!khaltiSecretKey) throw new Error("KHALTI_SECRET_KEY is not configured");
  const res = await fetch(khaltiLookupUrl, {
    method: "POST",
    headers: {
      Authorization: `Key ${khaltiSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("Failed to verify Khalti payment");
  return data as KhaltiLookupResult;
}

const eSewaVerifyUrl =
  process.env.ESEWA_VERIFY_URL || "https://esewa.com.np/epay/transrec";

export async function esewaVerify(params: {
  scd: string;
  amt: string;
  rid: string;
  pid: string;
}): Promise<{ ok: boolean; message?: string }> {
  const body = new URLSearchParams({
    amt: params.amt,
    rid: params.rid,
    pid: params.pid,
    scd: params.scd,
  });

  const res = await fetch(eSewaVerifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  const text = await res.text();
  const code = text.match(/<response_code>\s*(\d+)\s*<\/response_code>/)?.[1];
  const message = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return { ok: res.ok && code === "1", message: message || text };
}