export const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const khaltiPublicKey = process.env.NEXT_PUBLIC_KHALTI_PUBLIC_KEY || "";

export const khaltiPaymentEndpoint = (
  process.env.NEXT_PUBLIC_KHALTI_PAYMENT_ENDPOINT || "https://khalti.com/api/v2/epayment/initiate/"
).replace(/\/$/, "");

export const eSewaMerchantId = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID || "";

export const eSewaGatewayUrl =
  process.env.NEXT_PUBLIC_ESEWA_GATEWAY_URL || "https://esewa.com.np/epay/main";

export const ORDER_STATUSES = ["new", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export function isConfiguredGateway(gateway: "khalti" | "esewa") {
  if (gateway === "khalti") return Boolean(khaltiPublicKey);
  return Boolean(eSewaMerchantId);
}