-- ══════════════════════════════════════════
--  MediaVendor Pro — Database Schema
--  Jalanin SQL ini di Supabase SQL Editor
-- ══════════════════════════════════════════

-- ── 1. Products (Inventory Alat) ──
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Kamera', 'Lensa', 'Lighting', 'Audio', 'Support', 'Kru', 'Paket')),
  price_per_day INTEGER NOT NULL DEFAULT 0,
  price_per_week INTEGER NOT NULL DEFAULT 0,
  specs TEXT[] NOT NULL DEFAULT '{}',
  popular BOOLEAN NOT NULL DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. Customers ──
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. Orders ──
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  rental_days INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL DEFAULT 0,
  discount_pct INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. Order Items (relasi order <-> product) ──
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  subtotal INTEGER NOT NULL DEFAULT 0
);

-- ── 5. Indexes ──
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ── 6. Auto-update updated_at ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 7. RLS Policies ──
-- Products: public bisa baca (buat landing page), admin via service_role bisa CRUD
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);

-- Customers, orders, order_items: hanya via service_role (admin)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════
--  8. Seed Data — migrate dari pricelist.ts
-- ══════════════════════════════════════════
INSERT INTO products (name, category, price_per_day, price_per_week, specs, popular) VALUES
-- Kamera
('Sony A7S III', 'Kamera', 500000, 2800000, ARRAY['4K 120fps', 'Full Frame', 'Dual Card Slots'], false),
('Canon EOS R5', 'Kamera', 600000, 3400000, ARRAY['8K RAW', '45MP', 'IBIS'], true),
('RED Komodo 6K', 'Kamera', 1500000, 8500000, ARRAY['6K Super 35', 'R3D RAW', 'Global Shutter'], false),
('Blackmagic Pocket 6K Pro', 'Kamera', 450000, 2500000, ARRAY['6K Super 35', 'BRAW', 'Built-in ND'], false),
('Sony FX6', 'Kamera', 900000, 5000000, ARRAY['4K 120fps', 'Full Frame', 'Dual Base ISO'], true),
-- Lensa
('Sony 24-70mm f/2.8 GM II', 'Lensa', 200000, 1100000, ARRAY['E-Mount', 'f/2.8', 'Weather Sealed'], false),
('Canon RF 70-200mm f/2.8', 'Lensa', 250000, 1400000, ARRAY['RF Mount', 'f/2.8', 'IS'], true),
('Sigma 35mm f/1.4 Art', 'Lensa', 150000, 800000, ARRAY['Multi-Mount', 'f/1.4', 'Art Series'], false),
('Sony 85mm f/1.4 GM', 'Lensa', 200000, 1100000, ARRAY['E-Mount', 'f/1.4', 'Nano AR II'], false),
-- Lighting
('Aputure 600d Pro', 'Lighting', 350000, 2000000, ARRAY['600W Daylight', 'Bowens Mount', 'App Control'], true),
('Nanlite Forza 300B', 'Lighting', 250000, 1400000, ARRAY['300W Bi-Color', 'Bowens Mount', 'Bluetooth'], false),
('Godox SL200 II', 'Lighting', 150000, 800000, ARRAY['200W Daylight', 'Bowens Mount', 'Silent Fan'], false),
('Aputure MC Pro (4-set)', 'Lighting', 300000, 1700000, ARRAY['RGBWW', 'Magnetic', 'App Control'], false),
-- Audio
('Rode Wireless PRO', 'Audio', 200000, 1100000, ARRAY['Dual Channel', '32-bit Float', '2 Transmitters'], true),
('Sennheiser MKH 416', 'Audio', 150000, 800000, ARRAY['Shotgun Mic', 'Super-Cardioid', 'Industry Standard'], false),
('Zoom F6 Recorder', 'Audio', 200000, 1100000, ARRAY['6-Channel', '32-bit Float', 'Timecode'], false),
('DPA 4060 Lav (pair)', 'Audio', 250000, 1400000, ARRAY['Omnidirectional', 'Low Noise', 'Miniature'], false),
-- Support
('DJI RS 3 Pro', 'Support', 300000, 1700000, ARRAY['3-Axis Gimbal', '4.5kg Payload', 'LiDAR Focus'], true),
('Sachtler Ace XL Tripod', 'Support', 100000, 550000, ARRAY['Fluid Head', '75mm Bowl', '8kg Payload'], false),
('DJI Mavic 3 Pro Drone', 'Support', 500000, 2800000, ARRAY['Hasselblad Cam', '4/3 CMOS', '43min Flight'], false),
('Slider 120cm Motorized', 'Support', 200000, 1100000, ARRAY['Carbon Fiber', 'App Control', 'Time-Lapse'], false),
-- Kru
('Kameraman', 'Kru', 500000, 2800000, ARRAY['Operator Kamera', '5+ Tahun Pengalaman', 'Per Orang'], true),
('Sutradara / Director', 'Kru', 1500000, 8000000, ARRAY['Konsep Kreatif', 'Directing Talent', 'Shot List'], false),
('Gaffer (Lighting Director)', 'Kru', 500000, 2800000, ARRAY['Setup Lighting', 'Grip Equipment', 'Per Orang'], false),
('Sound Engineer', 'Kru', 500000, 2800000, ARRAY['Boom Operator', 'Mixing On-Set', 'Per Orang'], false),
('Asisten Produksi', 'Kru', 350000, 1800000, ARRAY['Runner', 'Setup & Breakdown', 'Per Orang'], false),
('Editor Video', 'Kru', 1000000, 5500000, ARRAY['Premiere / DaVinci', 'Revisi 2x', 'Delivery H.264 + ProRes'], true),
('Colorist', 'Kru', 750000, 4000000, ARRAY['DaVinci Resolve', 'LUT Custom', 'Per Project'], false),
('Motion Grapher / VFX', 'Kru', 1200000, 6500000, ARRAY['After Effects', '3D Element', 'Green Screen'], false),
-- Paket
('Paket Interview (Tanpa Crew)', 'Paket', 1200000, 6500000, ARRAY['1 Sony A7S III', '2 LED Panel', '1 Wireless Mic'], false),
('Paket Interview + 1 Crew', 'Paket', 1700000, 9000000, ARRAY['1 Sony A7S III', '2 LED Panel', '1 Wireless Mic', '1 Kameraman'], true),
('Paket Video Pro (Tanpa Crew)', 'Paket', 3500000, 18000000, ARRAY['2 Kamera + Lensa', '3-Point Lighting', 'Full Audio Kit'], false),
('Paket Video Pro + 2 Crew', 'Paket', 4500000, 24000000, ARRAY['2 Kamera + Lensa', '3-Point Lighting', 'Full Audio Kit', '2 Kameraman'], true),
('Paket Liputan Event (Tanpa Crew)', 'Paket', 2500000, 13000000, ARRAY['2 Kamera', 'On-Camera Light', 'Wireless Audio'], false),
('Paket Liputan Event + 2 Crew', 'Paket', 3500000, 18000000, ARRAY['2 Kamera', 'On-Camera Light', 'Wireless Audio', '2 Kameraman'], false),
('Paket Cinema Full Crew', 'Paket', 12000000, 65000000, ARRAY['RED/ARRI Camera', 'Cinema Lenses', 'Full Grip & Electric', 'Sutradara + 3 Crew'], true);
