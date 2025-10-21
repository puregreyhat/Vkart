'use client';

import { useEffect, useRef } from 'react';
import { useOrderStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { formatCurrency } from '@/lib/utils';
import { useDarkMode } from '@/lib/useDarkMode';

export default function ReceiptPage() {
  const router = useRouter();
  const { lastOrder } = useOrderStore();
  const printRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (!lastOrder) {
      router.push('/');
    }
  }, [lastOrder, router]);

  if (!lastOrder) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>No order found</h2>
          <p className={darkMode ? 'text-gray-400 mb-6' : 'text-gray-600 mb-6'}>Please place an order first</p>
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  // Minimal QR data for expiry tracking and recipe suggestions
  const qrData = {
    orderId: lastOrder.orderId,
    orderDate: lastOrder.orderDate,
    products: lastOrder.products.map((product) => ({
      name: product.name,
      expiryDate: product.expiryDate,
      quantity: product.quantity,
      category: product.category,
    })),
  };

  return (
    <div className={`min-h-screen py-8 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Print-friendly content */}
        <div ref={printRef} className={`rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-xl opacity-90">Thank you for your purchase</p>
          </div>

          {/* Order Info */}
          <div className={`p-8 border-b-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order ID</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{lastOrder.orderId}</p>
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order Date</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{lastOrder.orderDate}</p>
              </div>
              <div>
                <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customer Name</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{lastOrder.customerName}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Delivery Address</p>
              <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{lastOrder.deliveryAddress}</p>
            </div>
          </div>

          {/* Products List */}
          <div className="p-8">
            <h2 className={`text-2xl font-bold mb-6 pb-2 border-b-2 border-green-500 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Ordered Items ({lastOrder.products.reduce((sum, p) => sum + (p.quantity || 1), 0)})
            </h2>

            <div className="space-y-4">
              {lastOrder.products.map((product, index) => {
                const isExpiringSoon = product.daysUntilExpiry <= 7;

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      darkMode 
                        ? 'border-gray-700 hover:border-green-500 bg-gray-800' 
                        : 'border-gray-200 hover:border-green-500'
                    }`}
                  >
                    <div className="flex gap-4 mb-4">
                      <img
                        src={product.image || ''}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{product.name}</h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{product.weight} × {product.quantity}</p>
                        <p className="text-green-600 font-bold text-xl mt-1">
                          {formatCurrency(product.price * (product.quantity || 1))}
                        </p>
                      </div>
                    </div>

                    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Product ID</p>
                        <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.productId}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Batch Number</p>
                        <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.batchNumber}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Manufacture Date</p>
                        <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.manufactureDate}</p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Expiry Date</p>
                        <p className={`font-semibold text-sm ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`}>
                          {product.expiryDate}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Days Until Expiry</p>
                        <p className={`font-semibold text-sm ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`}>
                          {product.daysUntilExpiry} days {isExpiringSoon ? '⚠️' : '✓'}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Storage</p>
                        <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.storageInstructions}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className={`p-8 border-t-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Order Summary</h3>
            <div className="space-y-3">
              <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(lastOrder.subtotal)}</span>
              </div>
              <div className={`flex justify-between ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>Delivery Fee</span>
                <span className="font-semibold">{formatCurrency(lastOrder.deliveryFee)}</span>
              </div>
              <div className={`flex justify-between text-xl font-bold border-t-2 pt-3 ${
                darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-300'
              }`}>
                <span>Total Amount</span>
                <span className="text-green-600">{formatCurrency(lastOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* QR Code Section - THE STAR OF THE SHOW! */}
          <div className={`p-8 border-t-2 border-green-500 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
              : 'bg-gradient-to-br from-green-50 to-blue-50'
          }`}>
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🌱 Food Wastage Control QR Code
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Scan this QR code to access ALL product details and track expiry dates
              </p>

              <div className="bg-white p-8 rounded-2xl shadow-xl inline-block">
                <QRCode
                  value={JSON.stringify(qrData)}
                  size={300}
                  level="M"
                  className="mx-auto"
                />
              </div>

              <div className={`mt-6 p-6 rounded-xl shadow-md max-w-2xl mx-auto ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
              }`}>
                <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>What's in this QR Code?</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-left">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Complete order information</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>All {lastOrder.products.length} products with details</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Product quantities for each item</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Expiry dates for each item</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Storage instructions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Batch & product IDs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Customer & delivery info</span>
                  </div>
                </div>
              </div>

              <p className={`text-sm mt-6 italic ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                💡 Scan anytime to check product freshness and reduce food waste
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`p-8 border-t-2 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-wrap gap-4 justify-center print:hidden">
              <button
                onClick={handlePrint}
                className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all shadow-lg"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all shadow-lg"
              >
                📥 Download Receipt
              </button>
              <Link
                href="/scanner"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-lg"
              >
                📱 Scan QR Code
              </Link>
              <Link
                href="/"
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all shadow-lg"
              >
                🏠 Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
