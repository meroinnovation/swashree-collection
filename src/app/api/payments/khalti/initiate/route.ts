import { NextResponse } from "next/server";
import { khaltiInitiate } from "@/lib/payments/service";

export const dynamic = "force-dynamic";

type Body = {
  orderNumber: string;
  amountPaise: number;
  customerInfo?: { name?: string; email?: string; phone?: string };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.orderNumber || !body.amountPaise || body.amountPaise <= 0) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const result = await khaltiInitiate({
      amountPaise: body.amountPaise,
      purchaseOrderId: body.orderNumber,
      purchaseOrderName: `Swashree Collection Order ${body.orderNumber}`,
      customerInfo: body.customerInfo,
    });

    return NextResponse.json({ paymentUrl: result.payment_url, pidx: result.pidx });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not initiate Khalti.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}