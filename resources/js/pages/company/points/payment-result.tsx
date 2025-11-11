import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, AlertTriangle, ArrowLeft, Coins, Receipt } from 'lucide-react';

interface PointPackage {
  id: number;
  name: string;
  points: number;
  bonus_points: number;
  total_points: number;
  formatted_price: string;
}

interface PointTransaction {
  id: number;
  payment_reference: string;
  status: string;
  points: number;
  amount: number;
  created_at: string;
  point_package: PointPackage;
}

interface Props {
  transaction: PointTransaction;
  resultType: string; // success, pending, error
  paymentStatus?: any;
}

export default function PaymentResult({ transaction, resultType, paymentStatus }: Props) {
  const getStatusIcon = () => {
    switch (resultType) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (resultType) {
      case 'success':
        return 'Pembayaran Berhasil!';
      case 'pending':
        return 'Pembayaran Sedang Diproses';
      case 'error':
        return 'Pembayaran Gagal';
      default:
        return 'Status Tidak Diketahui';
    }
  };

  const getStatusMessage = () => {
    switch (resultType) {
      case 'success':
        return `Selamat! Anda telah berhasil membeli ${transaction.point_package.total_points} poin. Poin sudah ditambahkan ke akun Anda dan siap digunakan untuk posting lowongan.`;
      case 'pending':
        return 'Pembayaran Anda sedang diproses. Poin akan ditambahkan ke akun Anda setelah pembayaran dikonfirmasi. Proses ini biasanya memakan waktu beberapa menit.';
      case 'error':
        return 'Pembayaran Anda gagal diproses. Silakan coba lagi atau gunakan metode pembayaran yang berbeda.';
      default:
        return 'Status pembayaran tidak dapat ditentukan. Silakan periksa riwayat transaksi Anda.';
    }
  };

  const getStatusColor = () => {
    switch (resultType) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'pending':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <AppLayout>
      <Head title={`${getStatusTitle()} - Pembelian Poin`} />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>

          {/* Status Card */}
          <Card className={`mb-6 ${getStatusColor()}`}>
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                {getStatusIcon()}
              </div>
              
              <h1 className="text-2xl font-bold mb-4">{getStatusTitle()}</h1>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {getStatusMessage()}
              </p>

              <div className="flex justify-center gap-4">
                {resultType === 'success' && (
                  <>
                    <Link href="/company/points">
                      <Button>
                        <Coins className="h-4 w-4 mr-2" />
                        Lihat Poin Saya
                      </Button>
                    </Link>
                    <Link href="/admin/job-listings/create">
                      <Button variant="outline">
                        Mulai Posting Lowongan
                      </Button>
                    </Link>
                  </>
                )}

                {resultType === 'pending' && (
                  <>
                    <Link href="/company/points">
                      <Button>
                        <Coins className="h-4 w-4 mr-2" />
                        Cek Status Poin
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Refresh Status
                    </Button>
                  </>
                )}

                {resultType === 'error' && (
                  <>
                    <Link href="/company/points/packages">
                      <Button>
                        Coba Lagi
                      </Button>
                    </Link>
                    <Link href="/company/points">
                      <Button variant="outline">
                        <Coins className="h-4 w-4 mr-2" />
                        Dashboard Poin
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Detail Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono">{transaction.payment_reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status Transaksi</p>
                  <p className="font-semibold capitalize">{transaction.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paket</p>
                  <p className="font-semibold">{transaction.point_package.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Poin</p>
                  <p className="font-semibold text-green-600">{transaction.point_package.total_points} poin</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Harga</p>
                  <p className="font-semibold text-blue-600">
                    Rp {transaction.amount.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Waktu Transaksi</p>
                  <p className="font-semibold">
                    {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {transaction.point_package.bonus_points > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-800">Bonus Poin!</p>
                      <p className="text-sm text-green-700">
                        Anda mendapat {transaction.point_package.bonus_points} poin bonus gratis
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          {resultType === 'pending' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informasi Pembayaran Pending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Bank Transfer:</strong> Pembayaran akan dikonfirmasi dalam 1-24 jam setelah transfer berhasil.
                </div>
                <div>
                  <strong>E-Wallet:</strong> Pembayaran biasanya dikonfirmasi dalam beberapa menit.
                </div>
                <div>
                  <strong>Convenience Store:</strong> Selesaikan pembayaran di store dalam 24 jam.
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <strong>Penting:</strong> Poin akan otomatis ditambahkan ke akun Anda setelah pembayaran dikonfirmasi. 
                  Tidak perlu melakukan apa-apa lagi.
                </div>
              </CardContent>
            </Card>
          )}

          {resultType === 'success' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Poin sudah tersedia di akun Anda</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <span>Mulai posting lowongan dengan menggunakan 1 poin per posting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-gray-500" />
                  <span>Cek riwayat transaksi di dashboard poin</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}