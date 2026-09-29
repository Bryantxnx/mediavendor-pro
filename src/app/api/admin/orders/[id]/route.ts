import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateServerInvoicePDF } from "@/lib/generate-invoice-server";
import { sendPaymentConfirmationEmail } from "@/lib/resend";

type RouteContext = { params: Promise<{ id: string }> };

/* ── GET /api/admin/orders/[id] ── */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const supabase = createServerClient();

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select(`
        *,
        customers (
          id,
          name,
          phone,
          email,
          whatsapp,
          company
        ),
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq("id", id)
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error("GET /api/admin/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── PUT /api/admin/orders/[id] ── */
export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Only allow specific fields to be updated
    const allowedFields = [
      "status",
      "payment_status",
      "rental_start_date",
      "rental_end_date",
      "notes",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    updates.updated_at = new Date().toISOString();

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── Send email notification when payment marked as paid ──
    if (body.payment_status === "paid") {
      try {
        // Fetch full order with customer + items for email
        const { data: fullOrder } = await supabase
          .from("orders")
          .select(`
            *,
            customers ( id, name, phone, email, whatsapp ),
            order_items ( id, product_name, quantity, unit_price, subtotal )
          `)
          .eq("id", id)
          .single();

        const customerEmail = fullOrder?.customer_email ?? fullOrder?.customers?.email;
        if (customerEmail && fullOrder) {
          const customerName = fullOrder.customer_name ?? fullOrder.customers?.name ?? "Customer";
          // Generate PDF attachment
          const pdfBuffer = await generateServerInvoicePDF({
            items: fullOrder.order_items,
            days: fullOrder.rental_days,
            totalAmount: fullOrder.total_amount,
            discountPct: fullOrder.discount_pct ?? 0,
            customerName: customerName,
            customerPhone: fullOrder.customers?.whatsapp,
            customerEmail: customerEmail,
            orderNumber: fullOrder.order_number,
            isPaid: true,
            orderDate: fullOrder.created_at,
            rentalStartDate: fullOrder.rental_start_date,
            rentalEndDate: fullOrder.rental_end_date,
          });

          // Send email
          await sendPaymentConfirmationEmail({
            to: customerEmail,
            customerName: customerName,
            orderNumber: fullOrder.order_number,
            orderItems: fullOrder.order_items,
            totalAmount: fullOrder.total_amount,
            rentalDays: fullOrder.rental_days,
            discountPct: fullOrder.discount_pct ?? 0,
            rentalStartDate: fullOrder.rental_start_date,
            rentalEndDate: fullOrder.rental_end_date,
            pdfBuffer,
          });

          console.log(`Payment confirmation email sent to ${customerEmail} for order ${fullOrder.order_number}`);
        }
      } catch (emailErr) {
        // Email failure should NOT block the status update — log and continue
        console.error("Failed to send payment confirmation email:", emailErr);
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT /api/admin/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── DELETE /api/admin/orders/[id] (soft-cancel) ── */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, order_number, status")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Order "${data.order_number}" cancelled`,
    });
  } catch (err) {
    console.error("DELETE /api/admin/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
