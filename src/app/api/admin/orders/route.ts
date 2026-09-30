import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const PAGE_SIZE = 20;

/* ── GET /api/admin/orders ── */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

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
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // ── Filter by status ──
    if (status) {
      query = query.eq("status", status);
    }

    // ── Search by order_number or customer name ──
    // PostgREST doesn't support foreign-table filters inside .or(),
    // so we search customers separately first.
    if (search) {
      const { data: matchingCustomers } = await supabase
        .from("customers")
        .select("id")
        .ilike("name", `%${search}%`);

      const customerIds = matchingCustomers?.map((c) => c.id) ?? [];

      if (customerIds.length > 0) {
        query = query.or(
          `order_number.ilike.%${search}%,customer_id.in.(${customerIds.join(",")})`
        );
      } else {
        query = query.ilike("order_number", `%${search}%`);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("GET /api/admin/orders error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      orders: data,
      total: count ?? 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    });
  } catch (err) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
