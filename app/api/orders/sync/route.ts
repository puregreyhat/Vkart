import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, getSupabaseServer } from '@/lib/supabaseServer';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Interface for order data (matching lib/store.ts)
interface OrderData {
  orderId: string;
  email: string;
  created_at: string;
  updated_at: string;
  orderDate: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  products: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// In-memory storage (will be replaced with database in production)
// This is a temporary solution - in production, use a proper database
let ordersStore: OrderData[] = [];

// Helper function to normalize email
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// POST /api/orders/sync
// Receive and store orders, then return matching orders for email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, updated_since, orders } = body;

    // If orders are provided, store them (for VKart to push orders)
    if (orders && Array.isArray(orders)) {
      // If Supabase is configured, upsert orders there; otherwise update in-memory store
      if (isSupabaseConfigured()) {
        try {
          const supabaseServer = getSupabaseServer();
          // Upsert each order into 'orders' table
          const upserts = orders.map((order: OrderData) => ({
            order_id: order.orderId,
            email: order.email,
            created_at: order.created_at,
            updated_at: order.updated_at,
            order_date: order.orderDate,
            delivery_address: order.deliveryAddress,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            data: order,
          }));

          const { error } = await supabaseServer.from('orders').upsert(upserts, { onConflict: 'order_id' });
          if (error) {
            console.error('Supabase upsert error:', error);
          }
        } catch (error) {
          console.error('Supabase error:', error);
        }
      } else {
        // Add/update orders in memory
        orders.forEach((order: OrderData) => {
          const existingIndex = ordersStore.findIndex(o => o.orderId === order.orderId);
          if (existingIndex >= 0) {
            ordersStore[existingIndex] = order;
          } else {
            ordersStore.push(order);
          }
        });
      }
    }

    // Validate email for retrieval
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string' },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Filter orders by email - prefer Supabase if available
    let matchingOrders: OrderData[] = [];
    if (isSupabaseConfigured()) {
      try {
        const supabaseServer = getSupabaseServer();
        const { data, error } = await supabaseServer
          .from('orders')
          .select('data')
          .ilike('email', normalizedEmail)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase select error:', error);
        } else if (data) {
          matchingOrders = data.map((r: any) => r.data as OrderData);
        }
      } catch (error) {
        console.error('Supabase error:', error);
      }
    } else {
      matchingOrders = ordersStore.filter(
        order => normalizeEmail(order.email) === normalizedEmail
      );
    }

    // Apply updated_since filter if provided
    if (updated_since) {
      const sinceDate = new Date(updated_since);
      matchingOrders = matchingOrders.filter(
        order => new Date(order.updated_at) > sinceDate
      );
    }

    // Sort by created_at descending (most recent first)
    matchingOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(
      {
        success: true,
        email: normalizedEmail,
        count: matchingOrders.length,
        orders: matchingOrders,
        synced_at: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Invalid request body or server error' },
      { status: 400, headers: corsHeaders }
    );
  }
}

// GET /api/orders/sync (alternative method for simple retrieval)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const updated_since = searchParams.get('updated_since');

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Filter orders by email
    let matchingOrders = ordersStore.filter(
      order => normalizeEmail(order.email) === normalizedEmail
    );

    // Apply updated_since filter if provided
    if (updated_since) {
      const sinceDate = new Date(updated_since);
      matchingOrders = matchingOrders.filter(
        order => new Date(order.updated_at) > sinceDate
      );
    }

    // Sort by created_at descending (most recent first)
    matchingOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json(
      {
        success: true,
        email: normalizedEmail,
        count: matchingOrders.length,
        orders: matchingOrders,
        synced_at: new Date().toISOString(),
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('GET sync error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
