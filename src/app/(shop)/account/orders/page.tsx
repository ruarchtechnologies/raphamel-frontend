'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sdk } from '@/lib/medusa';
import { formatPrice, formatDate } from '@/lib/utils';

// ── Data fetching ─────────────────────────────────────────────────────────────

interface MedusaOrder {
  id: string;
  display_id?: number;
  status: string;
  payment_status?: string;
  fulfillment_status?: string;
  created_at: string;
  total: number;
  currency_code?: string;
  items?: { id: string; title: string; quantity: number; thumbnail?: string }[];
}

async function fetchOrders(): Promise<MedusaOrder[]> {
  const result = await sdk.store.order.list({
    fields: '+items,+items.thumbnail,+total,+display_id,+status,+payment_status,+fulfillment_status',
  } as Parameters<typeof sdk.store.order.list>[0]);
  return (result.orders ?? []) as MedusaOrder[];
}

// ── Status badge config ───────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; variant: 'yellow' | 'primary' | 'green' | 'red' }> = {
  delivered:           { label: 'Delivered',   variant: 'green'   },
  shipped:             { label: 'Shipped',      variant: 'primary' },
  fulfilled:           { label: 'Fulfilled',    variant: 'primary' },
  partially_fulfilled: { label: 'Preparing',    variant: 'primary' },
  completed:           { label: 'Completed',    variant: 'green'   },
  processing:          { label: 'Processing',   variant: 'primary' },
  pending:             { label: 'Pending',      variant: 'yellow'  },
  cancelled:           { label: 'Cancelled',    variant: 'red'     },
  canceled:            { label: 'Cancelled',    variant: 'red'     },
};

function getStatusBadge(order: MedusaOrder) {
  // Fulfillment status takes priority once payment is captured
  if (order.status === 'cancelled' || order.status === 'canceled') {
    return STATUS_BADGE['cancelled'];
  }
  const key =
    order.fulfillment_status && order.fulfillment_status !== 'not_fulfilled'
      ? order.fulfillment_status
      : order.status;
  return STATUS_BADGE[key] ?? { label: key, variant: 'yellow' as const };
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-[6px] border border-gray-200 p-5 animate-pulse flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-[6px] bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
          <div className="h-6 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['account', 'orders'],
    queryFn: fetchOrders,
    retry: 1,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm px-6 py-4">
          <h1 className="text-base font-semibold text-gray-900">My Orders</h1>
        </div>
        <OrderSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-10 text-center">
        <p className="text-gray-500 mb-4">Could not load your orders. Please try again.</p>
        <Button variant="outline" onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header card */}
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">My Orders</h1>
        {orders && orders.length > 0 && (
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        )}
      </div>

      {/* Empty state */}
      {(!orders || orders.length === 0) && (
        <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-gray-300" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">No orders yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            When you place an order, it will appear here.
          </p>
          <Button variant="primary" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      )}

      {/* Order list */}
      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const { label, variant } = getStatusBadge(order);
            const firstItem = order.items?.[0];
            const extraCount = (order.items?.length ?? 1) - 1;
            const shortId = order.display_id
              ? `#${order.display_id}`
              : `#${order.id.slice(-8).toUpperCase()}`;

            return (
              <div
                key={order.id}
                className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Item thumbnail */}
                <div className="w-12 h-12 rounded-[6px] bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {firstItem?.thumbnail ? (
                    <img
                      src={firstItem.thumbnail}
                      alt={firstItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={20} className="text-gray-300" />
                  )}
                </div>

                {/* Order details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">{shortId}</span>
                    <Badge variant={variant}>{label}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.created_at)}
                    {firstItem && (
                      <>
                        {' · '}
                        {firstItem.title}
                        {extraCount > 0 && ` +${extraCount} more`}
                      </>
                    )}
                  </p>
                </div>

                {/* Total + link */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                  >
                    View <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
