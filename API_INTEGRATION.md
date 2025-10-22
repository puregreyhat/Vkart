# VKart API Integration for NoshNurture

This document describes the API integration layer that enables NoshNurture to fetch order data from VKart using email-based matching.

## Overview

VKart now includes REST API endpoints that allow external applications (like NoshNurture) to sync order data. Since VKart doesn't have user authentication, email addresses are used to link orders between the two systems.

## Architecture

- **Client Storage**: Orders are stored in localStorage (`vkart_all_orders`)
- **Server Storage**: Orders are also pushed to in-memory storage on the server for API access
- **Email Matching**: All email addresses are normalized (lowercase, trimmed) for consistent matching
- **Timestamps**: Each order includes `created_at` and `updated_at` ISO timestamps

## API Endpoints

### 1. Test Endpoint
**GET** `/api/orders/test`

Returns sample order data and API documentation.

**Example:**
```bash
curl http://localhost:3000/api/orders/test
```

**Response:**
```json
{
  "success": true,
  "message": "This is sample order data for testing NoshNurture integration",
  "api_info": { ... },
  "sample_order": { ... },
  "usage_examples": { ... }
}
```

---

### 2. Sync Orders
**POST** `/api/orders/sync`

Push orders to the server and/or retrieve orders for a specific email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "updated_since": "2025-10-20T00:00:00.000Z",  // Optional
  "orders": [ ... ]  // Optional - array of orders to push
}
```

**Response:**
```json
{
  "success": true,
  "email": "user@example.com",
  "count": 5,
  "orders": [ ... ],
  "synced_at": "2025-10-22T10:30:00.000Z"
}
```

**Example (Retrieve Orders):**
```bash
curl -X POST http://localhost:3000/api/orders/sync \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Example (Push and Retrieve):**
```bash
curl -X POST http://localhost:3000/api/orders/sync \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "orders": [
      {
        "orderId": "BLK-1729584000000",
        "email": "user@example.com",
        "created_at": "2025-10-22T10:30:00.000Z",
        "updated_at": "2025-10-22T10:30:00.000Z",
        ...
      }
    ]
  }'
```

**Alternative GET Method:**
```bash
curl "http://localhost:3000/api/orders/sync?email=user@example.com&updated_since=2025-10-20T00:00:00.000Z"
```

---

### 3. Latest Order
**GET** `/api/orders/latest?email=<email>`

Get the most recent order for a specific email.

**Query Parameters:**
- `email` (required): Customer email address

**Response:**
```json
{
  "success": true,
  "email": "user@example.com",
  "order": { ... }  // or null if no orders found
}
```

**Example:**
```bash
curl "http://localhost:3000/api/orders/latest?email=user@example.com"
```

---

## Order Data Structure

Each order object includes:

```typescript
{
  orderId: string,           // Unique order ID (e.g., "BLK-1729584000000")
  email: string,             // Customer email (normalized)
  created_at: string,        // ISO timestamp when order was created
  updated_at: string,        // ISO timestamp when order was last updated
  orderDate: string,         // Human-readable date (e.g., "October 22, 2025")
  customerName: string,      // Customer's full name
  customerPhone: string,     // Customer's phone number
  deliveryAddress: string,   // Full delivery address
  products: Array<{          // Array of products in the order
    id: string,
    name: string,
    price: number,
    quantity: number,
    category: string,
    weight: string,
    expiryDate: string,      // Human-readable expiry date
    daysUntilExpiry: number, // Days until product expires
    productType: string,
    image: string | null,
    productId: string,       // Unique product ID
    batchNumber: string,     // Batch number
    manufactureDate: string, // Manufacture date
    storageInstructions: string
  }>,
  subtotal: number,          // Subtotal amount
  deliveryFee: number,       // Delivery fee
  total: number              // Total amount (subtotal + deliveryFee)
}
```

---

## CORS Configuration

All API endpoints include CORS headers to allow cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Email Matching

- Email addresses are **case-insensitive**
- Whitespace is trimmed
- Normalization function: `email.toLowerCase().trim()`

---

## Integration with NoshNurture

### Fetching Orders

NoshNurture can fetch all orders for a user by their email:

```javascript
async function fetchVKartOrders(email) {
  const response = await fetch(
    `https://vkart-app.com/api/orders/sync?email=${encodeURIComponent(email)}`
  );
  const data = await response.json();
  return data.orders;
}
```

### Incremental Sync

For efficiency, fetch only recent orders using `updated_since`:

```javascript
async function syncRecentOrders(email, lastSyncTime) {
  const response = await fetch(
    `https://vkart-app.com/api/orders/sync?email=${encodeURIComponent(email)}&updated_since=${lastSyncTime}`
  );
  const data = await response.json();
  return data.orders;
}
```

### Latest Order

Get just the most recent order:

```javascript
async function getLatestOrder(email) {
  const response = await fetch(
    `https://vkart-app.com/api/orders/latest?email=${encodeURIComponent(email)}`
  );
  const data = await response.json();
  return data.order;
}
```

---

## Client-Side Utilities

VKart includes helper functions in `lib/apiSync.ts`:

- `pushOrderToAPI(order)` - Push a single order to the API
- `pushOrdersToAPI(orders)` - Push multiple orders to the API
- `fetchOrdersFromAPI(email, updatedSince?)` - Fetch orders from API
- `fetchLatestOrderFromAPI(email)` - Fetch latest order from API
- `syncAllOrdersToAPI()` - Sync all localStorage orders to API

---

## Testing

### 1. Test the API Structure
```bash
curl http://localhost:3000/api/orders/test
```

### 2. Place a Test Order
1. Go to VKart
2. Add items to cart
3. Go to checkout
4. Enter email: `test@example.com`
5. Fill in other details and place order

### 3. Fetch the Order via API
```bash
curl "http://localhost:3000/api/orders/sync?email=test@example.com"
```

### 4. Get Latest Order
```bash
curl "http://localhost:3000/api/orders/latest?email=test@example.com"
```

---

## Production Considerations

### Current Implementation (MVP)
- **Storage**: In-memory on server (resets on restart)
- **Authentication**: None (email-based matching only)
- **CORS**: Open to all origins

### Recommended for Production
1. **Database**: Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add API key validation or OAuth
3. **CORS**: Restrict to specific origins
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Logging**: Add comprehensive logging and monitoring
6. **Validation**: Add stricter data validation
7. **Encryption**: Encrypt sensitive data

---

## Troubleshooting

### Orders not appearing in API
- **Check localStorage**: Open browser console and check `localStorage.getItem('vkart_all_orders')`
- **Check network**: Verify the POST request to `/api/orders/sync` is successful
- **Email mismatch**: Ensure email is exactly the same (case-insensitive)

### CORS errors
- Verify the API endpoints include CORS headers
- Check if the request origin is being blocked

### Empty response
- Make sure at least one order has been placed with the email
- Check server logs for errors

---

## Environment Variables

Optional configuration in `.env.local`:

```bash
# Base URL for API (defaults to current domain)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Support

For issues or questions about the API integration, please contact the VKart development team or open an issue on GitHub.
