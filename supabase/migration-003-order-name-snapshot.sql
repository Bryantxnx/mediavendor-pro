-- ============================================================
-- Migration 003: Save customer name/email snapshot per order
-- Fixes bug where re-ordering with same WA number overwrites
-- all previous orders' customer name in admin panel.
-- ============================================================

-- ── 1. Add snapshot columns to orders ──
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT;

-- ── 2. Backfill existing orders from customers table ──
UPDATE orders
SET customer_name = c.name,
    customer_email = c.email
FROM customers c
WHERE orders.customer_id = c.id
  AND orders.customer_name IS NULL;
