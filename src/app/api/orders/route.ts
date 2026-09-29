import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { createSnapTransaction, type MidtransItem } from "@/lib/midtrans";

/* ── Helper: generate order number ORD-YYYYMMDD-XXX ── */
function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `ORD-${y}${m}${d}-${rand}`;
}

/* ── POST /api/orders — Public order creation ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, rental_days, rental_start, rental_end, total_amount, discount_pct, payment_method } = body;

    // ── Validate required fields ──
    const missing: string[] = [];
    if (!customer?.name) missing.push("customer.name");
    if (!customer?.whatsapp) missing.push("customer.whatsapp");
    if (!items || !Array.isArray(items) || items.length === 0) missing.push("items");
    if (rental_days == null) missing.push("rental_days");
    if (total_amount == null) missing.push("total_amount");
    if (!payment_method) missing.push("payment_method");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    if (!["midtrans", "whatsapp"].includes(payment_method)) {
      return NextResponse.json(
        { error: 'payment_method must be "midtrans" or "whatsapp"' },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const orderNumber = generateOrderNumber();

    // ── 1. Find or create customer by whatsapp number ──
    let customerId: string;

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("whatsapp", customer.whatsapp)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Don't overwrite name — different people may share the same WA number.
      // Only update email if customer record has none yet.
      if (customer.email) {
        const { data: full } = await supabase
          .from("customers")
          .select("email")
          .eq("id", existingCustomer.id)
          .single();
        if (full && !full.email) {
          await supabase
            .from("customers")
            .update({ email: customer.email })
            .eq("id", existingCustomer.id);
        }
      }
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          whatsapp: customer.whatsapp,
          phone: customer.whatsapp,
          email: customer.email || null,
        })
        .select("id")
        .single();

      if (custErr || !newCustomer) {
        console.error("Failed to create customer:", custErr);
        return NextResponse.json(
          { error: "Gagal membuat data customer" },
          { status: 500 },
        );
      }
      customerId = newCustomer.id;
    }

    // ── 2. Insert order ──
    const orderStatus = payment_method === "midtrans" ? "waiting_payment" : "pending";

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        customer_name: customer.name,
        customer_email: customer.email || null,
        status: orderStatus,
        payment_method,
        payment_status: "unpaid",
        rental_days,
        rental_start_date: rental_start || null,
        rental_end_date: rental_end || null,
        total_amount,
        discount_pct: discount_pct ?? 0,
        notes: body.notes || null,
      })
      .select("id, order_number")
      .single();

    if (orderErr || !order) {
      console.error("Failed to create order:", orderErr);
      return NextResponse.json(
        { error: "Gagal membuat pesanan" },
        { status: 500 },
      );
    }

    // ── 3. Insert order_items ──
    const orderItems = items.map((item: {
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
    }));

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsErr) {
      console.error("Failed to insert order items:", itemsErr);
      // Rollback: delete the order
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Gagal menyimpan item pesanan" },
        { status: 500 },
      );
    }

    // ── 4. If midtrans → create Snap transaction ──
    if (payment_method === "midtrans") {
      try {
        const midtransItems: MidtransItem[] = items.map(
          (item: { product_id: string; product_name: string; quantity: number; unit_price: number }) => ({
            id: item.product_id,
            name: item.product_name,
            price: item.unit_price,
            quantity: item.quantity,
          }),
        );

        // If there's a discount, add it as a negative line item so gross_amount matches
        if (discount_pct && discount_pct > 0) {
          const subtotalBeforeDiscount = items.reduce(
            (sum: number, i: { subtotal: number }) => sum + i.subtotal,
            0,
          );
          const discountAmount = subtotalBeforeDiscount - total_amount;
          if (discountAmount > 0) {
            midtransItems.push({
              id: "DISCOUNT",
              name: `Diskon ${discount_pct}%`,
              price: -discountAmount,
              quantity: 1,
            });
          }
        }

        const snap = await createSnapTransaction({
          orderId: orderNumber,
          grossAmount: total_amount,
          customerName: customer.name,
          customerPhone: customer.whatsapp,
          customerEmail: customer.email,
          items: midtransItems,
        });

        // Save midtrans_order_id
        await supabase
          .from("orders")
          .update({ midtrans_order_id: orderNumber })
          .eq("id", order.id);

        return NextResponse.json(
          {
            order_number: order.order_number,
            snap_token: snap.token,
            redirect_url: snap.redirect_url,
          },
          { status: 201 },
        );
      } catch (midtransErr) {
        console.error("Midtrans transaction failed:", midtransErr);
        // Mark order as failed but don't delete — admin can retry
        await supabase
          .from("orders")
          .update({ status: "cancelled", notes: "Midtrans transaction creation failed" })
          .eq("id", order.id);
        return NextResponse.json(
          { error: "Gagal membuat transaksi pembayaran" },
          { status: 502 },
        );
      }
    }

    // ── 5. WhatsApp payment — return order number only ──
    return NextResponse.json(
      { order_number: order.order_number },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
