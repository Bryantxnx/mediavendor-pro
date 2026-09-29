import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/* ── GET /api/admin/customers ── */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    /* ── Fetch customers ── */
    let customerQuery = supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      customerQuery = customerQuery.or(
        `name.ilike.%${search}%,whatsapp.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    const { data: customers, error: custErr } = await customerQuery;

    if (custErr) {
      console.error("GET /api/admin/customers error:", custErr);
      return NextResponse.json({ error: custErr.message }, { status: 500 });
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json([]);
    }

    /* ── Fetch order aggregates per customer ── */
    const customerIds = customers.map((c) => c.id);

    const { data: orderAggs, error: aggErr } = await supabase
      .from("orders")
      .select("customer_id, total_amount")
      .in("customer_id", customerIds);

    if (aggErr) {
      console.error("GET /api/admin/customers agg error:", aggErr);
      // Return customers without aggregates rather than failing
      return NextResponse.json(
        customers.map((c) => ({
          ...c,
          order_count: 0,
          total_spending: 0,
        })),
      );
    }

    /* ── Aggregate in JS ── */
    const aggMap: Record<string, { order_count: number; total_spending: number }> = {};

    for (const row of orderAggs ?? []) {
      if (!aggMap[row.customer_id]) {
        aggMap[row.customer_id] = { order_count: 0, total_spending: 0 };
      }
      aggMap[row.customer_id].order_count += 1;
      aggMap[row.customer_id].total_spending += Number(row.total_amount) || 0;
    }

    const result = customers.map((c) => ({
      ...c,
      order_count: aggMap[c.id]?.order_count ?? 0,
      total_spending: aggMap[c.id]?.total_spending ?? 0,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/admin/customers error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
