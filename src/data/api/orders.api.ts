/**
 * FLUTTER EQUIV: lib/data/datasources/order_remote_datasource.dart
 */

import api from '@/lib/api';
import type { Order, PaginatedResponse } from '@/types/index';

export interface CreateOrderPayload {
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  notes?: string;
  couponCode?: string;
}

/** Place a new order from the current cart. */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
}

/** Fetch the authenticated user's order history. */
export async function fetchMyOrders(
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<Order>> {
  const { data } = await api.get<PaginatedResponse<Order>>('/orders/my', {
    params: { page, limit },
  });
  return data;
}

/** Fetch a single order by ID. */
export async function fetchOrderById(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}
