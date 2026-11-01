-- TryOnX 2.0 Initial Schema Migration

-- 1. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  brand TEXT DEFAULT 'TryOnX',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  selling_price_paise BIGINT NOT NULL,
  compare_price_paise BIGINT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  supports_tryon BOOLEAN DEFAULT TRUE,
  tryon_garment_image_url TEXT,
  material TEXT,
  care_instructions TEXT,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  color TEXT,
  color_hex TEXT,
  size TEXT,
  stock_quantity INT DEFAULT 0,
  selling_price_paise BIGINT,
  compare_price_paise BIGINT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL,
  min_order_paise BIGINT,
  max_discount_paise BIGINT,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  tracking_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('online', 'cod')),
  payment_status TEXT NOT NULL DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal_paise BIGINT NOT NULL,
  discount_paise BIGINT DEFAULT 0,
  shipping_paise BIGINT DEFAULT 0,
  tax_paise BIGINT DEFAULT 0,
  total_paise BIGINT NOT NULL,
  coupon_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_sku TEXT NOT NULL,
  color TEXT,
  size TEXT,
  image_url TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_paise BIGINT NOT NULL,
  total_price_paise BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Try-On Jobs
CREATE TABLE IF NOT EXISTS public.tryon_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  person_image_url TEXT NOT NULL,
  garment_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  result_url TEXT,
  provider TEXT DEFAULT 'mock',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 9. Admin Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Store Settings
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tryon_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Permissive public policies for storefront reads
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public read store_settings" ON public.store_settings FOR SELECT USING (true);

-- Storefront checkout & orders policies
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select orders by token" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select order_items" ON public.order_items FOR SELECT USING (true);

-- Virtual Try-On job policies
CREATE POLICY "Public insert tryon_jobs" ON public.tryon_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select tryon_jobs" ON public.tryon_jobs FOR SELECT USING (true);
CREATE POLICY "Public update tryon_jobs" ON public.tryon_jobs FOR UPDATE USING (true);

-- Admin read/write policies
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage product_images" ON public.product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage product_variants" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin manage store_settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin users read" ON public.admin_users FOR SELECT USING (true);
