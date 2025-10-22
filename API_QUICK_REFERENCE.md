# VKart API Quick Reference

## 🚀 Base URL
```
http://localhost:3000/api/orders
```

## 📡 Endpoints

### 1️⃣ Test Endpoint
```bash
GET /api/orders/test
```
**Purpose:** Get sample data and API docs  
**Auth:** None  
**Response:** Sample order + documentation

---

### 2️⃣ Sync Orders
```bash
GET /api/orders/sync?email={email}&updated_since={timestamp}
POST /api/orders/sync
```
**Purpose:** Fetch/push orders by email  
**Auth:** None  
**Query Params:**
- `email` (required) - User email
- `updated_since` (optional) - ISO timestamp for incremental sync

**POST Body:**
```json
{
  "email": "user@example.com",
  "updated_since": "2025-10-20T00:00:00.000Z",
  "orders": [ ... ]  // Optional: push orders
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

---

### 3️⃣ Latest Order
```bash
GET /api/orders/latest?email={email}
```
**Purpose:** Get most recent order for email  
**Auth:** None  
**Query Params:**
- `email` (required) - User email

**Response:**
```json
{
  "success": true,
  "email": "user@example.com",
  "order": { ... }  // or null
}
```

---

## 💡 Quick Examples

### Fetch All Orders
```bash
curl "http://localhost:3000/api/orders/sync?email=test@example.com"
```

### Incremental Sync (Recent Only)
```bash
curl "http://localhost:3000/api/orders/sync?email=test@example.com&updated_since=2025-10-20T00:00:00.000Z"
```

### Get Latest Order
```bash
curl "http://localhost:3000/api/orders/latest?email=test@example.com"
```

### Push Orders (POST)
```bash
curl -X POST http://localhost:3000/api/orders/sync \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "orders": [{ ... }]
  }'
```

---

## 📦 Order Object Structure
```javascript
{
  orderId: "BLK-1729584000000",
  email: "user@example.com",
  created_at: "2025-10-22T10:30:00.000Z",
  updated_at: "2025-10-22T10:30:00.000Z",
  orderDate: "October 22, 2025",
  customerName: "John Doe",
  customerPhone: "+91 9876543210",
  deliveryAddress: "123 Main St, Mumbai",
  products: [
    {
      id: "prod-1",
      name: "Fresh Milk",
      price: 60,
      quantity: 2,
      category: "dairy",
      expiryDate: "October 28, 2025",
      daysUntilExpiry: 6,
      // ... more fields
    }
  ],
  subtotal: 185,
  deliveryFee: 20,
  total: 205
}
```

---

## 🔧 JavaScript Integration

### Fetch Orders (Async/Await)
```javascript
async function getVKartOrders(email) {
  const res = await fetch(
    `http://localhost:3000/api/orders/sync?email=${encodeURIComponent(email)}`
  );
  const data = await res.json();
  return data.orders;
}
```

### Fetch Latest Order
```javascript
async function getLatestOrder(email) {
  const res = await fetch(
    `http://localhost:3000/api/orders/latest?email=${encodeURIComponent(email)}`
  );
  const { order } = await res.json();
  return order;
}
```

### Incremental Sync
```javascript
async function syncRecentOrders(email, lastSyncTime) {
  const res = await fetch(
    `http://localhost:3000/api/orders/sync?email=${encodeURIComponent(email)}&updated_since=${lastSyncTime}`
  );
  const data = await res.json();
  return data.orders;
}
```

---

## 🎯 CORS Headers
All endpoints include:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## ✅ Status Codes
- `200` - Success
- `400` - Bad request (missing/invalid email)
- `500` - Server error

---

## 📝 Notes
- Email matching is **case-insensitive**
- Emails are automatically trimmed and normalized
- Orders are sorted by `created_at` (newest first)
- `updated_since` uses ISO 8601 timestamps
- In-memory storage (resets on server restart in MVP)

---

## 🔗 Full Documentation
See `API_INTEGRATION.md` for complete details.
