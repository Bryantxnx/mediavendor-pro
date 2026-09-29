-- ============================================================
-- Migration 002: Orders dual-payment system (Midtrans + WhatsApp)
-- ============================================================

-- ── 1. Add new columns to orders ──

ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'whatsapp';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS midtrans_payment_type TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rental_start_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rental_end_date DATE;

-- ── 2. Add CHECK constraints on new columns ──

ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('midtrans', 'whatsapp'));

ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('unpaid', 'paid', 'expired', 'refunded'));

-- ── 3. Update status CHECK to include new statuses ──

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'waiting_payment'));

-- ── 4. Add whatsapp column to customers ──

ALTER TABLE customers ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- ── 5. Create indexes on new columns ──

CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ── 6. RLS policies for public access (landing page checkout) ──

CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert order_items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read own order" ON orders
  FOR SELECT USING (true);
