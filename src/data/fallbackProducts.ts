import type { Product, Category } from '@/types'

export const FALLBACK_CATEGORIES: Category[] = [
  {
    "id": "c1000000-0000-0000-0000-000000000006",
    "name": "Shirts",
    "slug": "shirts",
    "description": "Premium button-down, casual, and formal shirts",
    "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
    "parent_id": null,
    "sort_order": 6,
    "is_active": true,
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z"
  },
  {
    "id": "c1000000-0000-0000-0000-000000000007",
    "name": "T-Shirts",
    "slug": "t-shirts",
    "description": "Oversized, textured polo, and graphic t-shirts",
    "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
    "parent_id": null,
    "sort_order": 7,
    "is_active": true,
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z"
  },
  {
    "id": "c1000000-0000-0000-0000-000000000001",
    "name": "Women",
    "slug": "women",
    "description": "Contemporary & festive wear for women",
    "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
    "parent_id": null,
    "sort_order": 8,
    "is_active": true,
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z"
  },
  {
    "id": "c1000000-0000-0000-0000-000000000005",
    "name": "Kids",
    "slug": "kids",
    "description": "Comfortable, durable & playful clothing for kids",
    "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
    "parent_id": null,
    "sort_order": 9,
    "is_active": true,
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z"
  }
]

export const FALLBACK_PRODUCTS: (Product & { category?: Category })[] = [
  {
    "id": "b1000000-0000-0000-0000-000000000001",
    "name": "DEEMOON Premium Flannel Checkered Button-Down Shirt",
    "slug": "deemoon-premium-flannel-checkered-button-down-shirt-b0hbqgp7fj",
    "description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "DEEMOON",
    "category_id": "c1000000-0000-0000-0000-000000000006",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000006",
      "name": "Shirts",
      "slug": "shirts",
      "description": "Premium button-down, casual, and formal shirts",
      "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 6,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 42400,
    "compare_price_paise": 63600,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "shirts",
      "deemoon",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "DEEMOON Premium Flannel Checkered Button-Down Shirt",
    "meta_description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000001",
        "product_id": "b1000000-0000-0000-0000-000000000001",
        "url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
        "alt_text": "DEEMOON Premium Flannel Checkered Button-Down Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0HBQGP7FJ-S",
        "product_id": "b1000000-0000-0000-0000-000000000001",
        "sku": "B0HBQGP7FJ-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 42400,
        "compare_price_paise": 63600,
        "is_active": true
      },
      {
        "id": "var-B0HBQGP7FJ-M",
        "product_id": "b1000000-0000-0000-0000-000000000001",
        "sku": "B0HBQGP7FJ-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 42400,
        "compare_price_paise": 63600,
        "is_active": true
      },
      {
        "id": "var-B0HBQGP7FJ-L",
        "product_id": "b1000000-0000-0000-0000-000000000001",
        "sku": "B0HBQGP7FJ-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 42400,
        "compare_price_paise": 63600,
        "is_active": true
      },
      {
        "id": "var-B0HBQGP7FJ-XL",
        "product_id": "b1000000-0000-0000-0000-000000000001",
        "sku": "B0HBQGP7FJ-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 42400,
        "compare_price_paise": 63600,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000002",
    "name": "DEELMO Stylish Button-Down Comfortable Breathable Shirt",
    "slug": "deelmo-stylish-button-down-comfortable-breathable-shirt-b0fxrs8frw",
    "description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "DEELMO",
    "category_id": "c1000000-0000-0000-0000-000000000006",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000006",
      "name": "Shirts",
      "slug": "shirts",
      "description": "Premium button-down, casual, and formal shirts",
      "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 6,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 40900,
    "compare_price_paise": 61400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61H1HxfTAUL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "shirts",
      "deelmo",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "DEELMO Stylish Button-Down Comfortable Breathable Shirt",
    "meta_description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000002",
        "product_id": "b1000000-0000-0000-0000-000000000002",
        "url": "https://m.media-amazon.com/images/I/61H1HxfTAUL._SL1500_.jpg",
        "alt_text": "DEELMO Stylish Button-Down Comfortable Breathable Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0FXRS8FRW-S",
        "product_id": "b1000000-0000-0000-0000-000000000002",
        "sku": "B0FXRS8FRW-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 40900,
        "compare_price_paise": 61400,
        "is_active": true
      },
      {
        "id": "var-B0FXRS8FRW-M",
        "product_id": "b1000000-0000-0000-0000-000000000002",
        "sku": "B0FXRS8FRW-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 40900,
        "compare_price_paise": 61400,
        "is_active": true
      },
      {
        "id": "var-B0FXRS8FRW-L",
        "product_id": "b1000000-0000-0000-0000-000000000002",
        "sku": "B0FXRS8FRW-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 40900,
        "compare_price_paise": 61400,
        "is_active": true
      },
      {
        "id": "var-B0FXRS8FRW-XL",
        "product_id": "b1000000-0000-0000-0000-000000000002",
        "sku": "B0FXRS8FRW-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 40900,
        "compare_price_paise": 61400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000003",
    "name": "CB-COLEBROOK Regular Spread Collar Casual Shirt",
    "slug": "cb-colebrook-regular-spread-collar-casual-shirt-b0cgllyv2d",
    "description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "CB-COLEBROOK",
    "category_id": "c1000000-0000-0000-0000-000000000006",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000006",
      "name": "Shirts",
      "slug": "shirts",
      "description": "Premium button-down, casual, and formal shirts",
      "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 6,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 44900,
    "compare_price_paise": 67400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71DU0wuXOSL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "shirts",
      "cb-colebrook",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "CB-COLEBROOK Regular Spread Collar Casual Shirt",
    "meta_description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000003",
        "product_id": "b1000000-0000-0000-0000-000000000003",
        "url": "https://m.media-amazon.com/images/I/71DU0wuXOSL._SL1500_.jpg",
        "alt_text": "CB-COLEBROOK Regular Spread Collar Casual Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0CGLLYV2D-S",
        "product_id": "b1000000-0000-0000-0000-000000000003",
        "sku": "B0CGLLYV2D-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0CGLLYV2D-M",
        "product_id": "b1000000-0000-0000-0000-000000000003",
        "sku": "B0CGLLYV2D-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0CGLLYV2D-L",
        "product_id": "b1000000-0000-0000-0000-000000000003",
        "sku": "B0CGLLYV2D-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0CGLLYV2D-XL",
        "product_id": "b1000000-0000-0000-0000-000000000003",
        "sku": "B0CGLLYV2D-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000004",
    "name": "DEELMO Casual Fashion Textured Regular Fit Shirt",
    "slug": "deelmo-casual-fashion-textured-regular-fit-shirt-b0f4ngfrbp",
    "description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "DEELMO",
    "category_id": "c1000000-0000-0000-0000-000000000006",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000006",
      "name": "Shirts",
      "slug": "shirts",
      "description": "Premium button-down, casual, and formal shirts",
      "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 6,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 43500,
    "compare_price_paise": 65300,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71yYmprvNFL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "shirts",
      "deelmo",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "DEELMO Casual Fashion Textured Regular Fit Shirt",
    "meta_description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000004",
        "product_id": "b1000000-0000-0000-0000-000000000004",
        "url": "https://m.media-amazon.com/images/I/71yYmprvNFL._SL1500_.jpg",
        "alt_text": "DEELMO Casual Fashion Textured Regular Fit Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0F4NGFRBP-S",
        "product_id": "b1000000-0000-0000-0000-000000000004",
        "sku": "B0F4NGFRBP-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 43500,
        "compare_price_paise": 65300,
        "is_active": true
      },
      {
        "id": "var-B0F4NGFRBP-M",
        "product_id": "b1000000-0000-0000-0000-000000000004",
        "sku": "B0F4NGFRBP-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 43500,
        "compare_price_paise": 65300,
        "is_active": true
      },
      {
        "id": "var-B0F4NGFRBP-L",
        "product_id": "b1000000-0000-0000-0000-000000000004",
        "sku": "B0F4NGFRBP-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 43500,
        "compare_price_paise": 65300,
        "is_active": true
      },
      {
        "id": "var-B0F4NGFRBP-XL",
        "product_id": "b1000000-0000-0000-0000-000000000004",
        "sku": "B0F4NGFRBP-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 43500,
        "compare_price_paise": 65300,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000005",
    "name": "IMPERIAL CHOICE Printed Mandarin Collar Stylish Shirt",
    "slug": "imperial-choice-printed-mandarin-collar-stylish-shirt-b0gk992flm",
    "description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "IMPERIAL",
    "category_id": "c1000000-0000-0000-0000-000000000006",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000006",
      "name": "Shirts",
      "slug": "shirts",
      "description": "Premium button-down, casual, and formal shirts",
      "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 6,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 43900,
    "compare_price_paise": 65900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/51g38H3JciL.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "shirts",
      "imperial",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "IMPERIAL CHOICE Printed Mandarin Collar Stylish Shirt",
    "meta_description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000005",
        "product_id": "b1000000-0000-0000-0000-000000000005",
        "url": "https://m.media-amazon.com/images/I/51g38H3JciL.jpg",
        "alt_text": "IMPERIAL CHOICE Printed Mandarin Collar Stylish Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GK992FLM-S",
        "product_id": "b1000000-0000-0000-0000-000000000005",
        "sku": "B0GK992FLM-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 43900,
        "compare_price_paise": 65900,
        "is_active": true
      },
      {
        "id": "var-B0GK992FLM-M",
        "product_id": "b1000000-0000-0000-0000-000000000005",
        "sku": "B0GK992FLM-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 43900,
        "compare_price_paise": 65900,
        "is_active": true
      },
      {
        "id": "var-B0GK992FLM-L",
        "product_id": "b1000000-0000-0000-0000-000000000005",
        "sku": "B0GK992FLM-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 43900,
        "compare_price_paise": 65900,
        "is_active": true
      },
      {
        "id": "var-B0GK992FLM-XL",
        "product_id": "b1000000-0000-0000-0000-000000000005",
        "sku": "B0GK992FLM-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 43900,
        "compare_price_paise": 65900,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000006",
    "name": "TOPLOT Regular Fit Men Plain Shirt Pista Green",
    "slug": "toplot-regular-fit-men-plain-shirt-pista-green-b0fhvt8kkr",
    "description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "TOPLOT",
    "category_id": "c1000000-0000-0000-0000-000000000006",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000006",
      "name": "Shirts",
      "slug": "shirts",
      "description": "Premium button-down, casual, and formal shirts",
      "image_url": "https://m.media-amazon.com/images/I/81ochE-BbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 6,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 39900,
    "compare_price_paise": 59900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71n30esNlWL._SL1067_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "shirts",
      "toplot",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "TOPLOT Regular Fit Men Plain Shirt Pista Green",
    "meta_description": "Premium quality shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000006",
        "product_id": "b1000000-0000-0000-0000-000000000006",
        "url": "https://m.media-amazon.com/images/I/71n30esNlWL._SL1067_.jpg",
        "alt_text": "TOPLOT Regular Fit Men Plain Shirt Pista Green",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0FHVT8KKR-S",
        "product_id": "b1000000-0000-0000-0000-000000000006",
        "sku": "B0FHVT8KKR-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      },
      {
        "id": "var-B0FHVT8KKR-M",
        "product_id": "b1000000-0000-0000-0000-000000000006",
        "sku": "B0FHVT8KKR-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      },
      {
        "id": "var-B0FHVT8KKR-L",
        "product_id": "b1000000-0000-0000-0000-000000000006",
        "sku": "B0FHVT8KKR-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      },
      {
        "id": "var-B0FHVT8KKR-XL",
        "product_id": "b1000000-0000-0000-0000-000000000006",
        "sku": "B0FHVT8KKR-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000007",
    "name": "AUSK Baggy Hip-Hop Oversized T-Shirt Men",
    "slug": "ausk-baggy-hip-hop-oversized-t-shirt-men-b0gktwqbl5",
    "description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "AUSK",
    "category_id": "c1000000-0000-0000-0000-000000000007",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000007",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Oversized, textured polo, and graphic t-shirts",
      "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 7,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 21900,
    "compare_price_paise": 32900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71jdNEwCMmL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "t-shirts",
      "ausk",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "AUSK Baggy Hip-Hop Oversized T-Shirt Men",
    "meta_description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000007",
        "product_id": "b1000000-0000-0000-0000-000000000007",
        "url": "https://m.media-amazon.com/images/I/71jdNEwCMmL._SL1500_.jpg",
        "alt_text": "AUSK Baggy Hip-Hop Oversized T-Shirt Men",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GKTWQBL5-S",
        "product_id": "b1000000-0000-0000-0000-000000000007",
        "sku": "B0GKTWQBL5-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 21900,
        "compare_price_paise": 32900,
        "is_active": true
      },
      {
        "id": "var-B0GKTWQBL5-M",
        "product_id": "b1000000-0000-0000-0000-000000000007",
        "sku": "B0GKTWQBL5-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 21900,
        "compare_price_paise": 32900,
        "is_active": true
      },
      {
        "id": "var-B0GKTWQBL5-L",
        "product_id": "b1000000-0000-0000-0000-000000000007",
        "sku": "B0GKTWQBL5-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 21900,
        "compare_price_paise": 32900,
        "is_active": true
      },
      {
        "id": "var-B0GKTWQBL5-XL",
        "product_id": "b1000000-0000-0000-0000-000000000007",
        "sku": "B0GKTWQBL5-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 21900,
        "compare_price_paise": 32900,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000008",
    "name": "Lymio Casual Graphic Print Regular T-Shirt",
    "slug": "lymio-casual-graphic-print-regular-t-shirt-b0dp7pqx5y",
    "description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "Lymio",
    "category_id": "c1000000-0000-0000-0000-000000000007",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000007",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Oversized, textured polo, and graphic t-shirts",
      "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 7,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 34900,
    "compare_price_paise": 52400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61xTfKaqUlL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "t-shirts",
      "lymio",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "Lymio Casual Graphic Print Regular T-Shirt",
    "meta_description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000008",
        "product_id": "b1000000-0000-0000-0000-000000000008",
        "url": "https://m.media-amazon.com/images/I/61xTfKaqUlL._SL1500_.jpg",
        "alt_text": "Lymio Casual Graphic Print Regular T-Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0DP7PQX5Y-S",
        "product_id": "b1000000-0000-0000-0000-000000000008",
        "sku": "B0DP7PQX5Y-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 34900,
        "compare_price_paise": 52400,
        "is_active": true
      },
      {
        "id": "var-B0DP7PQX5Y-M",
        "product_id": "b1000000-0000-0000-0000-000000000008",
        "sku": "B0DP7PQX5Y-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 34900,
        "compare_price_paise": 52400,
        "is_active": true
      },
      {
        "id": "var-B0DP7PQX5Y-L",
        "product_id": "b1000000-0000-0000-0000-000000000008",
        "sku": "B0DP7PQX5Y-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 34900,
        "compare_price_paise": 52400,
        "is_active": true
      },
      {
        "id": "var-B0DP7PQX5Y-XL",
        "product_id": "b1000000-0000-0000-0000-000000000008",
        "sku": "B0DP7PQX5Y-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 34900,
        "compare_price_paise": 52400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000009",
    "name": "AUSK Cable Knit Quarter-Zip Textured Polo T-Shirt",
    "slug": "ausk-cable-knit-quarter-zip-textured-polo-t-shirt-b0gjf5l2z3",
    "description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "AUSK",
    "category_id": "c1000000-0000-0000-0000-000000000007",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000007",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Oversized, textured polo, and graphic t-shirts",
      "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 7,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 25100,
    "compare_price_paise": 37700,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71s8+d84oJL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "t-shirts",
      "ausk",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "AUSK Cable Knit Quarter-Zip Textured Polo T-Shirt",
    "meta_description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000009",
        "product_id": "b1000000-0000-0000-0000-000000000009",
        "url": "https://m.media-amazon.com/images/I/71s8+d84oJL._SL1500_.jpg",
        "alt_text": "AUSK Cable Knit Quarter-Zip Textured Polo T-Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GJF5L2Z3-S",
        "product_id": "b1000000-0000-0000-0000-000000000009",
        "sku": "B0GJF5L2Z3-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 25100,
        "compare_price_paise": 37700,
        "is_active": true
      },
      {
        "id": "var-B0GJF5L2Z3-M",
        "product_id": "b1000000-0000-0000-0000-000000000009",
        "sku": "B0GJF5L2Z3-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 25100,
        "compare_price_paise": 37700,
        "is_active": true
      },
      {
        "id": "var-B0GJF5L2Z3-L",
        "product_id": "b1000000-0000-0000-0000-000000000009",
        "sku": "B0GJF5L2Z3-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 25100,
        "compare_price_paise": 37700,
        "is_active": true
      },
      {
        "id": "var-B0GJF5L2Z3-XL",
        "product_id": "b1000000-0000-0000-0000-000000000009",
        "sku": "B0GJF5L2Z3-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 25100,
        "compare_price_paise": 37700,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000010",
    "name": "Noble Monk Oversized Drop-Shoulder Sleeve T-Shirt",
    "slug": "noble-monk-oversized-drop-shoulder-sleeve-t-shirt-b0grwfs3wd",
    "description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "Noble",
    "category_id": "c1000000-0000-0000-0000-000000000007",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000007",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Oversized, textured polo, and graphic t-shirts",
      "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 7,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 26000,
    "compare_price_paise": 39000,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/81I400aM+8L._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "t-shirts",
      "noble",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "Noble Monk Oversized Drop-Shoulder Sleeve T-Shirt",
    "meta_description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000010",
        "product_id": "b1000000-0000-0000-0000-000000000010",
        "url": "https://m.media-amazon.com/images/I/81I400aM+8L._SL1500_.jpg",
        "alt_text": "Noble Monk Oversized Drop-Shoulder Sleeve T-Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GRWFS3WD-S",
        "product_id": "b1000000-0000-0000-0000-000000000010",
        "sku": "B0GRWFS3WD-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 26000,
        "compare_price_paise": 39000,
        "is_active": true
      },
      {
        "id": "var-B0GRWFS3WD-M",
        "product_id": "b1000000-0000-0000-0000-000000000010",
        "sku": "B0GRWFS3WD-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 26000,
        "compare_price_paise": 39000,
        "is_active": true
      },
      {
        "id": "var-B0GRWFS3WD-L",
        "product_id": "b1000000-0000-0000-0000-000000000010",
        "sku": "B0GRWFS3WD-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 26000,
        "compare_price_paise": 39000,
        "is_active": true
      },
      {
        "id": "var-B0GRWFS3WD-XL",
        "product_id": "b1000000-0000-0000-0000-000000000010",
        "sku": "B0GRWFS3WD-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 26000,
        "compare_price_paise": 39000,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000011",
    "name": "TAGDO Textured Contrast Detailing Knit Polo T-Shirt",
    "slug": "tagdo-textured-contrast-detailing-knit-polo-t-shirt-b0hmkxv824",
    "description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "TAGDO",
    "category_id": "c1000000-0000-0000-0000-000000000007",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000007",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Oversized, textured polo, and graphic t-shirts",
      "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 7,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 59900,
    "compare_price_paise": 89900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61lBw-Kc3gL._SL1254_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "t-shirts",
      "tagdo",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "TAGDO Textured Contrast Detailing Knit Polo T-Shirt",
    "meta_description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000011",
        "product_id": "b1000000-0000-0000-0000-000000000011",
        "url": "https://m.media-amazon.com/images/I/61lBw-Kc3gL._SL1254_.jpg",
        "alt_text": "TAGDO Textured Contrast Detailing Knit Polo T-Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0HMKXV824-S",
        "product_id": "b1000000-0000-0000-0000-000000000011",
        "sku": "B0HMKXV824-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 59900,
        "compare_price_paise": 89900,
        "is_active": true
      },
      {
        "id": "var-B0HMKXV824-M",
        "product_id": "b1000000-0000-0000-0000-000000000011",
        "sku": "B0HMKXV824-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 59900,
        "compare_price_paise": 89900,
        "is_active": true
      },
      {
        "id": "var-B0HMKXV824-L",
        "product_id": "b1000000-0000-0000-0000-000000000011",
        "sku": "B0HMKXV824-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 59900,
        "compare_price_paise": 89900,
        "is_active": true
      },
      {
        "id": "var-B0HMKXV824-XL",
        "product_id": "b1000000-0000-0000-0000-000000000011",
        "sku": "B0HMKXV824-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 59900,
        "compare_price_paise": 89900,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000012",
    "name": "LEOTUDE Cottonblend Graphic Oversized Navy Boston T-Shirt",
    "slug": "leotude-cottonblend-graphic-oversized-navy-boston-t-shirt-b0fhdjzfjn",
    "description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "LEOTUDE",
    "category_id": "c1000000-0000-0000-0000-000000000007",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000007",
      "name": "T-Shirts",
      "slug": "t-shirts",
      "description": "Oversized, textured polo, and graphic t-shirts",
      "image_url": "https://m.media-amazon.com/images/I/61k3p1jWbUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 7,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 26800,
    "compare_price_paise": 40200,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61WYx598KKL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "t-shirts",
      "leotude",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "LEOTUDE Cottonblend Graphic Oversized Navy Boston T-Shirt",
    "meta_description": "Premium quality t-shirts featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000012",
        "product_id": "b1000000-0000-0000-0000-000000000012",
        "url": "https://m.media-amazon.com/images/I/61WYx598KKL._SL1500_.jpg",
        "alt_text": "LEOTUDE Cottonblend Graphic Oversized Navy Boston T-Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0FHDJZFJN-S",
        "product_id": "b1000000-0000-0000-0000-000000000012",
        "sku": "B0FHDJZFJN-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 26800,
        "compare_price_paise": 40200,
        "is_active": true
      },
      {
        "id": "var-B0FHDJZFJN-M",
        "product_id": "b1000000-0000-0000-0000-000000000012",
        "sku": "B0FHDJZFJN-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 26800,
        "compare_price_paise": 40200,
        "is_active": true
      },
      {
        "id": "var-B0FHDJZFJN-L",
        "product_id": "b1000000-0000-0000-0000-000000000012",
        "sku": "B0FHDJZFJN-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 26800,
        "compare_price_paise": 40200,
        "is_active": true
      },
      {
        "id": "var-B0FHDJZFJN-XL",
        "product_id": "b1000000-0000-0000-0000-000000000012",
        "sku": "B0FHDJZFJN-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 26800,
        "compare_price_paise": 40200,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000013",
    "name": "KZULLY Feminine Detail Stylish Allover Western Dress",
    "slug": "kzully-feminine-detail-stylish-allover-western-dress-b0gd1k8pj4",
    "description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "KZULLY",
    "category_id": "c1000000-0000-0000-0000-000000000001",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000001",
      "name": "Women",
      "slug": "women",
      "description": "Contemporary & festive wear for women",
      "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 8,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 32900,
    "compare_price_paise": 49400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61ShDu8G-zL._SL1440_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "women",
      "kzully",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "KZULLY Feminine Detail Stylish Allover Western Dress",
    "meta_description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000013",
        "product_id": "b1000000-0000-0000-0000-000000000013",
        "url": "https://m.media-amazon.com/images/I/61ShDu8G-zL._SL1440_.jpg",
        "alt_text": "KZULLY Feminine Detail Stylish Allover Western Dress",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GD1K8PJ4-S",
        "product_id": "b1000000-0000-0000-0000-000000000013",
        "sku": "B0GD1K8PJ4-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 32900,
        "compare_price_paise": 49400,
        "is_active": true
      },
      {
        "id": "var-B0GD1K8PJ4-M",
        "product_id": "b1000000-0000-0000-0000-000000000013",
        "sku": "B0GD1K8PJ4-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 32900,
        "compare_price_paise": 49400,
        "is_active": true
      },
      {
        "id": "var-B0GD1K8PJ4-L",
        "product_id": "b1000000-0000-0000-0000-000000000013",
        "sku": "B0GD1K8PJ4-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 32900,
        "compare_price_paise": 49400,
        "is_active": true
      },
      {
        "id": "var-B0GD1K8PJ4-XL",
        "product_id": "b1000000-0000-0000-0000-000000000013",
        "sku": "B0GD1K8PJ4-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 32900,
        "compare_price_paise": 49400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000014",
    "name": "Shasmi Cinched Waist Western Brown Dress",
    "slug": "shasmi-cinched-waist-western-brown-dress-b0flk6q7nv",
    "description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "Shasmi",
    "category_id": "c1000000-0000-0000-0000-000000000001",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000001",
      "name": "Women",
      "slug": "women",
      "description": "Contemporary & festive wear for women",
      "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 8,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 48900,
    "compare_price_paise": 73400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61OzjLUVZZL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "women",
      "shasmi",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "Shasmi Cinched Waist Western Brown Dress",
    "meta_description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000014",
        "product_id": "b1000000-0000-0000-0000-000000000014",
        "url": "https://m.media-amazon.com/images/I/61OzjLUVZZL._SL1500_.jpg",
        "alt_text": "Shasmi Cinched Waist Western Brown Dress",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0FLK6Q7NV-S",
        "product_id": "b1000000-0000-0000-0000-000000000014",
        "sku": "B0FLK6Q7NV-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 48900,
        "compare_price_paise": 73400,
        "is_active": true
      },
      {
        "id": "var-B0FLK6Q7NV-M",
        "product_id": "b1000000-0000-0000-0000-000000000014",
        "sku": "B0FLK6Q7NV-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 48900,
        "compare_price_paise": 73400,
        "is_active": true
      },
      {
        "id": "var-B0FLK6Q7NV-L",
        "product_id": "b1000000-0000-0000-0000-000000000014",
        "sku": "B0FLK6Q7NV-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 48900,
        "compare_price_paise": 73400,
        "is_active": true
      },
      {
        "id": "var-B0FLK6Q7NV-XL",
        "product_id": "b1000000-0000-0000-0000-000000000014",
        "sku": "B0FLK6Q7NV-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 48900,
        "compare_price_paise": 73400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000015",
    "name": "KLOSIA Printed Anarkali Kurta with Dupatta Maroon",
    "slug": "klosia-printed-anarkali-kurta-with-dupatta-maroon-b0frfvfyd7",
    "description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "KLOSIA",
    "category_id": "c1000000-0000-0000-0000-000000000001",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000001",
      "name": "Women",
      "slug": "women",
      "description": "Contemporary & festive wear for women",
      "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 8,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 66000,
    "compare_price_paise": 99000,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/51JtGs04X7L._SL1099_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "women",
      "klosia",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "KLOSIA Printed Anarkali Kurta with Dupatta Maroon",
    "meta_description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000015",
        "product_id": "b1000000-0000-0000-0000-000000000015",
        "url": "https://m.media-amazon.com/images/I/51JtGs04X7L._SL1099_.jpg",
        "alt_text": "KLOSIA Printed Anarkali Kurta with Dupatta Maroon",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0FRFVFYD7-S",
        "product_id": "b1000000-0000-0000-0000-000000000015",
        "sku": "B0FRFVFYD7-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 66000,
        "compare_price_paise": 99000,
        "is_active": true
      },
      {
        "id": "var-B0FRFVFYD7-M",
        "product_id": "b1000000-0000-0000-0000-000000000015",
        "sku": "B0FRFVFYD7-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 66000,
        "compare_price_paise": 99000,
        "is_active": true
      },
      {
        "id": "var-B0FRFVFYD7-L",
        "product_id": "b1000000-0000-0000-0000-000000000015",
        "sku": "B0FRFVFYD7-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 66000,
        "compare_price_paise": 99000,
        "is_active": true
      },
      {
        "id": "var-B0FRFVFYD7-XL",
        "product_id": "b1000000-0000-0000-0000-000000000015",
        "sku": "B0FRFVFYD7-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 66000,
        "compare_price_paise": 99000,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000016",
    "name": "GoSriKi Viscose Printed Banditha Kurti Pant Set Kerosin",
    "slug": "gosriki-viscose-printed-banditha-kurti-pant-set-kerosin-b0gtvx18kw",
    "description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "GoSriKi",
    "category_id": "c1000000-0000-0000-0000-000000000001",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000001",
      "name": "Women",
      "slug": "women",
      "description": "Contemporary & festive wear for women",
      "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 8,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 64900,
    "compare_price_paise": 97400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71zBxzukDgL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "women",
      "gosriki",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "GoSriKi Viscose Printed Banditha Kurti Pant Set Kerosin",
    "meta_description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000016",
        "product_id": "b1000000-0000-0000-0000-000000000016",
        "url": "https://m.media-amazon.com/images/I/71zBxzukDgL._SL1500_.jpg",
        "alt_text": "GoSriKi Viscose Printed Banditha Kurti Pant Set Kerosin",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GTVX18KW-S",
        "product_id": "b1000000-0000-0000-0000-000000000016",
        "sku": "B0GTVX18KW-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 64900,
        "compare_price_paise": 97400,
        "is_active": true
      },
      {
        "id": "var-B0GTVX18KW-M",
        "product_id": "b1000000-0000-0000-0000-000000000016",
        "sku": "B0GTVX18KW-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 64900,
        "compare_price_paise": 97400,
        "is_active": true
      },
      {
        "id": "var-B0GTVX18KW-L",
        "product_id": "b1000000-0000-0000-0000-000000000016",
        "sku": "B0GTVX18KW-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 64900,
        "compare_price_paise": 97400,
        "is_active": true
      },
      {
        "id": "var-B0GTVX18KW-XL",
        "product_id": "b1000000-0000-0000-0000-000000000016",
        "sku": "B0GTVX18KW-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 64900,
        "compare_price_paise": 97400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000017",
    "name": "LITZO Western Elegance Midi Dress for Women",
    "slug": "litzo-western-elegance-midi-dress-for-women-b0dqcmdbhv",
    "description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "LITZO",
    "category_id": "c1000000-0000-0000-0000-000000000001",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000001",
      "name": "Women",
      "slug": "women",
      "description": "Contemporary & festive wear for women",
      "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 8,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 44900,
    "compare_price_paise": 67400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61abwaouC7L._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "women",
      "litzo",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "LITZO Western Elegance Midi Dress for Women",
    "meta_description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000017",
        "product_id": "b1000000-0000-0000-0000-000000000017",
        "url": "https://m.media-amazon.com/images/I/61abwaouC7L._SL1500_.jpg",
        "alt_text": "LITZO Western Elegance Midi Dress for Women",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0DQCMDBHV-S",
        "product_id": "b1000000-0000-0000-0000-000000000017",
        "sku": "B0DQCMDBHV-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0DQCMDBHV-M",
        "product_id": "b1000000-0000-0000-0000-000000000017",
        "sku": "B0DQCMDBHV-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0DQCMDBHV-L",
        "product_id": "b1000000-0000-0000-0000-000000000017",
        "sku": "B0DQCMDBHV-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0DQCMDBHV-XL",
        "product_id": "b1000000-0000-0000-0000-000000000017",
        "sku": "B0DQCMDBHV-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000018",
    "name": "LookMark Printed Traditional Ethnic Kurta Dupatta Set",
    "slug": "lookmark-printed-traditional-ethnic-kurta-dupatta-set-b0h5kx69r2",
    "description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "LookMark",
    "category_id": "c1000000-0000-0000-0000-000000000001",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000001",
      "name": "Women",
      "slug": "women",
      "description": "Contemporary & festive wear for women",
      "image_url": "https://m.media-amazon.com/images/I/71X8k4Z-Q3L._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 8,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 42900,
    "compare_price_paise": 64400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61UVk6rFvUL._SL1448_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "women",
      "lookmark",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "LookMark Printed Traditional Ethnic Kurta Dupatta Set",
    "meta_description": "Premium quality women featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000018",
        "product_id": "b1000000-0000-0000-0000-000000000018",
        "url": "https://m.media-amazon.com/images/I/61UVk6rFvUL._SL1448_.jpg",
        "alt_text": "LookMark Printed Traditional Ethnic Kurta Dupatta Set",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0H5KX69R2-S",
        "product_id": "b1000000-0000-0000-0000-000000000018",
        "sku": "B0H5KX69R2-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 42900,
        "compare_price_paise": 64400,
        "is_active": true
      },
      {
        "id": "var-B0H5KX69R2-M",
        "product_id": "b1000000-0000-0000-0000-000000000018",
        "sku": "B0H5KX69R2-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 42900,
        "compare_price_paise": 64400,
        "is_active": true
      },
      {
        "id": "var-B0H5KX69R2-L",
        "product_id": "b1000000-0000-0000-0000-000000000018",
        "sku": "B0H5KX69R2-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 42900,
        "compare_price_paise": 64400,
        "is_active": true
      },
      {
        "id": "var-B0H5KX69R2-XL",
        "product_id": "b1000000-0000-0000-0000-000000000018",
        "sku": "B0H5KX69R2-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 42900,
        "compare_price_paise": 64400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000019",
    "name": "Outfit Mandarin Collar Striped Comfortable Kids Wear",
    "slug": "outfit-mandarin-collar-striped-comfortable-kids-wear-b0h33r62kh",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "Outfit",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 21700,
    "compare_price_paise": 32600,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61Kq7FJ7iDL._SL1248_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "outfit",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "Outfit Mandarin Collar Striped Comfortable Kids Wear",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000019",
        "product_id": "b1000000-0000-0000-0000-000000000019",
        "url": "https://m.media-amazon.com/images/I/61Kq7FJ7iDL._SL1248_.jpg",
        "alt_text": "Outfit Mandarin Collar Striped Comfortable Kids Wear",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0H33R62KH-S",
        "product_id": "b1000000-0000-0000-0000-000000000019",
        "sku": "B0H33R62KH-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 21700,
        "compare_price_paise": 32600,
        "is_active": true
      },
      {
        "id": "var-B0H33R62KH-M",
        "product_id": "b1000000-0000-0000-0000-000000000019",
        "sku": "B0H33R62KH-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 21700,
        "compare_price_paise": 32600,
        "is_active": true
      },
      {
        "id": "var-B0H33R62KH-L",
        "product_id": "b1000000-0000-0000-0000-000000000019",
        "sku": "B0H33R62KH-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 21700,
        "compare_price_paise": 32600,
        "is_active": true
      },
      {
        "id": "var-B0H33R62KH-XL",
        "product_id": "b1000000-0000-0000-0000-000000000019",
        "sku": "B0H33R62KH-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 21700,
        "compare_price_paise": 32600,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000020",
    "name": "White Button Latest Pavadai Lehenga Choli Set for Girls",
    "slug": "white-button-latest-pavadai-lehenga-choli-set-for-girls-b0h2rvdfty",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "White",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 84200,
    "compare_price_paise": 126300,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61JGaSR5JbL._SL1264_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "white",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "White Button Latest Pavadai Lehenga Choli Set for Girls",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000020",
        "product_id": "b1000000-0000-0000-0000-000000000020",
        "url": "https://m.media-amazon.com/images/I/61JGaSR5JbL._SL1264_.jpg",
        "alt_text": "White Button Latest Pavadai Lehenga Choli Set for Girls",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0H2RVDFTY-S",
        "product_id": "b1000000-0000-0000-0000-000000000020",
        "sku": "B0H2RVDFTY-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 84200,
        "compare_price_paise": 126300,
        "is_active": true
      },
      {
        "id": "var-B0H2RVDFTY-M",
        "product_id": "b1000000-0000-0000-0000-000000000020",
        "sku": "B0H2RVDFTY-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 84200,
        "compare_price_paise": 126300,
        "is_active": true
      },
      {
        "id": "var-B0H2RVDFTY-L",
        "product_id": "b1000000-0000-0000-0000-000000000020",
        "sku": "B0H2RVDFTY-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 84200,
        "compare_price_paise": 126300,
        "is_active": true
      },
      {
        "id": "var-B0H2RVDFTY-XL",
        "product_id": "b1000000-0000-0000-0000-000000000020",
        "sku": "B0H2RVDFTY-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 84200,
        "compare_price_paise": 126300,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000021",
    "name": "DINGDONG Sweatshirt Printed Sleeves & Joggers Set",
    "slug": "dingdong-sweatshirt-printed-sleeves-joggers-set-b0fwrtvcbt",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "DINGDONG",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 36800,
    "compare_price_paise": 55200,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61vtCFAvPOL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "dingdong",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "DINGDONG Sweatshirt Printed Sleeves & Joggers Set",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000021",
        "product_id": "b1000000-0000-0000-0000-000000000021",
        "url": "https://m.media-amazon.com/images/I/61vtCFAvPOL._SL1500_.jpg",
        "alt_text": "DINGDONG Sweatshirt Printed Sleeves & Joggers Set",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0FWRTVCBT-S",
        "product_id": "b1000000-0000-0000-0000-000000000021",
        "sku": "B0FWRTVCBT-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 36800,
        "compare_price_paise": 55200,
        "is_active": true
      },
      {
        "id": "var-B0FWRTVCBT-M",
        "product_id": "b1000000-0000-0000-0000-000000000021",
        "sku": "B0FWRTVCBT-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 36800,
        "compare_price_paise": 55200,
        "is_active": true
      },
      {
        "id": "var-B0FWRTVCBT-L",
        "product_id": "b1000000-0000-0000-0000-000000000021",
        "sku": "B0FWRTVCBT-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 36800,
        "compare_price_paise": 55200,
        "is_active": true
      },
      {
        "id": "var-B0FWRTVCBT-XL",
        "product_id": "b1000000-0000-0000-0000-000000000021",
        "sku": "B0FWRTVCBT-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 36800,
        "compare_price_paise": 55200,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000022",
    "name": "MI Kidz Cotton Collared Polo T-Shirt",
    "slug": "mi-kidz-cotton-collared-polo-t-shirt-b0d7ytrnxj",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "MI",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 39900,
    "compare_price_paise": 59900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/71KPInxRYmL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "mi",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "MI Kidz Cotton Collared Polo T-Shirt",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000022",
        "product_id": "b1000000-0000-0000-0000-000000000022",
        "url": "https://m.media-amazon.com/images/I/71KPInxRYmL._SL1500_.jpg",
        "alt_text": "MI Kidz Cotton Collared Polo T-Shirt",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0D7YTRNXJ-S",
        "product_id": "b1000000-0000-0000-0000-000000000022",
        "sku": "B0D7YTRNXJ-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      },
      {
        "id": "var-B0D7YTRNXJ-M",
        "product_id": "b1000000-0000-0000-0000-000000000022",
        "sku": "B0D7YTRNXJ-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      },
      {
        "id": "var-B0D7YTRNXJ-L",
        "product_id": "b1000000-0000-0000-0000-000000000022",
        "sku": "B0D7YTRNXJ-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      },
      {
        "id": "var-B0D7YTRNXJ-XL",
        "product_id": "b1000000-0000-0000-0000-000000000022",
        "sku": "B0D7YTRNXJ-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 39900,
        "compare_price_paise": 59900,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000023",
    "name": "Indhrani Clothes Comfortable Playtime Co-ord Set",
    "slug": "indhrani-clothes-comfortable-playtime-co-ord-set-b0gk7m8px2",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "Indhrani",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 46900,
    "compare_price_paise": 70400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/51ZcMc75foL._SL1500_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "indhrani",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "Indhrani Clothes Comfortable Playtime Co-ord Set",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000023",
        "product_id": "b1000000-0000-0000-0000-000000000023",
        "url": "https://m.media-amazon.com/images/I/51ZcMc75foL._SL1500_.jpg",
        "alt_text": "Indhrani Clothes Comfortable Playtime Co-ord Set",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0GK7M8PX2-S",
        "product_id": "b1000000-0000-0000-0000-000000000023",
        "sku": "B0GK7M8PX2-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 46900,
        "compare_price_paise": 70400,
        "is_active": true
      },
      {
        "id": "var-B0GK7M8PX2-M",
        "product_id": "b1000000-0000-0000-0000-000000000023",
        "sku": "B0GK7M8PX2-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 46900,
        "compare_price_paise": 70400,
        "is_active": true
      },
      {
        "id": "var-B0GK7M8PX2-L",
        "product_id": "b1000000-0000-0000-0000-000000000023",
        "sku": "B0GK7M8PX2-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 46900,
        "compare_price_paise": 70400,
        "is_active": true
      },
      {
        "id": "var-B0GK7M8PX2-XL",
        "product_id": "b1000000-0000-0000-0000-000000000023",
        "sku": "B0GK7M8PX2-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 46900,
        "compare_price_paise": 70400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000024",
    "name": "PEELOO Bottom Comfortable Everyday Activity Casual Wear",
    "slug": "peeloo-bottom-comfortable-everyday-activity-casual-wear-b0h62r5hh3",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "PEELOO",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 25900,
    "compare_price_paise": 38900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/41miAks84CL.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "peeloo",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "PEELOO Bottom Comfortable Everyday Activity Casual Wear",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000024",
        "product_id": "b1000000-0000-0000-0000-000000000024",
        "url": "https://m.media-amazon.com/images/I/41miAks84CL.jpg",
        "alt_text": "PEELOO Bottom Comfortable Everyday Activity Casual Wear",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0H62R5HH3-S",
        "product_id": "b1000000-0000-0000-0000-000000000024",
        "sku": "B0H62R5HH3-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 25900,
        "compare_price_paise": 38900,
        "is_active": true
      },
      {
        "id": "var-B0H62R5HH3-M",
        "product_id": "b1000000-0000-0000-0000-000000000024",
        "sku": "B0H62R5HH3-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 25900,
        "compare_price_paise": 38900,
        "is_active": true
      },
      {
        "id": "var-B0H62R5HH3-L",
        "product_id": "b1000000-0000-0000-0000-000000000024",
        "sku": "B0H62R5HH3-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 25900,
        "compare_price_paise": 38900,
        "is_active": true
      },
      {
        "id": "var-B0H62R5HH3-XL",
        "product_id": "b1000000-0000-0000-0000-000000000024",
        "sku": "B0H62R5HH3-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 25900,
        "compare_price_paise": 38900,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000025",
    "name": "Tagas Elegant Ruffles Floral Embroidery Girls Frock",
    "slug": "tagas-elegant-ruffles-floral-embroidery-girls-frock-b0g5k56syy",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "Tagas",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 44900,
    "compare_price_paise": 67400,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/61oVOgecqCL._SL1280_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "tagas",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "Tagas Elegant Ruffles Floral Embroidery Girls Frock",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000025",
        "product_id": "b1000000-0000-0000-0000-000000000025",
        "url": "https://m.media-amazon.com/images/I/61oVOgecqCL._SL1280_.jpg",
        "alt_text": "Tagas Elegant Ruffles Floral Embroidery Girls Frock",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0G5K56SYY-S",
        "product_id": "b1000000-0000-0000-0000-000000000025",
        "sku": "B0G5K56SYY-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0G5K56SYY-M",
        "product_id": "b1000000-0000-0000-0000-000000000025",
        "sku": "B0G5K56SYY-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0G5K56SYY-L",
        "product_id": "b1000000-0000-0000-0000-000000000025",
        "sku": "B0G5K56SYY-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      },
      {
        "id": "var-B0G5K56SYY-XL",
        "product_id": "b1000000-0000-0000-0000-000000000025",
        "sku": "B0G5K56SYY-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 44900,
        "compare_price_paise": 67400,
        "is_active": true
      }
    ]
  },
  {
    "id": "b1000000-0000-0000-0000-000000000026",
    "name": "minicult 100% Cotton Coordinated Sweatshirt Trackpant Mickey",
    "slug": "minicult-100-cotton-coordinated-sweatshirt-trackpant-mickey-b0dgzf1xvt",
    "description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "brand": "minicult",
    "category_id": "c1000000-0000-0000-0000-000000000005",
    "category": {
      "id": "c1000000-0000-0000-0000-000000000005",
      "name": "Kids",
      "slug": "kids",
      "description": "Comfortable, durable & playful clothing for kids",
      "image_url": "https://m.media-amazon.com/images/I/61n2T6K9QUL._SL1500_.jpg",
      "parent_id": null,
      "sort_order": 9,
      "is_active": true,
      "created_at": "2026-10-28T18:00:00.000Z",
      "updated_at": "2026-10-28T18:00:00.000Z"
    },
    "selling_price_paise": 42600,
    "compare_price_paise": 63900,
    "is_active": true,
    "is_featured": true,
    "supports_tryon": true,
    "tryon_garment_image_url": "https://m.media-amazon.com/images/I/613Yxu4bVsL._SL1442_.jpg",
    "material": "100% Breathable Cotton & Premium Blend",
    "care_instructions": "Machine wash cold with like colors. Do not bleach. Tumble dry low.",
    "tags": [
      "kids",
      "minicult",
      "trending",
      "tryon-ready"
    ],
    "meta_title": "minicult 100% Cotton Coordinated Sweatshirt Trackpant Mickey",
    "meta_description": "Premium quality kids featuring comfortable fit, high durability fabric, and modern styling. Verified for AI Virtual Try-On.",
    "created_at": "2026-10-28T18:00:00.000Z",
    "updated_at": "2026-10-28T18:00:00.000Z",
    "images": [
      {
        "id": "img-b1000000-0000-0000-0000-000000000026",
        "product_id": "b1000000-0000-0000-0000-000000000026",
        "url": "https://m.media-amazon.com/images/I/613Yxu4bVsL._SL1442_.jpg",
        "alt_text": "minicult 100% Cotton Coordinated Sweatshirt Trackpant Mickey",
        "sort_order": 0,
        "is_primary": true
      }
    ],
    "variants": [
      {
        "id": "var-B0DGZF1XVT-S",
        "product_id": "b1000000-0000-0000-0000-000000000026",
        "sku": "B0DGZF1XVT-S",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "S",
        "stock_quantity": 50,
        "selling_price_paise": 42600,
        "compare_price_paise": 63900,
        "is_active": true
      },
      {
        "id": "var-B0DGZF1XVT-M",
        "product_id": "b1000000-0000-0000-0000-000000000026",
        "sku": "B0DGZF1XVT-M",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "M",
        "stock_quantity": 50,
        "selling_price_paise": 42600,
        "compare_price_paise": 63900,
        "is_active": true
      },
      {
        "id": "var-B0DGZF1XVT-L",
        "product_id": "b1000000-0000-0000-0000-000000000026",
        "sku": "B0DGZF1XVT-L",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "L",
        "stock_quantity": 50,
        "selling_price_paise": 42600,
        "compare_price_paise": 63900,
        "is_active": true
      },
      {
        "id": "var-B0DGZF1XVT-XL",
        "product_id": "b1000000-0000-0000-0000-000000000026",
        "sku": "B0DGZF1XVT-XL",
        "color": "Original",
        "color_hex": "#1a1a1a",
        "size": "XL",
        "stock_quantity": 50,
        "selling_price_paise": 42600,
        "compare_price_paise": 63900,
        "is_active": true
      }
    ]
  }
]
