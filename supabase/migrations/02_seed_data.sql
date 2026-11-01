-- Seed Data for TryOnX 2.0

-- 1. Admin Users
INSERT INTO public.admin_users (email, name, role, is_active)
VALUES ('admin@tryonx.in', 'TryOnX Super Admin', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- 2. Store Settings
INSERT INTO public.store_settings (key, value, label)
VALUES 
  ('store_name', 'TryOnX', 'Store Name'),
  ('tagline', 'Try It Virtually. Own Your Style.', 'Tagline'),
  ('free_shipping_threshold_paise', '99900', 'Free Shipping Threshold (paise)'),
  ('support_email', 'support@tryonx.in', 'Support Email'),
  ('support_phone', '+91 98765 43210', 'Support Phone')
ON CONFLICT (key) DO NOTHING;

-- 3. Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_paise, max_discount_paise, is_active)
VALUES 
  ('TRYONX10', '10% off on all orders', 'percentage', 10, 50000, 50000, true),
  ('FIRSTBUY', '₹200 off on your first purchase', 'fixed', 20000, 99900, 20000, true),
  ('FESTIVE25', '25% festive discount', 'percentage', 25, 149900, 100000, true)
ON CONFLICT (code) DO NOTHING;

-- 4. Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Women', 'women', 'Contemporary & everyday fashion for women', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Men', 'men', 'Modern tailored essentials and casual streetwear for men', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Streetwear', 'streetwear', 'Oversized silhouettes, acid wash drops & graphic statements', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Outerwear', 'outerwear', 'Jackets, trenches, bombers & layered outerwear', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Kids', 'kids', 'Comfortable, durable & playful everyday clothing', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80', 5, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Products (Curated Catalogue with AI Try-On garment cutouts)
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured, supports_tryon,
  tryon_garment_image_url, material, care_instructions, tags
) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Cyberpunk Neo Bomber Jacket',
    'cyberpunk-neo-bomber-jacket',
    'Heavyweight waterproof nylon flight bomber jacket with metallic matte hardware and contrast interior lining. Designed for transitional weather and streetwear statement styling.',
    'TryOnX Lab',
    'c1000000-0000-0000-0000-000000000004',
    499900, 699900, true, true, true,
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    '100% Recycled Technical Nylon',
    'Machine wash cold gentle. Do not tumble dry.',
    ARRAY['streetwear', 'jacket', 'bomber', 'outerwear', 'trending']
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Acid Wash Heavyweight Oversized Tee',
    'acid-wash-heavyweight-oversized-tee',
    'Crafted from 280 GSM combed organic cotton with a custom stone enzyme wash for a relaxed vintage aesthetic. Boxy drop-shoulder silhouette.',
    'TryOnX Studio',
    'c1000000-0000-0000-0000-000000000003',
    149900, 229900, true, true, true,
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    '100% Organic Combed Cotton, 280 GSM',
    'Machine wash inside out cold. Lay flat to dry.',
    ARRAY['tshirt', 'oversized', 'acid-wash', 'unisex', 'bestseller']
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Minimalist Linen Blend Blazer',
    'minimalist-linen-blend-blazer',
    'Structured yet breathable relaxed-fit blazer with natural horn buttons and patch pockets. Perfect for summer smart-casual dressing.',
    'TryOnX Studio',
    'c1000000-0000-0000-0000-000000000001',
    349900, 499900, true, true, true,
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    '70% European Flax Linen, 30% Cotton',
    'Dry clean recommended.',
    ARRAY['blazer', 'linen', 'formal', 'women']
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'Tailored Pleated Wide-Leg Trousers',
    'tailored-pleated-wide-leg-trousers',
    'High-rise front double pleats with fluid drape and hidden waistband tab adjusters. Elevated comfort for modern workspaces and evening events.',
    'TryOnX Studio',
    'c1000000-0000-0000-0000-000000000001',
    279900, 399900, true, false, true,
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    'Poly-Viscose Twill with Elastane stretch',
    'Machine wash cold on delicate cycle.',
    ARRAY['trousers', 'tailored', 'workwear', 'pleated']
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'Ribbed Knit Cropped Cardigan',
    'ribbed-knit-cropped-cardigan',
    'Ultra-soft brushed modal blend with tortoiseshell front buttons and ribbed cuff details. Styled layered or worn standalone.',
    'TryOnX Studio',
    'c1000000-0000-0000-0000-000000000001',
    189900, 259900, true, true, true,
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    '60% Cotton, 40% Modal',
    'Hand wash cold. Dry flat.',
    ARRAY['knitwear', 'cardigan', 'women', 'cozy']
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'Urban Tech Utility Cargo Pants',
    'urban-tech-utility-cargo-pants',
    'Ripstop cotton cargo pants with waterproof zip pockets, articulated knee seams, and adjustable bungee toggles at the ankles.',
    'TryOnX Lab',
    'c1000000-0000-0000-0000-000000000002',
    299900, 429900, true, true, true,
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    '100% Heavy Ripstop Cotton',
    'Machine wash warm with similar darks.',
    ARRAY['cargo', 'techwear', 'streetwear', 'men']
  ),
  (
    'a1000000-0000-0000-0000-000000000007',
    'Embroidered Cuban Collar Resort Shirt',
    'embroidered-cuban-collar-resort-shirt',
    'Breathable open-weave cotton with subtle tone-on-tone chain-stitch embroidery and relaxed camp collar.',
    'TryOnX Studio',
    'c1000000-0000-0000-0000-000000000002',
    199900, 279900, true, false, true,
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    '100% Breathable Cotton Slub',
    'Machine wash cold gentle.',
    ARRAY['resort', 'shirt', 'summer', 'men']
  ),
  (
    'a1000000-0000-0000-0000-000000000008',
    'Graphic Pop-Art Hoodie',
    'graphic-pop-art-hoodie',
    '400 GSM heavyweight French terry fleece hoodie with high-density puff print graphics and double-lined hood.',
    'TryOnX Lab',
    'c1000000-0000-0000-0000-000000000003',
    269900, 379900, true, true, true,
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    '100% Combed Cotton French Terry (400 GSM)',
    'Machine wash cold inside out. Tumble dry low.',
    ARRAY['hoodie', 'streetwear', 'oversized', 'fleece']
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Product Images
INSERT INTO public.product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', 'Neo Bomber Front', 0, true),
  ('a1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'Neo Bomber Back', 1, false),

  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'Acid Wash Tee Front', 0, true),
  ('a1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', 'Acid Wash Tee Detail', 1, false),

  ('a1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', 'Linen Blazer Studio', 0, true),
  ('a1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', 'Wide Leg Trousers', 0, true),
  ('a1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80', 'Ribbed Knit Cardigan', 0, true),
  ('a1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', 'Cargo Tech Pants', 0, true),
  ('a1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 'Resort Camp Shirt', 0, true),
  ('a1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 'Graphic Pop Hoodie', 0, true)
ON CONFLICT DO NOTHING;

-- 7. Product Variants (SKUs, Colors, Sizes, Stocks)
INSERT INTO public.product_variants (product_id, sku, color, color_hex, size, stock_quantity, is_active)
VALUES
  -- Bomber
  ('a1000000-0000-0000-0000-000000000001', 'BMBR-BLK-M', 'Onyx Black', '#171717', 'M', 15, true),
  ('a1000000-0000-0000-0000-000000000001', 'BMBR-BLK-L', 'Onyx Black', '#171717', 'L', 12, true),
  ('a1000000-0000-0000-0000-000000000001', 'BMBR-OLV-M', 'Sage Olive', '#556b2f', 'M', 8, true),
  ('a1000000-0000-0000-0000-000000000001', 'BMBR-OLV-L', 'Sage Olive', '#556b2f', 'L', 4, true),

  -- Tee
  ('a1000000-0000-0000-0000-000000000002', 'ACID-GRY-S', 'Washed Charcoal', '#374151', 'S', 20, true),
  ('a1000000-0000-0000-0000-000000000002', 'ACID-GRY-M', 'Washed Charcoal', '#374151', 'M', 25, true),
  ('a1000000-0000-0000-0000-000000000002', 'ACID-GRY-L', 'Washed Charcoal', '#374151', 'L', 18, true),
  ('a1000000-0000-0000-0000-000000000002', 'ACID-WHT-M', 'Bone White', '#f3f4f6', 'M', 14, true),

  -- Blazer
  ('a1000000-0000-0000-0000-000000000003', 'BLZR-BGE-S', 'Oatmeal Beige', '#d7c4b7', 'S', 10, true),
  ('a1000000-0000-0000-0000-000000000003', 'BLZR-BGE-M', 'Oatmeal Beige', '#d7c4b7', 'M', 12, true),

  -- Trousers
  ('a1000000-0000-0000-0000-000000000004', 'TRSR-BLK-28', 'Midnight Black', '#000000', 'S', 10, true),
  ('a1000000-0000-0000-0000-000000000004', 'TRSR-BLK-32', 'Midnight Black', '#000000', 'M', 15, true),

  -- Cardigan
  ('a1000000-0000-0000-0000-000000000005', 'CRDN-CRM-S', 'Butter Cream', '#fdfbf7', 'S', 8, true),
  ('a1000000-0000-0000-0000-000000000005', 'CRDN-CRM-M', 'Butter Cream', '#fdfbf7', 'M', 6, true),

  -- Cargo
  ('a1000000-0000-0000-0000-000000000006', 'CRGO-KHK-M', 'Desert Khaki', '#c3b091', 'M', 12, true),
  ('a1000000-0000-0000-0000-000000000006', 'CRGO-KHK-L', 'Desert Khaki', '#c3b091', 'L', 9, true),

  -- Resort Shirt
  ('a1000000-0000-0000-0000-000000000007', 'RSRT-BLU-M', 'Ocean Blue', '#3b82f6', 'M', 14, true),
  ('a1000000-0000-0000-0000-000000000007', 'RSRT-BLU-L', 'Ocean Blue', '#3b82f6', 'L', 10, true),

  -- Hoodie
  ('a1000000-0000-0000-0000-000000000008', 'HOOD-PRP-M', 'Electric Lime', '#ccff00', 'M', 16, true),
  ('a1000000-0000-0000-0000-000000000008', 'HOOD-PRP-L', 'Electric Lime', '#ccff00', 'L', 11, true)
ON CONFLICT (sku) DO NOTHING;
