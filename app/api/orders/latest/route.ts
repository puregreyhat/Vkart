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

// Fallback in-memory store
let ordersStore: OrderData[] = [];

// Helper function to normalize email
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// GET /api/orders/latest
// Get the most recent order for a specific email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    // Query Supabase if available, otherwise fall back to in-memory store
    let latestOrder: OrderData | null = null;
    if (isSupabaseConfigured()) {
      try {
        const supabaseServer = getSupabaseServer();
        const { data, error } = await supabaseServer
          .from('orders')
          .select('data')
          .ilike('email', normalizedEmail)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Supabase select error:', error);
        } else if (data && data.length > 0) {
          latestOrder = data[0].data as OrderData;
        }
      } catch (error) {
        console.error('Supabase error:', error);
      }
    } else {
      const matchingOrders = ordersStore.filter(
        (order) => normalizeEmail(order.email) === normalizedEmail
      );
      if (matchingOrders.length > 0) {
        latestOrder = matchingOrders
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      }
    }

    return NextResponse.json(
      {
        success: true,
        email: normalizedEmail,
        order: latestOrder,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Latest order error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/orders/latest (to push order data from client)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders } = body;

    if (orders && Array.isArray(orders)) {
      if (isSupabaseConfigured()) {
        try {
          const supabaseServer = getSupabaseServer();
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
            return NextResponse.json({ error: 'Failed to store orders' }, { status: 500, headers: corsHeaders });
          }
        } catch (error) {
          console.error('Supabase error:', error);
        }
      } else {
        orders.forEach((order: OrderData) => {
          const existingIndex = ordersStore.findIndex((o) => o.orderId === order.orderId);
          if (existingIndex >= 0) ordersStore[existingIndex] = order;
          else ordersStore.push(order);
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Orders stored successfully',
          count: orders.length,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json({ error: 'Invalid request - orders array required' }, { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error('POST latest error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers: corsHeaders });
  }
}
