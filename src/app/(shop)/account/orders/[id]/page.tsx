'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { sdk } from '@/lib/medusa';
import { formatPrice, formatDate } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  title: string;
  subtitle?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  thumbnail?: string;
}

interface ShippingAddress {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  city?: string;
  province?: string;
  country_code?: string;
  phone?: string;
}

interface OrderDetail {
  id: string;
  display_id?: number;
  status: string;
  payment_status?: string;
  fulfillment_status?: string;
  created_at: string;
  total: number;
  subtotal: number;
  shipping_total: number;
  currency_code?: string;
  email?: string;
  items?: OrderItem[];
  shipping_address?: ShippingAddress;
}

async function fetchOrder(id: string): Promise<OrderDetail> {
  const result = await sdk.store.order.retrieve(id, {
    fields:
      '+items,+items.thumbnail,+items.unit_price,+items.subtotal,' +
      '+total,+subtotal,+shipping_total,+display_id,+status,' +
      '+payment_status,+fulfillment_status,+email,+shipping_address',
  } as Parameters<typeof sdk.store.order.retrieve>[1]);
  return result.order as OrderDetail;
}

// ── Status helpers ─────────────────────────────────────────────────────────────

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

function getStatusBadge(order: OrderDetail) {
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

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-100 rounded w-1/3" />
      <div className="bg-white rounded-[12px] border border-gray-200 p-5 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-[12px]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['account', 'orders', id],
    queryFn: () => fetchOrder(id),
    enabled: !!id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm px-6 py-4">
          <div className="h-5 bg-gray-100 rounded w-1/4 animate-pulse" />
        </div>
        <Skeleton />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-10 text-center">
        <p className="text-gray-500 mb-4">Could not load this order.</p>
        <Button variant="outline" onClick={() => router.push('/account/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const { label, variant } = getStatusBadge(order);
  const shortId = order.display_id ? `#${order.display_id}` : `#${order.id.slice(-8).toUpperCase()}`;
  const addr = order.shipping_address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/account/orders')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Back to orders"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold text-gray-900">Order {shortId}</h1>
            <Badge variant={variant}>{label}</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Placed {formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Items</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-14 h-14 rounded-[12px] border border-gray-100 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Package size={18} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-semibold text-gray-900 shrink-0">
                {formatPrice(item.subtotal ?? item.unit_price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.shipping_total > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_total)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-100">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      {addr && (
        <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Shipping Address</h2>
          </div>
          <p className="text-sm text-gray-700">
            {[addr.first_name, addr.last_name].filter(Boolean).join(' ')}
          </p>
          {addr.address_1 && <p className="text-sm text-gray-500">{addr.address_1}</p>}
          {(addr.city || addr.province) && (
            <p className="text-sm text-gray-500">
              {[addr.city, addr.province].filter(Boolean).join(', ')}
            </p>
          )}
          {addr.phone && <p className="text-sm text-gray-500">{addr.phone}</p>}
        </div>
      )}

      {/* Payment */}
      <div className="bg-white rounded-[12px] border border-gray-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Payment</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className="text-sm font-medium text-gray-800 capitalize">
            {order.payment_status?.replace(/_/g, ' ') ?? 'N/A'}
          </span>
        </div>
        {order.email && (
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm text-gray-800">{order.email}</span>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="h-4 w-4" /> All Orders
          </Link>
        </Button>
        <p className="text-xs text-gray-400">
          Need help?{' '}
          <a href="mailto:support@raphamel.com" className="text-primary hover:underline">
            support@raphamel.com
          </a>
        </p>
      </div>
    </motion.div>
  );
}
