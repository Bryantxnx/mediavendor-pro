/* ── Midtrans Snap API helper ──
 *  Sandbox: https://app.sandbox.midtrans.com/snap/v1/transactions
 *  Production: https://app.midtrans.com/snap/v1/transactions
 */

const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
const SNAP_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export interface MidtransItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: MidtransItem[];
}

export async function createSnapTransaction(params: CreateTransactionParams) {
  const authString = Buffer.from(SERVER_KEY + ":").toString("base64");

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      phone: params.customerPhone,
      email: params.customerEmail || undefined,
    },
    item_details: params.items.map((item) => ({
      id: item.id,
      name: item.name.substring(0, 50), // Midtrans max 50 chars
      price: item.price,
      quantity: item.quantity,
    })),
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/order/success`,
    },
  };

  const response = await fetch(SNAP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Midtrans error: ${error}`);
  }

  return response.json() as Promise<{ token: string; redirect_url: string }>;
}
