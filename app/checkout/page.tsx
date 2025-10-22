'use client';

import { useState, useEffect } from 'react';
import { useCartStore, useCheckoutStore, useOrderStore, useAllOrdersStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  generateProductId,
  generateBatchNumber,
  generateExpiryDate,
  getDaysUntilExpiry,
  formatDate,
  getStorageInstructions,
  formatCurrency,
  normalizeEmail,
  isValidEmail,
} from '@/lib/utils';
import { pushOrderToAPI } from '@/lib/apiSync';
import { useDarkMode } from '@/lib/useDarkMode';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, getTotal, getItemCount, clearCart } = useCartStore();
  const { customerInfo, setCustomerInfo } = useCheckoutStore();
  const { setLastOrder } = useOrderStore();
  const { addOrder } = useAllOrdersStore();
  const { darkMode } = useDarkMode();

  const [email, setEmail] = useState(customerInfo.email);
  const [name, setName] = useState(customerInfo.name);
  const [phone, setPhone] = useState(customerInfo.phone);
  const [address, setAddress] = useState(customerInfo.address);

  const subtotal = getTotal();
  const deliveryFee = 20;
  const packagingFee = 5;
  const total = subtotal + deliveryFee + packagingFee;

  const handlePlaceOrder = () => {
    // Validate email first
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    // Save customer info
    setCustomerInfo({ email, name, phone, address });

    // Generate order data
    const orderId = 'BLK-' + Date.now();
    const orderDate = new Date();
    const timestamp = new Date().toISOString();

    const productsWithDetails = cart.map((item) => {
      const productId = generateProductId();
      const batchNumber = generateBatchNumber();
      const expiryDate = generateExpiryDate(item.category, item.name);
      const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
      const manufactureDate = new Date();
      manufactureDate.setDate(manufactureDate.getDate() - Math.floor(Math.random() * 30));

      return {
        ...item,
        productId,
        batchNumber,
        manufactureDate: formatDate(manufactureDate),
        expiryDate: formatDate(expiryDate),
        daysUntilExpiry,
        storageInstructions: getStorageInstructions(item.category, item.name),
      };
    });

    const orderData = {
      orderId,
      email: normalizeEmail(email), // NEW: normalized email for API sync
      created_at: timestamp, // NEW: ISO timestamp
      updated_at: timestamp, // NEW: ISO timestamp
      orderDate: formatDate(orderDate),
      deliveryAddress: address,
      customerName: name,
      customerPhone: phone,
      products: productsWithDetails,
      subtotal,
      deliveryFee,
      total,
    };

    // Save order to session store (for receipt page)
    setLastOrder(orderData);

    // Save order to global store (for API sync)
    addOrder(orderData);

    // Push order to API server (async, non-blocking)
    pushOrderToAPI(orderData).catch(err => {
      console.error('Failed to sync order to API:', err);
      // Don't block the user flow if API sync fails
    });

    // Clear cart
    clearCart();

    // Redirect to receipt
    router.push('/receipt');
  };

  if (cart.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Your cart is empty</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add some products to get started</p>
          <Link
            href="/"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className={`font-semibold mb-4 inline-block ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}>
            ← Continue Shopping
          </Link>
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Checkout</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Review your order and complete purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Your Cart Items ({getItemCount()})
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-lg transition-all ${
                      darkMode 
                        ? 'border border-gray-800 hover:border-green-500 bg-gray-800/50' 
                        : 'border border-gray-200 hover:border-green-500'
                    }`}
                  >
                    <img
                      src={item.image || ''}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.weight}</p>
                      <p className={`text-lg font-bold mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {formatCurrency(item.price * (item.quantity || 1))}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className={`w-8 h-8 border-2 rounded-lg font-bold transition-all ${
                              darkMode
                                ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black'
                                : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                            }`}
                          >
                            −
                          </button>
                          <span className={`font-semibold w-8 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className={`w-8 h-8 border-2 rounded-lg font-bold transition-all ${
                              darkMode
                                ? 'border-green-500 text-green-400 hover:bg-green-500 hover:text-black'
                                : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                            }`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl shadow-md p-6 sticky top-8 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Summary</h2>

              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500 placeholder-gray-500'
                        : 'border-gray-300 focus:border-green-500'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Required for order tracking & NoshNurture sync
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500 placeholder-gray-500'
                        : 'border-gray-300 focus:border-green-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500 placeholder-gray-500'
                        : 'border-gray-300 focus:border-green-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Delivery Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none ${
                      darkMode
                        ? 'bg-gray-800 text-white border-gray-700 focus:border-green-500 placeholder-gray-500'
                        : 'border-gray-300 focus:border-green-500'
                    }`}
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className={`space-y-3 pt-4 ${darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Subtotal ({getItemCount()} items)</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>Packaging Fee</span>
                  <span className="font-semibold">{formatCurrency(packagingFee)}</span>
                </div>
                <div className={`flex justify-between text-xl font-bold pt-3 ${
                  darkMode 
                    ? 'text-white border-t-2 border-gray-800' 
                    : 'text-gray-800 border-t-2 border-gray-300'
                }`}>
                  <span>Total</span>
                  <span className={darkMode ? 'text-green-400' : 'text-green-600'}>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg mt-6 hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                Place Order & Generate Receipt
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🌱 You'll receive a QR code with all product details to track expiry dates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
