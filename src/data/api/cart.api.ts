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
  'items.unit_price,items.subtotal,items.variant_id,subtotal,tax_total,total,shipping_total';

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

type RawPaymentSession = {
  id: string;
  provider_id: string;
  status: string;
  data: Record<string, unknown>;
};

export async function initializePaymentSession(cartId: string): Promise<PaymentSessionResult> {
  // Fetch cart with payment collection so we can detect existing sessions.
  // email is also required — medusa-payment-paystack needs it to create a Paystack transaction.
  const [{ payment_providers }, { cart }] = await Promise.all([
    sdk.store.payment.listPaymentProviders({ region_id: REGION_ID! }),
    sdk.store.cart.retrieve(cartId, {
      fields:
        'id,email,' +
        'payment_collection.id,' +
        'payment_collection.payment_sessions.id,' +
        'payment_collection.payment_sessions.provider_id,' +
        'payment_collection.payment_sessions.status,' +
        'payment_collection.payment_sessions.data',
    }),
  ]);

  const typedCart = cart as unknown as {
    email?: string;
    payment_collection?: { id: string; payment_sessions?: RawPaymentSession[] };
  };

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

  // If a session for this provider already exists with an access code, reuse it.
  // This avoids Medusa's "Could not delete all payment sessions" error that occurs
  // when the workflow tries to clean up a stale session before creating a fresh one.
  const existingSession = typedCart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id === providerId && s.data?.paystackTxAccessCode,
  );

  if (existingSession) {
    const data = existingSession.data;
    console.log('[payment] reusing existing Paystack session:', existingSession.id);
    return {
      accessCode: (data.paystackTxAccessCode as string) ?? null,
      authorizationUrl: (data.paystackTxAuthorizationUrl as string) ?? null,
    };
  }

  const cartEmail = typedCart.email;
  if (!cartEmail) {
    throw new Error('Could not find an email address for this cart. Please re-enter your contact details.');
  }

  const result = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
    data: { email: cartEmail },
  });

  console.log('[payment] initiatePaymentSession raw result:', JSON.stringify(result, null, 2));

  // medusa-payment-paystack (a11rew v2.x) stores the transaction data under these keys:
  //   paystackTxAccessCode        — use with @paystack/inline-js resumeTransaction
  //   paystackTxAuthorizationUrl  — use to redirect to Paystack hosted page
  const session = result.payment_collection?.payment_sessions?.[0];
  const data = (session?.data ?? {}) as Record<string, unknown>;

  console.log('[payment] session.data keys:', Object.keys(data));

  const accessCode = (data.paystackTxAccessCode as string) ?? null;
  const authorizationUrl = (data.paystackTxAuthorizationUrl as string) ?? null;

  console.log('[payment] resolved accessCode:', accessCode);
  console.log('[payment] resolved authorizationUrl:', authorizationUrl);

  return { accessCode, authorizationUrl };
}

export async function getCartPaymentSessionStatus(cartId: string): Promise<string | null> {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields: 'id,payment_collection.payment_sessions.status',
  });
  const sessions = (cart as unknown as { payment_collection?: { payment_sessions?: { status: string }[] } })
    .payment_collection?.payment_sessions;
  return sessions?.[0]?.status ?? null;
}

export async function completeCart(cartId: string) {
  return sdk.store.cart.complete(cartId);
}
