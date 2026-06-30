import type { Page } from '@playwright/test';

const BASE = 'http://medusa-test.local';

// Shared fixtures for all E2E tests
export const FX = {
  customer: {
    id: 'cus_e2e_01',
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
  },
  pendingCustomer: {
    id: 'cus_e2e_02',
    email: 'pending@hospital.ng',
    first_name: 'Pending',
    last_name: 'User',
    phone: null,
    metadata: { verification_status: 'pending' },
  },
  region: { id: 'reg_e2e_01', name: 'Nigeria', currency_code: 'ngn' },
  product: {
    id: 'prod_e2e_01',
    title: 'Nitrile Examination Gloves',
    handle: 'nitrile-examination-gloves',
    description: 'Premium nitrile gloves',
    status: 'published',
    thumbnail: '/images/product-placeholder.png',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    categories: [
      { id: 'cat_e2e_01', name: 'Hospital Consumables', handle: 'hospital-consumables' },
    ],
    variants: [
      {
        id: 'var_e2e_01',
        title: 'Box of 100',
        sku: 'GLV-NIR-100',
        inventory_quantity: 50,
        calculated_price: { calculated_amount: 4500, original_amount: 5000 },
      },
    ],
    images: [{ id: 'img_01', url: '/images/product-placeholder.png' }],
  },
  category: {
    id: 'cat_e2e_01',
    name: 'Hospital Consumables',
    handle: 'hospital-consumables',
    description: 'Everyday clinical supplies',
    products_count: 12,
  },
  cart: {
    id: 'cart_e2e_01',
    email: 'ade@hospital.ng',
    items: [
      {
        id: 'item_e2e_01',
        title: 'Nitrile Examination Gloves',
        quantity: 2,
        unit_price: 4500,
        subtotal: 9000,
        thumbnail: '/images/product-placeholder.png',
        variant: {
          id: 'var_e2e_01',
          product: { handle: 'nitrile-examination-gloves' },
        },
      },
    ],
    subtotal: 9000,
    shipping_total: 1500,
    total: 10500,
    shipping_methods: [],
    shipping_address: null,
  },
  emptyCart: {
    id: 'cart_e2e_empty',
    email: null,
    items: [],
    subtotal: 0,
    shipping_total: 0,
    total: 0,
    shipping_methods: [],
    shipping_address: null,
  },
  shippingOptions: [
    { id: 'so_e2e_01', name: 'Standard Delivery (3–5 days)', amount: 1500 },
    { id: 'so_e2e_02', name: 'Express Delivery (1–2 days)', amount: 3500 },
  ],
  order: {
    id: 'order_e2e_01',
    display_id: 1001,
    status: 'pending',
    total: 10500,
    created_at: '2024-01-15T10:00:00Z',
    items: [],
    shipping_address: {
      first_name: 'Ade',
      last_name: 'Okafor',
      address_1: '12 Hospital Road',
      city: 'Lagos',
      province: 'Lagos',
      country_code: 'ng',
    },
  },
  address: {
    id: 'addr_e2e_01',
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
  },
};

/** Route all common Medusa API calls with sensible defaults. */
export async function mockMedusaRoutes(page: Page, overrides: {
  customer?: object | null;
  products?: object[];
  cart?: object;
} = {}) {
  const customer = 'customer' in overrides ? overrides.customer : FX.customer;
  const products  = overrides.products ?? [FX.product];
  const cart      = overrides.cart ?? FX.emptyCart;

  // Auth
  await page.route(`${BASE}/auth/customer/emailpass`, async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({ status: 200, json: { token: 'e2e_jwt_token' } });
    } else {
      route.continue();
    }
  });

  await page.route(`${BASE}/auth/customer/emailpass/register`, (route) =>
    route.fulfill({ status: 200, json: { token: 'e2e_jwt_token' } }),
  );

  await page.route(`${BASE}/auth/session`, (route) =>
    route.fulfill({ status: 200, json: {} }),
  );

  await page.route(`${BASE}/auth/customer/emailpass/reset-password`, (route) =>
    route.fulfill({ status: 200, json: {} }),
  );

  await page.route(`${BASE}/auth/customer/emailpass/update**`, (route) =>
    route.fulfill({ status: 200, json: {} }),
  );

  await page.route(`${BASE}/store/auth/send-otp`, (route) =>
    route.fulfill({ status: 200, json: {} }),
  );

  await page.route(`${BASE}/store/auth/verify-otp`, (route) =>
    route.fulfill({ status: 200, json: { verified: true } }),
  );

  // Customer
  await page.route(`${BASE}/store/customers/me**`, async (route) => {
    if (customer === null) {
      route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
    } else {
      route.fulfill({ status: 200, json: { customer } });
    }
  });

  await page.route(`${BASE}/store/customers`, (route) =>
    route.fulfill({ status: 201, json: { customer: FX.customer } }),
  );

  // Regions
  await page.route(`${BASE}/store/regions**`, (route) =>
    route.fulfill({ json: { regions: [FX.region], count: 1 } }),
  );

  // Products
  await page.route(`${BASE}/store/products**`, (route) =>
    route.fulfill({ json: { products, count: products.length } }),
  );

  // Categories
  await page.route(`${BASE}/store/product-categories**`, (route) =>
    route.fulfill({ json: { product_categories: [FX.category], count: 1 } }),
  );

  // Cart
  await page.route(`${BASE}/store/carts`, async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      route.fulfill({ json: { cart: { id: 'cart_e2e_new', items: [], subtotal: 0, total: 0 } } });
    } else {
      route.continue();
    }
  });

  await page.route(`${BASE}/store/carts/**`, async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes('/line-items') && method === 'POST') {
      route.fulfill({ json: { cart } });
    } else if (url.includes('/line-items') && method === 'DELETE') {
      route.fulfill({ json: { cart: FX.emptyCart } });
    } else if (url.includes('/shipping-methods')) {
      route.fulfill({ json: { cart } });
    } else if (url.includes('/complete')) {
      route.fulfill({ json: { type: 'order', order: FX.order } });
    } else if (method === 'GET') {
      route.fulfill({ json: { cart } });
    } else if (method === 'POST') {
      route.fulfill({ json: { cart } });
    } else {
      route.continue();
    }
  });

  // Shipping options
  await page.route(`${BASE}/store/shipping-options**`, (route) =>
    route.fulfill({ json: { shipping_options: FX.shippingOptions } }),
  );

  // Orders
  await page.route(`${BASE}/store/orders**`, (route) =>
    route.fulfill({ json: { orders: [FX.order], count: 1 } }),
  );

  // Addresses
  await page.route(`${BASE}/store/customers/me/addresses**`, async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      route.fulfill({ json: { addresses: [FX.address], count: 1 } });
    } else if (method === 'POST') {
      route.fulfill({ json: { address: FX.address } });
    } else if (method === 'DELETE') {
      route.fulfill({ json: { id: 'addr_e2e_01', deleted: true } });
    } else {
      route.continue();
    }
  });

  // CORS preflight handler — registered last so Playwright checks it first (LIFO).
  // The Medusa SDK sends x-publishable-api-key on every store request, which
  // triggers a browser CORS OPTIONS preflight to http://medusa-test.local.
  // Without this, the preflight returns no CORS headers, the actual fetch is
  // blocked, and the product query permanently errors (retry: false).
  await page.route(`${BASE}/**`, (route) => {
    if (route.request().method() === 'OPTIONS') {
      route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-publishable-api-key',
          'Access-Control-Max-Age': '86400',
        },
      });
    } else {
      // Not an OPTIONS preflight — pass to the more-specific handlers above.
      route.fallback();
    }
  });
}

/** Set the auth cookie so the test user appears logged in. */
export async function setAuthCookie(page: Page) {
  await page.context().addCookies([
    {
      name: 'raphamel_auth',
      value: '1',
      domain: 'localhost',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    },
  ]);
}

/** Plant a cart ID in localStorage so tests can skip cart creation. */
export async function setCartInStorage(page: Page, cartId = 'cart_e2e_01') {
  await page.evaluate(
    ([key, id]) => localStorage.setItem(key, id),
    ['raphamel_cart_id', cartId],
  );
}
