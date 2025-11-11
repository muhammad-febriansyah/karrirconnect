import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Shield, Clock } from 'lucide-react';

interface PointPackage {
  id: number;
  name: string;
  description: string;
  points: number;
  price: number;
  bonus_points: number;
  total_points: number;
  formatted_price: string;
}

interface PointTransaction {
  id: number;
  payment_reference: string;
  status: string;
  created_at: string;
}

interface Props {
  snapToken: string;
  orderId: string;
  package: PointPackage;
  transaction: PointTransaction;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: any) => void;
    };
  }
}

export default function PaymentPage({ snapToken, orderId, package: pkg, transaction }: Props) {
  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    script.src = isProduction 
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    
    script.onload = () => {
      // Automatically trigger payment when script is loaded
      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: function(result: any) {
            window.location.href = `/company/points/payment/finish?order_id=${orderId}&result_type=success`;
          },
          onPending: function(result: any) {
            window.location.href = `/company/points/payment/finish?order_id=${orderId}&result_type=pending`;
          },
          onError: function(result: any) {
            window.location.href = `/company/points/payment/finish?order_id=${orderId}&result_type=error`;
          },
          onClose: function() {
            window.location.href = `/company/points/packages`;
          }
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [snapToken, orderId]);

  return (
    <AppLayout>
      <Head title="Pembayaran - Beli Poin" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Proses Pembayaran</h1>
            <p className="text-gray-600">Silakan selesaikan pembayaran untuk mendapatkan poin</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detail Pembelian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Paket</p>
                  <p className="font-semibold">{pkg.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Poin</p>
                  <p className="font-semibold">{pkg.total_points} poin</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Harga</p>
                  <p className="font-semibold text-blue-600">{pkg.formatted_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm">{orderId}</p>
                </div>
              </div>

              {pkg.bonus_points > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    Bonus: Dapatkan {pkg.bonus_points} poin tambahan gratis!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Memproses Pembayaran...</h3>
                <p className="text-gray-600">
                  Jendela pembayaran akan terbuka secara otomatis. Jika tidak muncul, silakan refresh halaman ini.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Metode Pembayaran Tersedia:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                  <div>• Kartu Kredit</div>
                  <div>• Bank Transfer</div>
                  <div>• GoPay</div>
                  <div>• ShopeePay</div>
                  <div>• DANA</div>
                  <div>• OVO</div>
                  <div>• Alfamart</div>
                  <div>• Indomaret</div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Pembayaran diamankan oleh Midtrans</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Poin akan ditambahkan otomatis setelah pembayaran berhasil</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Mengalami masalah? {' '}
              <a href="/company/points" className="text-blue-600 hover:underline">
                Kembali ke dashboard poin
              </a>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}