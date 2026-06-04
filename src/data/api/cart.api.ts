import { sdk } from '@/lib/medusa';

// ── localStorage helpers ──────────────────────────────────────────────────────

const CART_ID_KEY = 'raphamel_cart_id';

function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setCartId(id: string): void {
  localStorage.setItem(CART_ID_KEY, id);
}

export function clearCartId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_ID_KEY);
  }
}

// Explicit field list — no `*` or `+` prefix, just paths Medusa v2 understands
const CART_FIELDS =
  'id,items.id,items.title,items.subtitle,items.thumbnail,items.quantity,' +
  'items.unit_price,items.subtotal,items.variant_id,subtotal,total,shipping_total';

// ── Core cart operations ──────────────────────────────────────────────────────

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID;

export async function getOrCreateCart() {
  const cartId = getCartId();

  if (cartId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS });
      return cart;
    } catch {
      clearCartId();
    }
  }

  const { cart } = await sdk.store.cart.create(REGION_ID ? { region_id: REGION_ID } : {});
  setCartId(cart.id);
  return cart;
}

export async function addLineItem(cartId: string, variantId: string, quantity: number) {
  const { cart } = await sdk.store.cart.createLineItem(
    cartId,
    { variant_id: variantId, quantity },
    { fields: CART_FIELDS },
  );
  return cart;
}

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number) {
  const { cart } = await sdk.store.cart.updateLineItem(
    cartId,
    lineItemId,
    { quantity },
    { fields: CART_FIELDS },
  );
  return cart;
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  await sdk.store.cart.deleteLineItem(cartId, lineItemId);
  const { cart } = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS });
  return cart;
}

export interface ShippingAddressInput {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  province: string;
  country_code: string;
  phone?: string;
}

export async function updateCartAddress(
  cartId: string,
  email: string,
  shippingAddress: ShippingAddressInput,
) {
  const { cart } = await sdk.store.cart.update(cartId, {
    email,
    shipping_address: shippingAddress,
    ...(REGION_ID && { region_id: REGION_ID }),
  });
  return cart;
}

export async function listShippingOptions(cartId: string) {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId });
  return shipping_options ?? [];
}

export async function addShippingMethod(cartId: string, optionId: string) {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, { option_id: optionId });
  return cart;
}

export interface PaymentSessionResult {
  accessCode: string | null;
  authorizationUrl: string | null;
}

export async function initializePaymentSession(cartId: string): Promise<PaymentSessionResult> {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: REGION_ID,
  });

  // Prefer a Paystack provider if installed; fall back to system default; then any available
  const providerId =
    payment_providers?.find((p: { id: string }) => p.id.toLowerCase().includes('paystack'))?.id ??
    payment_providers?.find((p: { id: string }) => p.id.includes('system'))?.id ??
    payment_providers?.[0]?.id;

  if (!providerId) {
    throw new Error(
      'No payment provider configured for this region. ' +
      'Add one in Medusa Admin → Settings → Regions → Payment Providers.'
    );
  }

  const { cart } = await sdk.store.cart.retrieve(cartId);
  const result = await sdk.store.payment.initiatePaymentSession(cart, { provider_id: providerId });

  // The Paystack plugin stores access_code + authorization_url in session.data
  const session = result.payment_collection?.payment_sessions?.[0];
  const data = (session?.data ?? {}) as Record<string, unknown>;

  return {
    accessCode: (data.access_code as string) ?? null,
    authorizationUrl: (data.authorization_url as string) ?? null,
  };
}

export async function completeCart(cartId: string) {
  return sdk.store.cart.complete(cartId);
}
