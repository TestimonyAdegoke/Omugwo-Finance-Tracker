-- Omugwo Academy Finance Tracker - Multi-currency & Settings Migration

-- ==================== APP SETTINGS ====================

CREATE TABLE IF NOT EXISTS app_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  default_currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_settings (id, default_currency)
VALUES (1, 'NGN')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read settings
DROP POLICY IF EXISTS "app_settings_select_authenticated" ON app_settings;
CREATE POLICY "app_settings_select_authenticated" ON app_settings
  FOR SELECT TO authenticated
  USING (true);

-- Only ADMIN users (as defined in users table) can update settings
DROP POLICY IF EXISTS "app_settings_update_admin_only" ON app_settings;
CREATE POLICY "app_settings_update_admin_only" ON app_settings
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid() AND u.role = 'ADMIN'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid() AND u.role = 'ADMIN'
  ));

-- ==================== TRANSACTIONS MULTI-CURRENCY ====================

-- Add multi-currency metadata columns; amount column continues to represent
-- value in default currency for reporting.

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN',
  ADD COLUMN IF NOT EXISTS original_amount DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS exchange_rate NUMERIC(18, 6);

-- Make description optional to match UX requirement
ALTER TABLE transactions
  ALTER COLUMN description DROP NOT NULL;
