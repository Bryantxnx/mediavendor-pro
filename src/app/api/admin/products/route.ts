import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const VALID_CATEGORIES = [
  "Kamera",
  "Lensa",
  "Lighting",
  "Audio",
  "Support",
  "Kru",
  "Paket",
] as const;

/* ── GET /api/admin/products ── */
export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/* ── POST /api/admin/products ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, category, price_per_day, price_per_week, specs, popular, stock } = body;

    // --- Validate required fields ---
    const missing: string[] = [];
    if (!name) missing.push("name");
    if (!category) missing.push("category");
    if (price_per_day == null) missing.push("price_per_day");
    if (price_per_week == null) missing.push("price_per_week");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    // --- Validate category ---
    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        category,
        price_per_day,
        price_per_week,
        specs: specs ?? [],
        popular: popular ?? false,
        stock: stock ?? 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
