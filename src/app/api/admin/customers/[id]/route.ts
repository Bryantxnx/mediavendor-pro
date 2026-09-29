import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

type RouteContext = { params: Promise<{ id: string }> };

/* ── GET /api/admin/customers/[id] ── */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;
    const supabase = createServerClient();

    /* ── Fetch customer ── */
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (custErr || !customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    /* ── Fetch customer's orders with items ── */
    const { data: orders, error: ordErr } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (ordErr) {
      console.error("GET /api/admin/customers/[id] orders error:", ordErr);
    }

    return NextResponse.json({
      ...customer,
      orders: orders ?? [],
    });
  } catch (err) {
    console.error("GET /api/admin/customers/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
