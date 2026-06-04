/**
 * Shared test fixtures — match the shapes returned by Medusa API.
 * Used across unit, integration, and E2E tests.
 */

// ── Auth ──────────────────────────────────────────────────────────────────────

export const CUSTOMER = {
  id: 'cus_test_01',
  email: 'ade@hospital.ng',
  first_name: 'Ade',
  last_name: 'Okafor',
  phone: '+2348012345678',
  metadata: {
    verification_status: 'approved',
    facility_type: 'hospital',
    cac_doc_url: null,
    licence_doc_url: null,
    rejection_notes: null,
  },
};

export const AUTH_USER = {
  id: 'cus_test_01',
  email: 'ade@hospital.ng',
  firstName: 'Ade',
  lastName: 'Okafor',
  phone: '+2348012345678',
  verificationStatus: 'approved' as const,
  rejectionNotes: undefined,
};

export const PENDING_CUSTOMER = {
  ...CUSTOMER,
  metadata: { ...CUSTOMER.metadata, verification_status: 'pending' },
};

// ── Region ────────────────────────────────────────────────────────────────────

export const REGION = {
  id: 'reg_test_01',
  name: 'Nigeria',
  currency_code: 'ngn',
};

// ── Product ───────────────────────────────────────────────────────────────────

export const MEDUSA_PRODUCT = {
  id: 'prod_test_01',
  title: 'Nitrile Examination Gloves',
  handle: 'nitrile-examination-gloves',
  description: 'High-quality nitrile gloves for clinical use',
  status: 'published',
  thumbnail: 'https://example.com/gloves.jpg',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  categories: [
    { id: 'cat_test_01', name: 'Hospital Consumables', handle: 'hospital-consumables' },
  ],
  variants: [
    {
      id: 'var_test_01',
      title: 'Box of 100',
      sku: 'GLV-NIR-100',
      inventory_quantity: 50,
      calculated_price: {
        calculated_amount: 4500,
        original_amount: 5000,
      },
    },
  ],
  images: [{ id: 'img_01', url: 'https://example.com/gloves.jpg' }],
};

export const PRODUCT_ENTITY = {
  id: 'prod_test_01',
  name: 'Nitrile Examination Gloves',
  slug: 'nitrile-examination-gloves',
  description: 'High-quality nitrile gloves for clinical use',
  price: 4500,
  compareAtPrice: 5000,
  stock: 50,
  stockUnit: 'unit' as const,
  minimumOrderQuantity: 1,
  images: ['https://example.com/gloves.jpg'],
  isActive: true,
  isFeatured: false,
  vendorId: '',
  vendorName: '',
  categoryId: 'cat_test_01',
  categoryName: 'Hospital Consumables',
  categorySlug: 'hospital-consumables',
  condition: 'new' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  variants: [{ id: 'var_test_01', name: 'Box of 100', stock: 50, price: 4500 }],
};

// ── Category ──────────────────────────────────────────────────────────────────

export const MEDUSA_CATEGORY = {
  id: 'cat_test_01',
  name: 'Hospital Consumables',
  handle: 'hospital-consumables',
  description: 'Everyday clinical supplies',
  products_count: 24,
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const CART_LINE_ITEM = {
  id: 'item_test_01',
  title: 'Nitrile Examination Gloves',
  quantity: 2,
  unit_price: 4500,
  subtotal: 9000,
  thumbnail: 'https://example.com/gloves.jpg',
  variant: {
    id: 'var_test_01',
    product: { handle: 'nitrile-examination-gloves' },
  },
};

export const CART = {
  id: 'cart_test_01',
  email: null,
  items: [CART_LINE_ITEM],
  subtotal: 9000,
  shipping_total: 0,
  total: 9000,
  shipping_methods: [],
  shipping_address: null,
};

export const EMPTY_CART = {
  id: 'cart_test_empty',
  email: null,
  items: [],
  subtotal: 0,
  shipping_total: 0,
  total: 0,
  shipping_methods: [],
  shipping_address: null,
};

export const SHIPPING_OPTIONS = [
  { id: 'so_test_01', name: 'Standard Delivery (3–5 days)', amount: 1500 },
  { id: 'so_test_02', name: 'Express Delivery (1–2 days)', amount: 3500 },
];

// ── Order ─────────────────────────────────────────────────────────────────────

export const ORDER = {
  id: 'order_test_01',
  display_id: 1001,
  status: 'pending',
  total: 9000,
  created_at: '2024-01-15T10:00:00Z',
  items: [CART_LINE_ITEM],
  shipping_address: {
    first_name: 'Ade',
    last_name: 'Okafor',
    address_1: '12 Hospital Road',
    city: 'Lagos',
    province: 'Lagos',
    country_code: 'ng',
  },
};

// ── Address ───────────────────────────────────────────────────────────────────

export const ADDRESS = {
  id: 'addr_test_01',
  first_name: 'Ade',
  last_name: 'Okafor',
  address_1: '12 Hospital Road',
  address_2: null,
  city: 'Lagos',
  province: 'Lagos',
  country_code: 'ng',
  phone: '+2348012345678',
  is_default_shipping: true,
  is_default_billing: false,
};

export const ADDRESS_2 = {
  id: 'addr_test_02',
  first_name: 'Ade',
  last_name: 'Okafor',
  address_1: '5 Marina Street',
  address_2: 'Floor 3',
  city: 'Abuja',
  province: 'FCT',
  country_code: 'ng',
  phone: null,
  is_default_shipping: false,
  is_default_billing: true,
};
