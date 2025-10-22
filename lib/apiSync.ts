// API sync utilities for VKart orders
// This file helps sync localStorage orders to the server API

import type { OrderData } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Push a single order to the API server
 */
export async function pushOrderToAPI(order: OrderData): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: order.email,
        orders: [order],
      }),
    });

    if (!response.ok) {
      console.error('Failed to push order to API:', response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('Order pushed to API successfully:', data);
    return true;
  } catch (error) {
    console.error('Error pushing order to API:', error);
    return false;
  }
}

/**
 * Push multiple orders to the API server
 */
export async function pushOrdersToAPI(orders: OrderData[]): Promise<boolean> {
  try {
    if (orders.length === 0) return true;

    // Group orders by email
    const ordersByEmail = orders.reduce((acc, order) => {
      if (!acc[order.email]) {
        acc[order.email] = [];
      }
      acc[order.email].push(order);
      return acc;
    }, {} as Record<string, OrderData[]>);

    // Push each email's orders
    const promises = Object.entries(ordersByEmail).map(([email, emailOrders]) =>
      fetch(`${API_BASE_URL}/api/orders/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          orders: emailOrders,
        }),
      })
    );

    const results = await Promise.all(promises);
    const allSuccessful = results.every(r => r.ok);

    if (!allSuccessful) {
      console.error('Some orders failed to sync');
      return false;
    }

    console.log(`Successfully pushed ${orders.length} orders to API`);
    return true;
  } catch (error) {
    console.error('Error pushing orders to API:', error);
    return false;
  }
}

/**
 * Fetch orders from API for a specific email
 */
export async function fetchOrdersFromAPI(
  email: string,
  updatedSince?: string
): Promise<OrderData[]> {
  try {
    const params = new URLSearchParams({ email });
    if (updatedSince) {
      params.append('updated_since', updatedSince);
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/sync?${params.toString()}`);

    if (!response.ok) {
      console.error('Failed to fetch orders from API:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching orders from API:', error);
    return [];
  }
}

/**
 * Fetch the latest order from API for a specific email
 */
export async function fetchLatestOrderFromAPI(email: string): Promise<OrderData | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orders/latest?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      console.error('Failed to fetch latest order from API:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data.order || null;
  } catch (error) {
    console.error('Error fetching latest order from API:', error);
    return null;
  }
}

/**
 * Sync all localStorage orders to the API server
 * Call this when the app loads or periodically
 */
export async function syncAllOrdersToAPI(): Promise<void> {
  try {
    // Access localStorage
    const ordersData = localStorage.getItem('vkart_all_orders');
    if (!ordersData) return;

    const parsed = JSON.parse(ordersData);
    const orders = parsed?.state?.orders || [];

    if (orders.length > 0) {
      await pushOrdersToAPI(orders);
    }
  } catch (error) {
    console.error('Error syncing all orders to API:', error);
  }
}
