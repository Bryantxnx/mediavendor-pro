import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/* ── GET /api/admin/dashboard ──
 *  Single lightweight endpoint for dashboard stats.
 *  Returns aggregated counts + revenue server-side so we don't
 *  need to fetch all rows client-side.
 */
export async function GET() {
  try {
    const supabase = createServerClient();

    // Run all queries in parallel for speed
    const [productsRes, ordersRes, customersRes, recentRes, lowStockRes] =
      await Promise.all([
        // 1. Count active products
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),

        // 2. Count all orders + sum revenue (exclude cancelled)
        supabase
          .from("orders")
          .select("id, status, total_amount"),

        // 3. Count customers
        supabase
          .from("customers")
          .select("id", { count: "exact", head: true }),

        // 4. Recent 5 orders
        supabase
          .from("orders")
          .select(`
            id,
            order_number,
            status,
            total_amount,
            created_at,
            customer_name,
            customers ( id, name )
          `)
          .order("created_at", { ascending: false })
          .limit(5),

        // 5. Low stock products (stock <= 2, active)
        supabase
          .from("products")
          .select("id, name, category, stock, is_active")
          .eq("is_active", true)
          .lte("stock", 2)
          .order("stock", { ascending: true })
          .limit(10),
      ]);

    // ── Aggregate stats from all orders ──
    const allOrders = ordersRes.data ?? [];
    const totalOrders = allOrders.length;

    // Revenue = only orders that are actually paid (completed / delivered)
    const PAID_STATUSES = ["completed", "delivered"];
    const totalRevenue = allOrders.reduce(
      (sum, o) =>
        PAID_STATUSES.includes(o.status)
          ? sum + (Number(o.total_amount) || 0)
          : sum,
      0,
    );

    // Pipeline = pending + confirmed + processing (belum lunas tapi aktif)
    const PIPELINE_STATUSES = ["pending", "confirmed", "processing"];
    const pipelineRevenue = allOrders.reduce(
      (sum, o) =>
        PIPELINE_STATUSES.includes(o.status)
          ? sum + (Number(o.total_amount) || 0)
          : sum,
      0,
    );

    return NextResponse.json({
      totalProducts: productsRes.count ?? 0,
      totalOrders,
      totalCustomers: customersRes.count ?? 0,
      totalRevenue,
      pipelineRevenue,
      recentOrders: recentRes.data ?? [],
      lowStockProducts: lowStockRes.data ?? [],
    });
  } catch (err) {
    console.error("GET /api/admin/dashboard error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
