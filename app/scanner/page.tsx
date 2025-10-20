'use client';

import { useState, useEffect, useRef } from 'react';
import { useDarkMode, useUsername } from '@/lib/useDarkMode';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import html5-qrcode to avoid SSR issues
const Html5QrcodePlugin = dynamic(
  () => import('@/components/Html5QrcodePlugin'),
  { ssr: false }
);

interface ScannedProduct {
  name: string;
  expiryDate: string;
  quantity?: number;
  category?: string;
}

interface ScannedData {
  orderId: string;
  orderDate: string;
  products: ScannedProduct[];
}

export default function ScannerPage() {
  const { darkMode } = useDarkMode();
  const { username } = useUsername();
  const [isClient, setIsClient] = useState(false);
  const [scanMode, setScanMode] = useState<'none' | 'camera' | 'upload' | 'manual'>('none');
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [manualInput, setManualInput] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle file upload for QR code
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          try {
            const { default: jsQR } = await import('jsqr');
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Cannot get canvas context');
            
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              try {
                const decoded = JSON.parse(code.data);
                setScannedData(decoded);
                setScanMode('none');
                setError('');
              } catch {
                setError('Could not decode QR data. Please try another image.');
              }
            } else {
              setError('No QR code found in image. Please try another image.');
            }
          } catch {
            setError('Error processing image. Please try another one.');
          }
          setIsLoading(false);
        };
        img.onerror = () => {
          setError('Could not load image. Please try another file.');
          setIsLoading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Error reading file. Please try again.');
      setIsLoading(false);
    }
  };

  // Handle manual data entry
  const handleManualScan = () => {
    if (!manualInput.trim()) {
      setError('Please enter QR data or JSON');
      return;
    }

    try {
      const decoded = JSON.parse(manualInput);
      setScannedData(decoded);
      setManualInput('');
      setScanMode('none');
      setError('');
    } catch {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string): { days: number; status: 'fresh' | 'warning' | 'expired' } => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { days: diff, status: 'expired' };
    if (diff <= 3) return { days: diff, status: 'warning' };
    return { days: diff, status: 'fresh' };
  };

  // Get emoji for category
  const getCategoryEmoji = (category?: string): string => {
    const categoryMap: { [key: string]: string } = {
      fruit: '🍎',
      'green-leafy': '🥬',
      'daily-veg': '🥕',
      'root-veg': '🥔',
      'bulb-veg': '🧅',
      'exotic-veg': '🥑',
      'flower-veg': '🥦',
      'legume-veg': '🫘',
      milk: '🥛',
      curd: '🍶',
      grain: '🌾',
      dal: '🥘',
      bread: '🍞',
      'butter-cheese': '🧈',
      snack: '🍿',
      'juice-drink': '🧃',
      masala: '🌶️',
      'dry-fruit': '��',
      medicine: '💊',
      'medical-equipment': '🩹',
      hygiene: '🧼',
      other: '📦',
    };
    return categoryMap[category?.toLowerCase() || 'other'] || '📦';
  };

  if (!isClient) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-pulse text-3xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${darkMode ? 'bg-purple-600' : 'bg-blue-300'} animate-blob`}></div>
        <div className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${darkMode ? 'bg-green-600' : 'bg-green-300'} animate-blob animation-delay-2000`}></div>
        <div className={`absolute -bottom-8 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${darkMode ? 'bg-blue-600' : 'bg-blue-200'} animate-blob animation-delay-4000`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>✨ V-it</Link>
          <h1 className={`text-4xl font-bold mb-2 mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📱 QR Scanner</h1>
          {username && <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome, {username}! 👋</p>}
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Track product expiry and get recipe ideas</p>
        </div>

        {/* Main content */}
        <div className="relative">
          {!scannedData ? (
            <div className={`rounded-3xl backdrop-blur-xl border transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10 shadow-2xl' : 'bg-white/40 border-white/60 shadow-xl'} p-8 space-y-6`}>
              {scanMode === 'none' && (
                <div className="space-y-4">
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Choose scan method:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => setScanMode('camera')} className={`p-6 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${darkMode ? 'bg-gradient-to-br from-blue-600/40 to-blue-400/20 hover:from-blue-500/50 hover:to-blue-400/30 border border-blue-400/30 text-blue-200' : 'bg-gradient-to-br from-blue-500/30 to-blue-300/20 hover:from-blue-400/40 hover:to-blue-300/30 border border-blue-400/40 text-blue-900'}`}>
                      <span className="text-3xl">📷</span>
                      <span>Camera Scan</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className={`p-6 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${darkMode ? 'bg-gradient-to-br from-green-600/40 to-green-400/20 hover:from-green-500/50 hover:to-green-400/30 border border-green-400/30 text-green-200' : 'bg-gradient-to-br from-green-500/30 to-green-300/20 hover:from-green-400/40 hover:to-green-300/30 border border-green-400/40 text-green-900'}`}>
                      <span className="text-3xl">🖼️</span>
                      <span>Upload QR</span>
                    </button>
                    <button onClick={() => setScanMode('manual')} className={`p-6 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${darkMode ? 'bg-gradient-to-br from-purple-600/40 to-purple-400/20 hover:from-purple-500/50 hover:to-purple-400/30 border border-purple-400/30 text-purple-200' : 'bg-gradient-to-br from-purple-500/30 to-purple-300/20 hover:from-purple-400/40 hover:to-purple-300/30 border border-purple-400/40 text-purple-900'}`}>
                      <span className="text-3xl">⌨️</span>
                      <span>Manual Entry</span>
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>
              )}

              {scanMode === 'camera' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setScanMode('none')} className={`text-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>← Back</button>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Camera Scan</h3>
                  </div>
                  {isClient && <Html5QrcodePlugin onScanSuccess={setScannedData} darkMode={darkMode} />}
                  <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Point your camera at the QR code</p>
                </div>
              )}

              {scanMode === 'manual' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setScanMode('none')} className={`text-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>← Back</button>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Manual Entry</h3>
                  </div>
                  <textarea value={manualInput} onChange={(e) => setManualInput(e.target.value)} placeholder='Paste QR data (JSON format)...' className={`w-full p-4 rounded-xl font-mono text-sm transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-600 focus:border-blue-500/50' : 'bg-white/50 border border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-400'} focus:outline-none focus:ring-2 focus:ring-blue-500/30`} rows={6} />
                  <button onClick={handleManualScan} className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg' : 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-300 text-white shadow-lg'}`}>{isLoading ? 'Processing...' : 'Scan'}</button>
                </div>
              )}

              {error && (
                <div className={`p-4 rounded-xl border-l-4 ${darkMode ? 'bg-red-900/20 border-red-600/50 text-red-300' : 'bg-red-100/50 border-red-400 text-red-700'}`}>
                  <p className="font-semibold">⚠️ Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`rounded-3xl backdrop-blur-xl border transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'} p-6`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✅</span>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>QR Code Scanned!</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Order ID: {scannedData.orderId} • Date: {scannedData.orderDate}</p>
                  </div>
                </div>
              </div>

              {scannedData.products && scannedData.products.length > 0 ? (
                <div className={`rounded-3xl backdrop-blur-xl border transition-all duration-300 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'} p-6`}>
                  <h3 className={`text-xl font-bold mb-6 pb-3 border-b ${darkMode ? 'border-white/10 text-white' : 'border-white/20 text-gray-900'}`}>📦 Products ({scannedData.products.length})</h3>
                  <div className="space-y-3">
                    {scannedData.products.map((product, idx) => {
                      const { days, status } = getDaysUntilExpiry(product.expiryDate);
                      const statusConfig = {
                        fresh: darkMode ? 'bg-green-900/30 border-green-600/50 text-green-300' : 'bg-green-100/50 border-green-400/50 text-green-800',
                        warning: darkMode ? 'bg-yellow-900/30 border-yellow-600/50 text-yellow-300' : 'bg-yellow-100/50 border-yellow-400/50 text-yellow-800',
                        expired: darkMode ? 'bg-red-900/30 border-red-600/50 text-red-300' : 'bg-red-100/50 border-red-400/50 text-red-800',
                      };

                      return (
                        <div key={idx} className={`p-4 rounded-xl border transition-all duration-300 ${statusConfig[status]}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getCategoryEmoji(product.category)}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{product.name}</h4>
                              <div className="text-xs opacity-75 mt-1 space-y-1">
                                {product.quantity && <p>Quantity: {product.quantity}</p>}
                                {product.category && <p>Category: {product.category}</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">{product.expiryDate}</div>
                              <div className={`text-xs font-bold mt-1 px-2 py-1 rounded-md ${status === 'fresh' ? (darkMode ? 'bg-green-600/40' : 'bg-green-200/60') : status === 'warning' ? (darkMode ? 'bg-yellow-600/40' : 'bg-yellow-200/60') : (darkMode ? 'bg-red-600/40' : 'bg-red-200/60')}`}>
                                {status === 'expired' ? '❌ EXPIRED' : `${days} days`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={`rounded-3xl backdrop-blur-xl border p-6 text-center ${darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white/40 border-white/60 text-gray-600'}`}>
                  <p className="text-lg">No products found in QR data</p>
                </div>
              )}

              <div className={`rounded-3xl backdrop-blur-xl border transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-600/30' : 'bg-gradient-to-br from-purple-100/40 to-pink-100/40 border-purple-400/30'} p-6`}>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-purple-200' : 'text-purple-900'}`}>🍳 Recipe Ideas</h3>
                <p className={`text-sm ${darkMode ? 'text-purple-300/70' : 'text-purple-800/70'}`}>Based on your products expiring soon, try making a fresh salad or smoothie! ��</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setScannedData(null); setError(''); }} className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${darkMode ? 'bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/50 text-blue-200' : 'bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/50 text-blue-900'}`}>🔄 Scan Again</button>
                <Link href="/" className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center ${darkMode ? 'bg-green-600/40 hover:bg-green-600/60 border border-green-500/50 text-green-200' : 'bg-green-500/30 hover:bg-green-500/40 border border-green-400/50 text-green-900'}`}>🏠 Go Home</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
