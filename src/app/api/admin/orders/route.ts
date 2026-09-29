import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/* ── GET /api/admin/orders ── */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = supabase
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
        )
      `)
      .order("created_at", { ascending: false });

    // ── Filter by status ──
    if (status) {
      query = query.eq("status", status);
    }

    // ── Search by order_number or customer name ──
    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,customers.name.ilike.%${search}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET /api/admin/orders error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
