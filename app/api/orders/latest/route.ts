import { NextRequest, NextResponse } from 'next/server';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

// Import the shared orders store from sync endpoint
// Note: In production, this should be a proper database
// For now, we'll create a separate instance and rely on the client pushing data
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

    // Filter orders by email
    const matchingOrders = ordersStore.filter(
      order => normalizeEmail(order.email) === normalizedEmail
    );

    if (matchingOrders.length === 0) {
      return NextResponse.json(
        {
          success: true,
          email: normalizedEmail,
          order: null,
          message: 'No orders found for this email',
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // Sort by created_at descending and get the first one (most recent)
    const latestOrder = matchingOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

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

    // Allow client to push orders to server
    if (orders && Array.isArray(orders)) {
      orders.forEach((order: OrderData) => {
        const existingIndex = ordersStore.findIndex(o => o.orderId === order.orderId);
        if (existingIndex >= 0) {
          ordersStore[existingIndex] = order;
        } else {
          ordersStore.push(order);
        }
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Orders stored successfully',
          count: orders.length,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Invalid request - orders array required' },
      { status: 400, headers: corsHeaders }
    );
  } catch (error) {
    console.error('POST latest error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400, headers: corsHeaders }
    );
  }
}
