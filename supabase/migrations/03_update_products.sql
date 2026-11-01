-- Migration 03: Replace catalog with user-selected Amazon clothing items

-- 1. Ensure categories exist
INSERT INTO public.categories (id, name, slug, description, sort_order)
VALUES 
  ('c1000000-0000-0000-0000-000000000006', 'Shirts', 'shirts', 'Premium button-down, casual, and formal shirts', 6),
  ('c1000000-0000-0000-0000-000000000007', 'T-Shirts', 't-shirts', 'Oversized, textured polo, and graphic t-shirts', 7)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Clear old products
DELETE FROM public.products;

-- 3. Insert new products

-- Product 1: DEEMOON Premium Flannel Checkered Button-Down Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'DEEMOON Premium Flannel Checkered Button-Down Shirt',
  'deemoon-premium-flannel-checkered-button-down-shirt-b0hbqgp7fj',
  'Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'DEEMOON',
  'c1000000-0000-0000-0000-000000000006',
  42400,
  63600,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['shirts', 'deemoon', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg',
  'DEEMOON Premium Flannel Checkered Button-Down Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000001', 'B0HBQGP7FJ-S', 'Original', '#1a1a1a', 'S', 25, 42400, 63600),
  ('b1000000-0000-0000-0000-000000000001', 'B0HBQGP7FJ-M', 'Original', '#1a1a1a', 'M', 50, 42400, 63600),
  ('b1000000-0000-0000-0000-000000000001', 'B0HBQGP7FJ-L', 'Original', '#1a1a1a', 'L', 40, 42400, 63600),
  ('b1000000-0000-0000-0000-000000000001', 'B0HBQGP7FJ-XL', 'Original', '#1a1a1a', 'XL', 20, 42400, 63600);

-- Product 2: DEELMO Stylish Button-Down Comfortable Breathable Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'DEELMO Stylish Button-Down Comfortable Breathable Shirt',
  'deelmo-stylish-button-down-comfortable-breathable-shirt-b0fxrs8frw',
  'Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'DEELMO',
  'c1000000-0000-0000-0000-000000000006',
  40900,
  61400,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/61H1HxfTAUL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['shirts', 'deelmo', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'https://m.media-amazon.com/images/I/61H1HxfTAUL._SL1500_.jpg',
  'DEELMO Stylish Button-Down Comfortable Breathable Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000002', 'B0FXRS8FRW-S', 'Original', '#1a1a1a', 'S', 25, 40900, 61400),
  ('b1000000-0000-0000-0000-000000000002', 'B0FXRS8FRW-M', 'Original', '#1a1a1a', 'M', 50, 40900, 61400),
  ('b1000000-0000-0000-0000-000000000002', 'B0FXRS8FRW-L', 'Original', '#1a1a1a', 'L', 40, 40900, 61400),
  ('b1000000-0000-0000-0000-000000000002', 'B0FXRS8FRW-XL', 'Original', '#1a1a1a', 'XL', 20, 40900, 61400);

-- Product 3: CB-COLEBROOK Regular Spread Collar Casual Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'CB-COLEBROOK Regular Spread Collar Casual Shirt',
  'cb-colebrook-regular-spread-collar-casual-shirt-b0cgllyv2d',
  'Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'CB-COLEBROOK',
  'c1000000-0000-0000-0000-000000000006',
  44900,
  67400,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/71DU0wuXOSL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['shirts', 'cb-colebrook', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'https://m.media-amazon.com/images/I/71DU0wuXOSL._SL1500_.jpg',
  'CB-COLEBROOK Regular Spread Collar Casual Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000003', 'B0CGLLYV2D-S', 'Original', '#1a1a1a', 'S', 25, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000003', 'B0CGLLYV2D-M', 'Original', '#1a1a1a', 'M', 50, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000003', 'B0CGLLYV2D-L', 'Original', '#1a1a1a', 'L', 40, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000003', 'B0CGLLYV2D-XL', 'Original', '#1a1a1a', 'XL', 20, 44900, 67400);

-- Product 4: DEELMO Casual Fashion Textured Regular Fit Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000004',
  'DEELMO Casual Fashion Textured Regular Fit Shirt',
  'deelmo-casual-fashion-textured-regular-fit-shirt-b0f4ngfrbp',
  'Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'DEELMO',
  'c1000000-0000-0000-0000-000000000006',
  43500,
  65300,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/71yYmprvNFL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['shirts', 'deelmo', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000004',
  'https://m.media-amazon.com/images/I/71yYmprvNFL._SL1500_.jpg',
  'DEELMO Casual Fashion Textured Regular Fit Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000004', 'B0F4NGFRBP-S', 'Original', '#1a1a1a', 'S', 25, 43500, 65300),
  ('b1000000-0000-0000-0000-000000000004', 'B0F4NGFRBP-M', 'Original', '#1a1a1a', 'M', 50, 43500, 65300),
  ('b1000000-0000-0000-0000-000000000004', 'B0F4NGFRBP-L', 'Original', '#1a1a1a', 'L', 40, 43500, 65300),
  ('b1000000-0000-0000-0000-000000000004', 'B0F4NGFRBP-XL', 'Original', '#1a1a1a', 'XL', 20, 43500, 65300);

-- Product 5: IMPERIAL CHOICE Printed Mandarin Collar Stylish Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000005',
  'IMPERIAL CHOICE Printed Mandarin Collar Stylish Shirt',
  'imperial-choice-printed-mandarin-collar-stylish-shirt-b0gk992flm',
  'Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'IMPERIAL',
  'c1000000-0000-0000-0000-000000000006',
  43900,
  65900,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/51g38H3JciL.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['shirts', 'imperial', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000005',
  'https://m.media-amazon.com/images/I/51g38H3JciL.jpg',
  'IMPERIAL CHOICE Printed Mandarin Collar Stylish Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000005', 'B0GK992FLM-S', 'Original', '#1a1a1a', 'S', 25, 43900, 65900),
  ('b1000000-0000-0000-0000-000000000005', 'B0GK992FLM-M', 'Original', '#1a1a1a', 'M', 50, 43900, 65900),
  ('b1000000-0000-0000-0000-000000000005', 'B0GK992FLM-L', 'Original', '#1a1a1a', 'L', 40, 43900, 65900),
  ('b1000000-0000-0000-0000-000000000005', 'B0GK992FLM-XL', 'Original', '#1a1a1a', 'XL', 20, 43900, 65900);

-- Product 6: TOPLOT Regular Fit Men Plain Shirt Pista Green
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000006',
  'TOPLOT Regular Fit Men Plain Shirt Pista Green',
  'toplot-regular-fit-men-plain-shirt-pista-green-b0fhvt8kkr',
  'Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'TOPLOT',
  'c1000000-0000-0000-0000-000000000006',
  39900,
  59900,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/71n30esNlWL._SL1067_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['shirts', 'toplot', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000006',
  'https://m.media-amazon.com/images/I/71n30esNlWL._SL1067_.jpg',
  'TOPLOT Regular Fit Men Plain Shirt Pista Green',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000006', 'B0FHVT8KKR-S', 'Original', '#1a1a1a', 'S', 25, 39900, 59900),
  ('b1000000-0000-0000-0000-000000000006', 'B0FHVT8KKR-M', 'Original', '#1a1a1a', 'M', 50, 39900, 59900),
  ('b1000000-0000-0000-0000-000000000006', 'B0FHVT8KKR-L', 'Original', '#1a1a1a', 'L', 40, 39900, 59900),
  ('b1000000-0000-0000-0000-000000000006', 'B0FHVT8KKR-XL', 'Original', '#1a1a1a', 'XL', 20, 39900, 59900);

-- Product 7: AUSK Baggy Hip-Hop Oversized T-Shirt Men
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000007',
  'AUSK Baggy Hip-Hop Oversized T-Shirt Men',
  'ausk-baggy-hip-hop-oversized-t-shirt-men-b0gktwqbl5',
  'Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'AUSK',
  'c1000000-0000-0000-0000-000000000007',
  21900,
  32900,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/71jdNEwCMmL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['t-shirts', 'ausk', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000007',
  'https://m.media-amazon.com/images/I/71jdNEwCMmL._SL1500_.jpg',
  'AUSK Baggy Hip-Hop Oversized T-Shirt Men',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000007', 'B0GKTWQBL5-S', 'Original', '#1a1a1a', 'S', 25, 21900, 32900),
  ('b1000000-0000-0000-0000-000000000007', 'B0GKTWQBL5-M', 'Original', '#1a1a1a', 'M', 50, 21900, 32900),
  ('b1000000-0000-0000-0000-000000000007', 'B0GKTWQBL5-L', 'Original', '#1a1a1a', 'L', 40, 21900, 32900),
  ('b1000000-0000-0000-0000-000000000007', 'B0GKTWQBL5-XL', 'Original', '#1a1a1a', 'XL', 20, 21900, 32900);

-- Product 8: Lymio Casual Graphic Print Regular T-Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000008',
  'Lymio Casual Graphic Print Regular T-Shirt',
  'lymio-casual-graphic-print-regular-t-shirt-b0dp7pqx5y',
  'Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'Lymio',
  'c1000000-0000-0000-0000-000000000007',
  34900,
  52400,
  TRUE,
  true,
  TRUE,
  'https://m.media-amazon.com/images/I/61xTfKaqUlL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['t-shirts', 'lymio', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000008',
  'https://m.media-amazon.com/images/I/61xTfKaqUlL._SL1500_.jpg',
  'Lymio Casual Graphic Print Regular T-Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000008', 'B0DP7PQX5Y-S', 'Original', '#1a1a1a', 'S', 25, 34900, 52400),
  ('b1000000-0000-0000-0000-000000000008', 'B0DP7PQX5Y-M', 'Original', '#1a1a1a', 'M', 50, 34900, 52400),
  ('b1000000-0000-0000-0000-000000000008', 'B0DP7PQX5Y-L', 'Original', '#1a1a1a', 'L', 40, 34900, 52400),
  ('b1000000-0000-0000-0000-000000000008', 'B0DP7PQX5Y-XL', 'Original', '#1a1a1a', 'XL', 20, 34900, 52400);

-- Product 9: AUSK Cable Knit Quarter-Zip Textured Polo T-Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000009',
  'AUSK Cable Knit Quarter-Zip Textured Polo T-Shirt',
  'ausk-cable-knit-quarter-zip-textured-polo-t-shirt-b0gjf5l2z3',
  'Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'AUSK',
  'c1000000-0000-0000-0000-000000000007',
  25100,
  37700,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/71s8+d84oJL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['t-shirts', 'ausk', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000009',
  'https://m.media-amazon.com/images/I/71s8+d84oJL._SL1500_.jpg',
  'AUSK Cable Knit Quarter-Zip Textured Polo T-Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000009', 'B0GJF5L2Z3-S', 'Original', '#1a1a1a', 'S', 25, 25100, 37700),
  ('b1000000-0000-0000-0000-000000000009', 'B0GJF5L2Z3-M', 'Original', '#1a1a1a', 'M', 50, 25100, 37700),
  ('b1000000-0000-0000-0000-000000000009', 'B0GJF5L2Z3-L', 'Original', '#1a1a1a', 'L', 40, 25100, 37700),
  ('b1000000-0000-0000-0000-000000000009', 'B0GJF5L2Z3-XL', 'Original', '#1a1a1a', 'XL', 20, 25100, 37700);

-- Product 10: Noble Monk Oversized Drop-Shoulder Sleeve T-Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000010',
  'Noble Monk Oversized Drop-Shoulder Sleeve T-Shirt',
  'noble-monk-oversized-drop-shoulder-sleeve-t-shirt-b0grwfs3wd',
  'Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'Noble',
  'c1000000-0000-0000-0000-000000000007',
  26000,
  39000,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/81I400aM+8L._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['t-shirts', 'noble', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000010',
  'https://m.media-amazon.com/images/I/81I400aM+8L._SL1500_.jpg',
  'Noble Monk Oversized Drop-Shoulder Sleeve T-Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000010', 'B0GRWFS3WD-S', 'Original', '#1a1a1a', 'S', 25, 26000, 39000),
  ('b1000000-0000-0000-0000-000000000010', 'B0GRWFS3WD-M', 'Original', '#1a1a1a', 'M', 50, 26000, 39000),
  ('b1000000-0000-0000-0000-000000000010', 'B0GRWFS3WD-L', 'Original', '#1a1a1a', 'L', 40, 26000, 39000),
  ('b1000000-0000-0000-0000-000000000010', 'B0GRWFS3WD-XL', 'Original', '#1a1a1a', 'XL', 20, 26000, 39000);

-- Product 11: TAGDO Textured Contrast Detailing Knit Polo T-Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000011',
  'TAGDO Textured Contrast Detailing Knit Polo T-Shirt',
  'tagdo-textured-contrast-detailing-knit-polo-t-shirt-b0hmkxv824',
  'Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'TAGDO',
  'c1000000-0000-0000-0000-000000000007',
  59900,
  89900,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61lBw-Kc3gL._SL1254_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['t-shirts', 'tagdo', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000011',
  'https://m.media-amazon.com/images/I/61lBw-Kc3gL._SL1254_.jpg',
  'TAGDO Textured Contrast Detailing Knit Polo T-Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000011', 'B0HMKXV824-S', 'Original', '#1a1a1a', 'S', 25, 59900, 89900),
  ('b1000000-0000-0000-0000-000000000011', 'B0HMKXV824-M', 'Original', '#1a1a1a', 'M', 50, 59900, 89900),
  ('b1000000-0000-0000-0000-000000000011', 'B0HMKXV824-L', 'Original', '#1a1a1a', 'L', 40, 59900, 89900),
  ('b1000000-0000-0000-0000-000000000011', 'B0HMKXV824-XL', 'Original', '#1a1a1a', 'XL', 20, 59900, 89900);

-- Product 12: LEOTUDE Cottonblend Graphic Oversized Navy Boston T-Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000012',
  'LEOTUDE Cottonblend Graphic Oversized Navy Boston T-Shirt',
  'leotude-cottonblend-graphic-oversized-navy-boston-t-shirt-b0fhdjzfjn',
  'Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'LEOTUDE',
  'c1000000-0000-0000-0000-000000000007',
  26800,
  40200,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61WYx598KKL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['t-shirts', 'leotude', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000012',
  'https://m.media-amazon.com/images/I/61WYx598KKL._SL1500_.jpg',
  'LEOTUDE Cottonblend Graphic Oversized Navy Boston T-Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000012', 'B0FHDJZFJN-S', 'Original', '#1a1a1a', 'S', 25, 26800, 40200),
  ('b1000000-0000-0000-0000-000000000012', 'B0FHDJZFJN-M', 'Original', '#1a1a1a', 'M', 50, 26800, 40200),
  ('b1000000-0000-0000-0000-000000000012', 'B0FHDJZFJN-L', 'Original', '#1a1a1a', 'L', 40, 26800, 40200),
  ('b1000000-0000-0000-0000-000000000012', 'B0FHDJZFJN-XL', 'Original', '#1a1a1a', 'XL', 20, 26800, 40200);

-- Product 13: KZULLY Feminine Detail Stylish Allover Western Dress
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000013',
  'KZULLY Feminine Detail Stylish Allover Western Dress',
  'kzully-feminine-detail-stylish-allover-western-dress-b0gd1k8pj4',
  'Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'KZULLY',
  'c1000000-0000-0000-0000-000000000001',
  32900,
  49400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61ShDu8G-zL._SL1440_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['women', 'kzully', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000013',
  'https://m.media-amazon.com/images/I/61ShDu8G-zL._SL1440_.jpg',
  'KZULLY Feminine Detail Stylish Allover Western Dress',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000013', 'B0GD1K8PJ4-S', 'Original', '#1a1a1a', 'S', 25, 32900, 49400),
  ('b1000000-0000-0000-0000-000000000013', 'B0GD1K8PJ4-M', 'Original', '#1a1a1a', 'M', 50, 32900, 49400),
  ('b1000000-0000-0000-0000-000000000013', 'B0GD1K8PJ4-L', 'Original', '#1a1a1a', 'L', 40, 32900, 49400),
  ('b1000000-0000-0000-0000-000000000013', 'B0GD1K8PJ4-XL', 'Original', '#1a1a1a', 'XL', 20, 32900, 49400);

-- Product 14: Shasmi Cinched Waist Western Brown Dress
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000014',
  'Shasmi Cinched Waist Western Brown Dress',
  'shasmi-cinched-waist-western-brown-dress-b0flk6q7nv',
  'Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'Shasmi',
  'c1000000-0000-0000-0000-000000000001',
  48900,
  73400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61OzjLUVZZL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['women', 'shasmi', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000014',
  'https://m.media-amazon.com/images/I/61OzjLUVZZL._SL1500_.jpg',
  'Shasmi Cinched Waist Western Brown Dress',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000014', 'B0FLK6Q7NV-S', 'Original', '#1a1a1a', 'S', 25, 48900, 73400),
  ('b1000000-0000-0000-0000-000000000014', 'B0FLK6Q7NV-M', 'Original', '#1a1a1a', 'M', 50, 48900, 73400),
  ('b1000000-0000-0000-0000-000000000014', 'B0FLK6Q7NV-L', 'Original', '#1a1a1a', 'L', 40, 48900, 73400),
  ('b1000000-0000-0000-0000-000000000014', 'B0FLK6Q7NV-XL', 'Original', '#1a1a1a', 'XL', 20, 48900, 73400);

-- Product 15: KLOSIA Printed Anarkali Kurta with Dupatta Maroon
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000015',
  'KLOSIA Printed Anarkali Kurta with Dupatta Maroon',
  'klosia-printed-anarkali-kurta-with-dupatta-maroon-b0frfvfyd7',
  'Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'KLOSIA',
  'c1000000-0000-0000-0000-000000000001',
  66000,
  99000,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/51JtGs04X7L._SL1099_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['women', 'klosia', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000015',
  'https://m.media-amazon.com/images/I/51JtGs04X7L._SL1099_.jpg',
  'KLOSIA Printed Anarkali Kurta with Dupatta Maroon',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000015', 'B0FRFVFYD7-S', 'Original', '#1a1a1a', 'S', 25, 66000, 99000),
  ('b1000000-0000-0000-0000-000000000015', 'B0FRFVFYD7-M', 'Original', '#1a1a1a', 'M', 50, 66000, 99000),
  ('b1000000-0000-0000-0000-000000000015', 'B0FRFVFYD7-L', 'Original', '#1a1a1a', 'L', 40, 66000, 99000),
  ('b1000000-0000-0000-0000-000000000015', 'B0FRFVFYD7-XL', 'Original', '#1a1a1a', 'XL', 20, 66000, 99000);

-- Product 16: GoSriKi Viscose Printed Banditha Kurti Pant Set Kerosin
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000016',
  'GoSriKi Viscose Printed Banditha Kurti Pant Set Kerosin',
  'gosriki-viscose-printed-banditha-kurti-pant-set-kerosin-b0gtvx18kw',
  'Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'GoSriKi',
  'c1000000-0000-0000-0000-000000000001',
  64900,
  97400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/71zBxzukDgL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['women', 'gosriki', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000016',
  'https://m.media-amazon.com/images/I/71zBxzukDgL._SL1500_.jpg',
  'GoSriKi Viscose Printed Banditha Kurti Pant Set Kerosin',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000016', 'B0GTVX18KW-S', 'Original', '#1a1a1a', 'S', 25, 64900, 97400),
  ('b1000000-0000-0000-0000-000000000016', 'B0GTVX18KW-M', 'Original', '#1a1a1a', 'M', 50, 64900, 97400),
  ('b1000000-0000-0000-0000-000000000016', 'B0GTVX18KW-L', 'Original', '#1a1a1a', 'L', 40, 64900, 97400),
  ('b1000000-0000-0000-0000-000000000016', 'B0GTVX18KW-XL', 'Original', '#1a1a1a', 'XL', 20, 64900, 97400);

-- Product 17: LITZO Western Elegance Midi Dress for Women
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000017',
  'LITZO Western Elegance Midi Dress for Women',
  'litzo-western-elegance-midi-dress-for-women-b0dqcmdbhv',
  'Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'LITZO',
  'c1000000-0000-0000-0000-000000000001',
  44900,
  67400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61abwaouC7L._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['women', 'litzo', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000017',
  'https://m.media-amazon.com/images/I/61abwaouC7L._SL1500_.jpg',
  'LITZO Western Elegance Midi Dress for Women',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000017', 'B0DQCMDBHV-S', 'Original', '#1a1a1a', 'S', 25, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000017', 'B0DQCMDBHV-M', 'Original', '#1a1a1a', 'M', 50, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000017', 'B0DQCMDBHV-L', 'Original', '#1a1a1a', 'L', 40, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000017', 'B0DQCMDBHV-XL', 'Original', '#1a1a1a', 'XL', 20, 44900, 67400);

-- Product 18: LookMark Printed Traditional Ethnic Kurta Dupatta Set
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000018',
  'LookMark Printed Traditional Ethnic Kurta Dupatta Set',
  'lookmark-printed-traditional-ethnic-kurta-dupatta-set-b0h5kx69r2',
  'Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'LookMark',
  'c1000000-0000-0000-0000-000000000001',
  42900,
  64400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61UVk6rFvUL._SL1448_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['women', 'lookmark', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000018',
  'https://m.media-amazon.com/images/I/61UVk6rFvUL._SL1448_.jpg',
  'LookMark Printed Traditional Ethnic Kurta Dupatta Set',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000018', 'B0H5KX69R2-S', 'Original', '#1a1a1a', 'S', 25, 42900, 64400),
  ('b1000000-0000-0000-0000-000000000018', 'B0H5KX69R2-M', 'Original', '#1a1a1a', 'M', 50, 42900, 64400),
  ('b1000000-0000-0000-0000-000000000018', 'B0H5KX69R2-L', 'Original', '#1a1a1a', 'L', 40, 42900, 64400),
  ('b1000000-0000-0000-0000-000000000018', 'B0H5KX69R2-XL', 'Original', '#1a1a1a', 'XL', 20, 42900, 64400);

-- Product 19: Outfit Mandarin Collar Striped Comfortable Kids Wear
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000019',
  'Outfit Mandarin Collar Striped Comfortable Kids Wear',
  'outfit-mandarin-collar-striped-comfortable-kids-wear-b0h33r62kh',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'Outfit',
  'c1000000-0000-0000-0000-000000000005',
  21700,
  32600,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61Kq7FJ7iDL._SL1248_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'outfit', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000019',
  'https://m.media-amazon.com/images/I/61Kq7FJ7iDL._SL1248_.jpg',
  'Outfit Mandarin Collar Striped Comfortable Kids Wear',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000019', 'B0H33R62KH-S', 'Original', '#1a1a1a', 'S', 25, 21700, 32600),
  ('b1000000-0000-0000-0000-000000000019', 'B0H33R62KH-M', 'Original', '#1a1a1a', 'M', 50, 21700, 32600),
  ('b1000000-0000-0000-0000-000000000019', 'B0H33R62KH-L', 'Original', '#1a1a1a', 'L', 40, 21700, 32600),
  ('b1000000-0000-0000-0000-000000000019', 'B0H33R62KH-XL', 'Original', '#1a1a1a', 'XL', 20, 21700, 32600);

-- Product 20: White Button Latest Pavadai Lehenga Choli Set for Girls
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000020',
  'White Button Latest Pavadai Lehenga Choli Set for Girls',
  'white-button-latest-pavadai-lehenga-choli-set-for-girls-b0h2rvdfty',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'White',
  'c1000000-0000-0000-0000-000000000005',
  84200,
  126300,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61JGaSR5JbL._SL1264_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'white', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000020',
  'https://m.media-amazon.com/images/I/61JGaSR5JbL._SL1264_.jpg',
  'White Button Latest Pavadai Lehenga Choli Set for Girls',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000020', 'B0H2RVDFTY-S', 'Original', '#1a1a1a', 'S', 25, 84200, 126300),
  ('b1000000-0000-0000-0000-000000000020', 'B0H2RVDFTY-M', 'Original', '#1a1a1a', 'M', 50, 84200, 126300),
  ('b1000000-0000-0000-0000-000000000020', 'B0H2RVDFTY-L', 'Original', '#1a1a1a', 'L', 40, 84200, 126300),
  ('b1000000-0000-0000-0000-000000000020', 'B0H2RVDFTY-XL', 'Original', '#1a1a1a', 'XL', 20, 84200, 126300);

-- Product 21: DINGDONG Sweatshirt Printed Sleeves & Joggers Set
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000021',
  'DINGDONG Sweatshirt Printed Sleeves & Joggers Set',
  'dingdong-sweatshirt-printed-sleeves-joggers-set-b0fwrtvcbt',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'DINGDONG',
  'c1000000-0000-0000-0000-000000000005',
  36800,
  55200,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61vtCFAvPOL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'dingdong', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000021',
  'https://m.media-amazon.com/images/I/61vtCFAvPOL._SL1500_.jpg',
  'DINGDONG Sweatshirt Printed Sleeves & Joggers Set',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000021', 'B0FWRTVCBT-S', 'Original', '#1a1a1a', 'S', 25, 36800, 55200),
  ('b1000000-0000-0000-0000-000000000021', 'B0FWRTVCBT-M', 'Original', '#1a1a1a', 'M', 50, 36800, 55200),
  ('b1000000-0000-0000-0000-000000000021', 'B0FWRTVCBT-L', 'Original', '#1a1a1a', 'L', 40, 36800, 55200),
  ('b1000000-0000-0000-0000-000000000021', 'B0FWRTVCBT-XL', 'Original', '#1a1a1a', 'XL', 20, 36800, 55200);

-- Product 22: MI Kidz Cotton Collared Polo T-Shirt
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000022',
  'MI Kidz Cotton Collared Polo T-Shirt',
  'mi-kidz-cotton-collared-polo-t-shirt-b0d7ytrnxj',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'MI',
  'c1000000-0000-0000-0000-000000000005',
  39900,
  59900,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/71KPInxRYmL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'mi', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000022',
  'https://m.media-amazon.com/images/I/71KPInxRYmL._SL1500_.jpg',
  'MI Kidz Cotton Collared Polo T-Shirt',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000022', 'B0D7YTRNXJ-S', 'Original', '#1a1a1a', 'S', 25, 39900, 59900),
  ('b1000000-0000-0000-0000-000000000022', 'B0D7YTRNXJ-M', 'Original', '#1a1a1a', 'M', 50, 39900, 59900),
  ('b1000000-0000-0000-0000-000000000022', 'B0D7YTRNXJ-L', 'Original', '#1a1a1a', 'L', 40, 39900, 59900),
  ('b1000000-0000-0000-0000-000000000022', 'B0D7YTRNXJ-XL', 'Original', '#1a1a1a', 'XL', 20, 39900, 59900);

-- Product 23: Indhrani Clothes Comfortable Playtime Co-ord Set
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000023',
  'Indhrani Clothes Comfortable Playtime Co-ord Set',
  'indhrani-clothes-comfortable-playtime-co-ord-set-b0gk7m8px2',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'Indhrani',
  'c1000000-0000-0000-0000-000000000005',
  46900,
  70400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/51ZcMc75foL._SL1500_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'indhrani', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000023',
  'https://m.media-amazon.com/images/I/51ZcMc75foL._SL1500_.jpg',
  'Indhrani Clothes Comfortable Playtime Co-ord Set',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000023', 'B0GK7M8PX2-S', 'Original', '#1a1a1a', 'S', 25, 46900, 70400),
  ('b1000000-0000-0000-0000-000000000023', 'B0GK7M8PX2-M', 'Original', '#1a1a1a', 'M', 50, 46900, 70400),
  ('b1000000-0000-0000-0000-000000000023', 'B0GK7M8PX2-L', 'Original', '#1a1a1a', 'L', 40, 46900, 70400),
  ('b1000000-0000-0000-0000-000000000023', 'B0GK7M8PX2-XL', 'Original', '#1a1a1a', 'XL', 20, 46900, 70400);

-- Product 24: PEELOO Bottom Comfortable Everyday Activity Casual Wear
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000024',
  'PEELOO Bottom Comfortable Everyday Activity Casual Wear',
  'peeloo-bottom-comfortable-everyday-activity-casual-wear-b0h62r5hh3',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'PEELOO',
  'c1000000-0000-0000-0000-000000000005',
  25900,
  38900,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/41miAks84CL.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'peeloo', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000024',
  'https://m.media-amazon.com/images/I/41miAks84CL.jpg',
  'PEELOO Bottom Comfortable Everyday Activity Casual Wear',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000024', 'B0H62R5HH3-S', 'Original', '#1a1a1a', 'S', 25, 25900, 38900),
  ('b1000000-0000-0000-0000-000000000024', 'B0H62R5HH3-M', 'Original', '#1a1a1a', 'M', 50, 25900, 38900),
  ('b1000000-0000-0000-0000-000000000024', 'B0H62R5HH3-L', 'Original', '#1a1a1a', 'L', 40, 25900, 38900),
  ('b1000000-0000-0000-0000-000000000024', 'B0H62R5HH3-XL', 'Original', '#1a1a1a', 'XL', 20, 25900, 38900);

-- Product 25: Tagas Elegant Ruffles Floral Embroidery Girls Frock
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000025',
  'Tagas Elegant Ruffles Floral Embroidery Girls Frock',
  'tagas-elegant-ruffles-floral-embroidery-girls-frock-b0g5k56syy',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'Tagas',
  'c1000000-0000-0000-0000-000000000005',
  44900,
  67400,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/61oVOgecqCL._SL1280_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'tagas', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000025',
  'https://m.media-amazon.com/images/I/61oVOgecqCL._SL1280_.jpg',
  'Tagas Elegant Ruffles Floral Embroidery Girls Frock',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000025', 'B0G5K56SYY-S', 'Original', '#1a1a1a', 'S', 25, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000025', 'B0G5K56SYY-M', 'Original', '#1a1a1a', 'M', 50, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000025', 'B0G5K56SYY-L', 'Original', '#1a1a1a', 'L', 40, 44900, 67400),
  ('b1000000-0000-0000-0000-000000000025', 'B0G5K56SYY-XL', 'Original', '#1a1a1a', 'XL', 20, 44900, 67400);

-- Product 26: minicult 100% Cotton Coordinated Sweatshirt Trackpant Mickey
INSERT INTO public.products (
  id, name, slug, description, brand, category_id,
  selling_price_paise, compare_price_paise, is_active, is_featured,
  supports_tryon, tryon_garment_image_url, material, tags
) VALUES (
  'b1000000-0000-0000-0000-000000000026',
  'minicult 100% Cotton Coordinated Sweatshirt Trackpant Mickey',
  'minicult-100-cotton-coordinated-sweatshirt-trackpant-mickey-b0dgzf1xvt',
  'Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.',
  'minicult',
  'c1000000-0000-0000-0000-000000000005',
  42600,
  63900,
  TRUE,
  false,
  TRUE,
  'https://m.media-amazon.com/images/I/613Yxu4bVsL._SL1442_.jpg',
  '100% Breathable Cotton & Premium Blend',
  ARRAY['kids', 'minicult', 'trending', 'tryon-ready']
);

INSERT INTO public.product_images (
  product_id, url, alt_text, sort_order, is_primary
) VALUES (
  'b1000000-0000-0000-0000-000000000026',
  'https://m.media-amazon.com/images/I/613Yxu4bVsL._SL1442_.jpg',
  'minicult 100% Cotton Coordinated Sweatshirt Trackpant Mickey',
  0,
  TRUE
);

INSERT INTO public.product_variants (
  product_id, sku, color, color_hex, size, stock_quantity, selling_price_paise, compare_price_paise
) VALUES 
  ('b1000000-0000-0000-0000-000000000026', 'B0DGZF1XVT-S', 'Original', '#1a1a1a', 'S', 25, 42600, 63900),
  ('b1000000-0000-0000-0000-000000000026', 'B0DGZF1XVT-M', 'Original', '#1a1a1a', 'M', 50, 42600, 63900),
  ('b1000000-0000-0000-0000-000000000026', 'B0DGZF1XVT-L', 'Original', '#1a1a1a', 'L', 40, 42600, 63900),
  ('b1000000-0000-0000-0000-000000000026', 'B0DGZF1XVT-XL', 'Original', '#1a1a1a', 'XL', 20, 42600, 63900);
