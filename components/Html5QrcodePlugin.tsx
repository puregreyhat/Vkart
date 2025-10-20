'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

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

interface Html5QrcodePluginProps {
  onScanSuccess: (data: ScannedData) => void;
  darkMode: boolean;
}

export default function Html5QrcodePlugin({ onScanSuccess, darkMode }: Html5QrcodePluginProps) {
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const qrCodeSuccessCallback = (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        onScanSuccess(data);
        // Stop scanning after successful scan
        if (qrScannerRef.current) {
          qrScannerRef.current.stop().catch(() => {});
        }
      } catch (err) {
        console.error('Failed to parse QR data:', err);
      }
    };

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      disableFlip: false,
    };

    const qrCodeErrorCallback = (errorMessage: string) => {
      // Silently ignore scanning errors (camera scanning errors are normal during scanning)
    };

    const startScanning = async () => {
      try {
        qrScannerRef.current = new Html5Qrcode('qr-reader');
        await qrScannerRef.current.start(
          { facingMode: 'environment' },
          config,
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        );
        setIsScanning(true);
        setError('');
      } catch (err: any) {
        setError(err?.message || 'Failed to start camera');
        setIsScanning(false);
      }
    };

    startScanning();

    return () => {
      if (qrScannerRef.current && isScanning) {
        qrScannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScanSuccess, isClient]);

  return (
    <>
      {!isClient ? (
        <div className={`rounded-2xl overflow-hidden border-2 h-96 flex items-center justify-center ${
          darkMode
            ? 'border-gray-600/50 bg-gray-800/50'
            : 'border-gray-300/50 bg-gray-100/50'
        }`}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading camera...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            id="qr-reader"
            className={`rounded-2xl overflow-hidden border-2 ${
              darkMode
                ? 'border-gray-600/50 bg-gray-800/50'
                : 'border-gray-300/50 bg-gray-100/50'
            }`}
            style={{ width: '100%', maxHeight: '400px' }}
          ></div>

          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                darkMode
                  ? 'bg-red-900/20 text-red-300 border border-red-600/30'
                  : 'bg-red-100/50 text-red-700 border border-red-300/50'
              }`}
            >
              {error}
            </div>
          )}

          {isScanning && (
            <div
              className={`p-3 rounded-lg text-sm text-center ${
                darkMode
                  ? 'bg-green-900/20 text-green-300 border border-green-600/30'
                  : 'bg-green-100/50 text-green-700 border border-green-300/50'
              }`}
            >
              ✓ Camera ready • Point at QR code
            </div>
          )}
        </div>
      )}
    </>
  );
}
