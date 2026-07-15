import { sdk } from '@/lib/medusa';

// ── localStorage helpers ──────────────────────────────────────────────────────

const WISHLIST_ID_KEY = 'raphamel_wishlist_id';

function getWishlistId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(WISHLIST_ID_KEY);
}

function setWishlistId(id: string): void {
  localStorage.setItem(WISHLIST_ID_KEY, id);
}

export function clearWishlistId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(WISHLIST_ID_KEY);
  }
}

// ── Sales channel ID helper (cached) ─────────────────────────────────────────

let _cachedSalesChannelId: string | null = null;

async function getSalesChannelId(): Promise<string> {
  if (_cachedSalesChannelId) return _cachedSalesChannelId;

  const envId = process.env.NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID;
  if (envId) {
    _cachedSalesChannelId = envId;
    return envId;
  }

  // Fall back to fetching the first active sales channel via the store API
  try {
    const result = await sdk.client.fetch<{ sales_channels: { id: string }[] }>(
      '/store/sales-channels',
      { method: 'GET' },
    );
    const id = result?.sales_channels?.[0]?.id;
    if (id) {
      _cachedSalesChannelId = id;
      return id;
    }
  } catch {
    // /store/sales-channels may not exist — try regions next
  }

  // Last resort: derive from region (Medusa regions carry sales_channel_id)
  try {
    const { regions } = await sdk.store.region.list();
    const channelId = (regions?.[0] as unknown as { sales_channel_id?: string })?.sales_channel_id;
    if (channelId) {
      _cachedSalesChannelId = channelId;
      return channelId;
    }
  } catch {}

  throw new Error(
    'Could not determine sales channel ID. ' +
    'Add NEXT_PUBLIC_MEDUSA_SALES_CHANNEL_ID to your .env.local.',
  );
}

// ── Wishlist entity types ─────────────────────────────────────────────────────

export interface WishlistProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
}

export interface WishlistVariant {
  id: string;
  title: string;
  prices?: { amount: number; currency_code: string }[];
  product: WishlistProduct;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_variant_id: string;
  product_variant: WishlistVariant | null;
  created_at: string;
}

export interface WishlistData {
  id: string;
  customer_id: string | null;
  items: WishlistItem[];
  items_count: number;
  name: string | null;
}

// Extra fields to request so we can link back to products on the wishlist page.
// NOTE: do not include calculated_price.* here — it requires a QueryContext
// (region_id + currency_code) and the plugin doesn't supply one, causing a
// 500 that clears the stored wishlist ID and wipes items on every refresh.
const EXTRA_ITEM_FIELDS = [
  'product_variant.product.title',
  'product_variant.prices.amount',
  'product_variant.prices.currency_code',
].map((f) => `items_fields[]=${encodeURIComponent(f)}`).join('&');

// ── Core wishlist operations ──────────────────────────────────────────────────

export async function getOrCreateWishlist(): Promise<WishlistData> {
  const wishlistId = getWishlistId();

  if (wishlistId) {
    try {
      const data = await sdk.client.fetch<WishlistData>(
        `/store/wishlists/${wishlistId}?${EXTRA_ITEM_FIELDS}`,
        { method: 'GET' },
      );
      if (data?.id) return data;
    } catch {
      // Wishlist no longer exists on the server — clear stale ID
      clearWishlistId();
    }
  }

  const salesChannelId = await getSalesChannelId();
  const data = await sdk.client.fetch<WishlistData>('/store/wishlists', {
    method: 'POST',
    body: { sales_channel_id: salesChannelId },
  });
  setWishlistId(data.id);
  return { ...data, items: [], items_count: 0 };
}

export async function addItemToWishlist(
  wishlistId: string,
  productVariantId: string,
): Promise<WishlistItem> {
  return sdk.client.fetch<WishlistItem>(
    `/store/wishlists/${wishlistId}/add-item`,
    { method: 'POST', body: { product_variant_id: productVariantId } },
  );
}

export async function removeItemFromWishlist(
  wishlistId: string,
  itemId: string,
): Promise<void> {
  await sdk.client.fetch(
    `/store/wishlists/${wishlistId}/items/${itemId}`,
    { method: 'DELETE' },
  );
}
