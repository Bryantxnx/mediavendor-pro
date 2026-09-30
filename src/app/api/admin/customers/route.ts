import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const PAGE_SIZE = 20;

/* ── GET /api/admin/customers ── */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    /* ── Fetch customers ── */
    let customerQuery = supabase
      .from("customers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      customerQuery = customerQuery.or(
        `name.ilike.%${search}%,whatsapp.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    const { data: customers, error: custErr, count } = await customerQuery;

    if (custErr) {
      console.error("GET /api/admin/customers error:", custErr);
      return NextResponse.json({ error: custErr.message }, { status: 500 });
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({
        customers: [],
        total: count ?? 0,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
      });
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
      return NextResponse.json({
        customers: customers.map((c) => ({
          ...c,
          order_count: 0,
          total_spending: 0,
        })),
        total: count ?? 0,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
      });
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

    return NextResponse.json({
      customers: result,
      total: count ?? 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    });
  } catch (err) {
    console.error("GET /api/admin/customers error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
