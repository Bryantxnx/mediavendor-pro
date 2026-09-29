import { createBrowserClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

/* ── Public API: Fetch active products for landing page ──
 *  Pake anon key (browser client) — RLS policy hanya return is_active = true.
 *  Endpoint ini GAK perlu auth — dipanggil dari landing page publik.
 *  Map snake_case (Supabase) → camelCase (PriceItem interface).
 */
export async function GET() {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category, price_per_day, price_per_week, specs, popular")
      .eq("is_active", true)
      .order("category")
      .order("name");

    if (error) {
      console.error("Failed to fetch products:", error);
      return NextResponse.json(
        { error: "Gagal memuat data produk" },
        { status: 500 }
      );
    }

    // Map snake_case → camelCase to match PriceItem interface
    const products = (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      pricePerDay: p.price_per_day,
      pricePerWeek: p.price_per_week,
      specs: p.specs,
      popular: p.popular,
    }));

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
