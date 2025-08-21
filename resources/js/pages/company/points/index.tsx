import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  job_posting_points: number;
  total_job_posts: number;
  active_job_posts: number;
  max_active_jobs: number;
}

interface PointTransaction {
  id: number;
  type: string;
  points: number;
  amount?: number;
  description: string;
  status: string;
  created_at: string;
  point_package?: {
    id: number;
    name: string;
  };
}

interface Props {
  company: Company;
  pointHistory: {
    data: PointTransaction[];
    current_page: number;
    last_page: number;
  };
  stats: {
    current_points: number;
    total_spent: number;
    total_purchased: number;
    active_jobs: number;
    max_active_jobs: number;
  };
}

export default function CompanyPointsIndex({ company, pointHistory, stats }: Props) {
  const getTypeColor = (type: string) => {
    const colors = {
      purchase: 'bg-green-100 text-green-800',
      usage: 'bg-red-100 text-red-800',
      refund: 'bg-blue-100 text-blue-800',
      bonus: 'bg-purple-100 text-purple-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      purchase: 'Pembelian',
      usage: 'Penggunaan',
      refund: 'Refund',
      bonus: 'Bonus',
      expired: 'Kadaluarsa',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: 'Selesai',
      pending: 'Pending',
      failed: 'Gagal',
      cancelled: 'Dibatalkan',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <AppLayout>
      <Head title="Poin Saya" />
      
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get('/admin/dashboard')}
            className="w-fit"
          >
            ← Kembali ke Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Poin Saya</h1>
              <p className="text-gray-600">Kelola poin untuk posting lowongan</p>
            </div>
            <Link href="/company/points/packages">
              <Button className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Beli Poin
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Tersedia</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.current_points}</p>
                  <p className="text-xs text-gray-500 mt-1">poin posting lowongan</p>
                </div>
                <Coins className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Terpakai</p>
                  <p className="text-3xl font-bold text-red-600">{stats.total_spent}</p>
                  <p className="text-xs text-gray-500 mt-1">total penggunaan</p>
                </div>
                <TrendingDown className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Dibeli</p>
                  <p className="text-3xl font-bold text-green-600">{stats.total_purchased}</p>
                  <p className="text-xs text-gray-500 mt-1">total pembelian</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lowongan Aktif</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.active_jobs}<span className="text-lg">/{stats.max_active_jobs}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">batas maksimal</p>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">{Math.round((stats.active_jobs / stats.max_active_jobs) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/company/points/packages">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Beli Poin</h3>
                      <p className="text-sm text-gray-600">Pilih paket poin yang sesuai</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/job-listings/create">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Coins className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Posting Lowongan</h3>
                      <p className="text-sm text-gray-600">Gunakan 1 poin untuk posting</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/job-listings">
                <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">{stats.active_jobs}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Kelola Lowongan</h3>
                      <p className="text-sm text-gray-600">Lihat semua lowongan aktif</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Point History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pointHistory.data.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      {transaction.points > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{transaction.description}</h4>
                        <Badge className={getTypeColor(transaction.type)}>
                          {getTypeLabel(transaction.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{new Date(transaction.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        
                        {transaction.point_package && (
                          <span>• {transaction.point_package.name}</span>
                        )}
                        
                        <span>• {getStatusLabel(transaction.status)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} poin
                    </div>
                    {transaction.amount && (
                      <div className="text-sm text-gray-600">
                        Rp {transaction.amount.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {pointHistory.data.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Belum ada transaksi</h3>
                  <p className="text-gray-600 mb-4">
                    Riwayat pembelian dan penggunaan poin akan muncul di sini.
                  </p>
                  <Link href="/company/points/packages">
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Beli Poin Pertama
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Points Warning */}
        {stats.current_points <= 2 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-10 w-10 text-orange-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800">Poin Hampir Habis!</h3>
                  <p className="text-orange-700 mt-1">
                    Anda hanya memiliki {stats.current_points} poin tersisa. Beli paket poin sekarang untuk terus posting lowongan.
                  </p>
                </div>
                <Link href="/company/points/packages">
                  <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Beli Poin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}