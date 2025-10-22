import { NextResponse } from 'next/server';

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

// GET /api/orders/test
// Returns sample order data to verify the integration structure
export async function GET() {
  const sampleOrder = {
    orderId: 'BLK-1729584000000',
    email: 'test@example.com',
    created_at: '2025-10-22T10:30:00.000Z',
    updated_at: '2025-10-22T10:30:00.000Z',
    orderDate: 'October 22, 2025',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    deliveryAddress: '123 Main Street, Mumbai, Maharashtra 400001',
    products: [
      {
        id: 'prod-1',
        name: 'Fresh Milk',
        price: 60,
        quantity: 2,
        category: 'dairy',
        weight: '1L',
        expiryDate: 'October 28, 2025',
        daysUntilExpiry: 6,
        productType: 'milk',
        image: '/images/milk.jpg',
        productId: 'PROD-1729584001234-ABC123XYZ',
        batchNumber: 'BATCH-2025-XY7890',
        manufactureDate: 'October 15, 2025',
        storageInstructions: 'Refrigerate at 4°C or below',
      },
      {
        id: 'prod-2',
        name: 'Fresh Tomatoes',
        price: 40,
        quantity: 1,
        category: 'vegetables',
        weight: '500g',
        expiryDate: 'October 26, 2025',
        daysUntilExpiry: 4,
        productType: 'daily-veg',
        image: '/images/tomato.jpg',
        productId: 'PROD-1729584001235-DEF456UVW',
        batchNumber: 'BATCH-2025-AB1234',
        manufactureDate: 'October 20, 2025',
        storageInstructions: 'Store in cool, dry place or refrigerator',
      },
      {
        id: 'prod-3',
        name: 'Whole Wheat Bread',
        price: 45,
        quantity: 1,
        category: 'bread',
        weight: '400g',
        expiryDate: 'October 25, 2025',
        daysUntilExpiry: 3,
        productType: 'bread',
        image: '/images/bread.jpg',
        productId: 'PROD-1729584001236-GHI789RST',
        batchNumber: 'BATCH-2025-CD5678',
        manufactureDate: 'October 21, 2025',
        storageInstructions: 'Store in cool, dry place, away from sunlight',
      },
    ],
    subtotal: 185,
    deliveryFee: 20,
    total: 205,
  };

  const response = {
    success: true,
    message: 'This is sample order data for testing NoshNurture integration',
    api_info: {
      version: '1.0',
      endpoints: {
        sync: {
          url: '/api/orders/sync',
          methods: ['GET', 'POST'],
          description: 'Sync orders by email with optional incremental updates',
          parameters: {
            email: 'string (required) - Customer email address',
            updated_since: 'string (optional) - ISO timestamp for incremental sync',
            orders: 'array (optional for POST) - Array of orders to push to server',
          },
        },
        latest: {
          url: '/api/orders/latest',
          methods: ['GET'],
          description: 'Get the most recent order for an email',
          parameters: {
            email: 'string (required) - Customer email address',
          },
        },
        test: {
          url: '/api/orders/test',
          methods: ['GET'],
          description: 'Get sample order data structure',
        },
      },
    },
    sample_order: sampleOrder,
    usage_examples: {
      get_all_orders: 'GET /api/orders/sync?email=test@example.com',
      get_recent_orders: 'GET /api/orders/sync?email=test@example.com&updated_since=2025-10-20T00:00:00.000Z',
      get_latest_order: 'GET /api/orders/latest?email=test@example.com',
      push_orders: 'POST /api/orders/sync with body: { "email": "test@example.com", "orders": [...] }',
    },
    notes: {
      storage: 'VKart uses localStorage on client-side. Orders are also stored in-memory on the server for API access.',
      email_matching: 'Email addresses are normalized (lowercase, trimmed) for consistent matching.',
      cors: 'CORS is enabled for cross-origin requests from NoshNurture.',
      authentication: 'No authentication required for MVP. Consider adding API keys for production.',
    },
  };

  return NextResponse.json(response, { status: 200, headers: corsHeaders });
}
