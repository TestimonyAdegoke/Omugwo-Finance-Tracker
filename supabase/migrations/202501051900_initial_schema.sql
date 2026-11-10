-- Omugwo Academy Finance Tracker - Supabase Initial Migration
-- Run via Supabase CLI migrations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== ENUMS ====================

CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE partner_type AS ENUM ('CUSTOMER', 'VENDOR', 'SPONSOR', 'OTHER');
CREATE TYPE recurring_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE user_role AS ENUM ('ADMIN', 'FINANCE', 'VIEWER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- ==================== CATEGORIES TABLE ====================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type transaction_type NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default income categories
INSERT INTO categories (name, type, color) VALUES
  ('Course Purchases', 'INCOME', '#10b981'),
  ('Donations', 'INCOME', '#3b82f6'),
  ('Sponsorships', 'INCOME', '#8b5cf6'),
  ('Events/Workshops', 'INCOME', '#f59e0b'),
  ('Merchandise', 'INCOME', '#ec4899'),
  ('Other Income', 'INCOME', '#64748b')
ON CONFLICT DO NOTHING;

-- Insert default expense categories
INSERT INTO categories (name, type, color) VALUES
  ('Staff Salaries', 'EXPENSE', '#ef4444'),
  ('Content Production', 'EXPENSE', '#f97316'),
  ('Marketing', 'EXPENSE', '#eab308'),
  ('Technology', 'EXPENSE', '#06b6d4'),
  ('Office Ops', 'EXPENSE', '#6366f1'),
  ('Utilities', 'EXPENSE', '#d946ef')
ON CONFLICT DO NOTHING;

-- ==================== PARTNERS TABLE ====================

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type partner_type NOT NULL DEFAULT 'OTHER',
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample partners
INSERT INTO partners (name, type, email, website, address) VALUES
  ('Amazon Web Services', 'VENDOR', 'billing@aws.com', 'https://aws.amazon.com', 'Seattle, WA'),
  ('Jane Doe (Student)', 'CUSTOMER', 'jane@example.com', NULL, NULL),
  ('Nigerian Tech Hub', 'SPONSOR', NULL, 'https://techhub.ng', NULL)
ON CONFLICT DO NOTHING;

-- ==================== TRANSACTIONS TABLE ====================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  type transaction_type NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  source VARCHAR(255),
  description TEXT NOT NULL,
  partner_id UUID REFERENCES partners(id),
  recurring_id UUID,
  tags TEXT[],
  attachment VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_partner ON transactions(partner_id);

-- ==================== BUDGETS TABLE ====================

CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id),
  monthly_limit DECIMAL(12, 2) NOT NULL CHECK (monthly_limit >= 0),
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, month)
);

CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);

-- ==================== RECURRING SCHEDULES TABLE ====================

CREATE TABLE IF NOT EXISTS recurring_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  frequency recurring_frequency NOT NULL,
  start_date DATE NOT NULL,
  next_occurrence DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== USERS TABLE ====================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'VIEWER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  joined_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default users (safe-guarded to avoid duplicates)
INSERT INTO users (name, email, role, status, joined_at) VALUES
  ('Main Admin', 'admin@omugwo.academy', 'ADMIN', 'ACTIVE', '2023-01-01'),
  ('Finance Manager', 'finance@omugwo.academy', 'FINANCE', 'ACTIVE', '2023-06-15')
ON CONFLICT (email) DO NOTHING;

-- ==================== INVITES TABLE ====================

CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'VIEWER',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- For this internal app, allow all authenticated users full access to all data.
-- If you introduce multi-tenant separation later, replace these with role/tenant-aware policies.

DROP POLICY IF EXISTS "categories_select_authenticated" ON categories;
CREATE POLICY "categories_select_authenticated" ON categories
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "categories_insert_authenticated" ON categories;
CREATE POLICY "categories_insert_authenticated" ON categories
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "categories_update_authenticated" ON categories;
CREATE POLICY "categories_update_authenticated" ON categories
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "categories_delete_authenticated" ON categories;
CREATE POLICY "categories_delete_authenticated" ON categories
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "transactions_select_authenticated" ON transactions;
CREATE POLICY "transactions_select_authenticated" ON transactions
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "transactions_insert_authenticated" ON transactions;
CREATE POLICY "transactions_insert_authenticated" ON transactions
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "transactions_update_authenticated" ON transactions;
CREATE POLICY "transactions_update_authenticated" ON transactions
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "transactions_delete_authenticated" ON transactions;
CREATE POLICY "transactions_delete_authenticated" ON transactions
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "partners_select_authenticated" ON partners;
CREATE POLICY "partners_select_authenticated" ON partners
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "partners_insert_authenticated" ON partners;
CREATE POLICY "partners_insert_authenticated" ON partners
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "partners_update_authenticated" ON partners;
CREATE POLICY "partners_update_authenticated" ON partners
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "partners_delete_authenticated" ON partners;
CREATE POLICY "partners_delete_authenticated" ON partners
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "budgets_select_authenticated" ON budgets;
CREATE POLICY "budgets_select_authenticated" ON budgets
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "budgets_insert_authenticated" ON budgets;
CREATE POLICY "budgets_insert_authenticated" ON budgets
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "budgets_update_authenticated" ON budgets;
CREATE POLICY "budgets_update_authenticated" ON budgets
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "budgets_delete_authenticated" ON budgets;
CREATE POLICY "budgets_delete_authenticated" ON budgets
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "recurring_schedules_select_authenticated" ON recurring_schedules;
CREATE POLICY "recurring_schedules_select_authenticated" ON recurring_schedules
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "recurring_schedules_insert_authenticated" ON recurring_schedules;
CREATE POLICY "recurring_schedules_insert_authenticated" ON recurring_schedules
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "recurring_schedules_update_authenticated" ON recurring_schedules;
CREATE POLICY "recurring_schedules_update_authenticated" ON recurring_schedules
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "recurring_schedules_delete_authenticated" ON recurring_schedules;
CREATE POLICY "recurring_schedules_delete_authenticated" ON recurring_schedules
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "users_select_authenticated" ON users;
CREATE POLICY "users_select_authenticated" ON users
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "users_insert_authenticated" ON users;
CREATE POLICY "users_insert_authenticated" ON users
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "users_update_authenticated" ON users;
CREATE POLICY "users_update_authenticated" ON users
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "users_delete_authenticated" ON users;
CREATE POLICY "users_delete_authenticated" ON users
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "invites_select_authenticated" ON invites;
CREATE POLICY "invites_select_authenticated" ON invites
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "invites_insert_authenticated" ON invites;
CREATE POLICY "invites_insert_authenticated" ON invites
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "invites_update_authenticated" ON invites;
CREATE POLICY "invites_update_authenticated" ON invites
  FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "invites_delete_authenticated" ON invites;
CREATE POLICY "invites_delete_authenticated" ON invites
  FOR DELETE TO authenticated USING (true);

-- ==================== FUNCTIONS & TRIGGERS ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_schedules_updated_at BEFORE UPDATE ON recurring_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== VIEWS ====================

-- Financial summary view
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
  DATE_TRUNC('month', date) as month,
  SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as total_expense,
  SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) as net_profit
FROM transactions
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;

-- Category spending view
CREATE OR REPLACE VIEW category_spending AS
SELECT 
  c.id as category_id,
  c.name as category_name,
  c.type as category_type,
  c.color,
  DATE_TRUNC('month', t.date) as month,
  SUM(t.amount) as total_amount,
  COUNT(t.id) as transaction_count
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
WHERE c.is_active = true
GROUP BY c.id, c.name, c.type, c.color, DATE_TRUNC('month', t.date)
ORDER BY month DESC, total_amount DESC;
