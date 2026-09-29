import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import crypto from "crypto";

/* ── POST /api/midtrans/webhook — Midtrans payment notification ──
 *  Called by Midtrans servers — NO auth cookie check.
 *  Docs: https://docs.midtrans.com/docs/https-notification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type,
    } = body;

    // ── 1. Verify signature ──
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.error("Midtrans webhook: invalid signature for order", order_id);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 },
      );
    }

    const supabase = createServerClient();

    // ── 2. Handle transaction status ──
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      // For "capture", only accept if fraud_status is "accept"
      if (transaction_status === "capture" && fraud_status !== "accept") {
        console.warn(
          `Midtrans webhook: capture with fraud_status="${fraud_status}" for ${order_id}`,
        );
        return NextResponse.json({ status: "ok" });
      }

      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          paid_at: new Date().toISOString(),
          midtrans_transaction_id: transaction_id,
          midtrans_payment_type: payment_type,
          updated_at: new Date().toISOString(),
        })
        .eq("midtrans_order_id", order_id);

      if (error) {
        console.error("Midtrans webhook: failed to update order as paid:", error);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 },
        );
      }

      console.log(`Order ${order_id} marked as PAID (${payment_type})`);
    } else if (transaction_status === "pending") {
      // Already in waiting_payment state — nothing to do
      console.log(`Order ${order_id} payment pending`);
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "expired",
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("midtrans_order_id", order_id);

      if (error) {
        console.error("Midtrans webhook: failed to update cancelled order:", error);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 },
        );
      }

      console.log(`Order ${order_id} marked as ${transaction_status.toUpperCase()}`);
    } else if (transaction_status === "refund" || transaction_status === "partial_refund") {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "refunded",
          updated_at: new Date().toISOString(),
        })
        .eq("midtrans_order_id", order_id);

      if (error) {
        console.error("Midtrans webhook: failed to update refunded order:", error);
      }

      console.log(`Order ${order_id} marked as REFUNDED`);
    }

    // ── 3. Always return 200 so Midtrans stops retrying ──
    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("POST /api/midtrans/webhook error:", err);
    // Still return 200 to prevent Midtrans retry storms on bad payloads
    return NextResponse.json({ status: "ok" });
  }
}
