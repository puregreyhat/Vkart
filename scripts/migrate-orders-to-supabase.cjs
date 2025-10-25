const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function main() {
  const filePath = process.argv[2] || 'vkart_all_orders_export.json';
  if (!fs.existsSync(filePath)) {
    console.error('Export file not found:', filePath);
    console.error('Export your localStorage vkart_all_orders and save as', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse JSON file:', e.message);
    process.exit(1);
  }

  const orders = parsed?.state?.orders || [];
  console.log('Orders found in export:', orders.length);

  for (const order of orders) {
    order.email = (order.email || '').toLowerCase().trim();
    order.created_at = order.created_at || new Date().toISOString();
    order.updated_at = order.updated_at || new Date().toISOString();

    const row = {
      order_id: order.orderId,
      email: order.email,
      created_at: order.created_at,
      updated_at: order.updated_at,
      order_date: order.orderDate,
      delivery_address: order.deliveryAddress,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      subtotal: order.subtotal || 0,
      delivery_fee: order.deliveryFee || 0,
      total: order.total || 0,
      data: order
    };

    const { error } = await supabase.from('orders').upsert(row, { onConflict: 'order_id' });
    if (error) {
      console.error('Upsert failed for', order.orderId, error.message || error);
    } else {
      console.log('Upserted', order.orderId);
    }
  }

  console.log('Migration complete.');
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
