import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Coins, 
  DollarSign, 
  Star, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Receipt
} from 'lucide-react';

interface PointTransaction {
  id: number;
  company: {
    id: number;
    name: string;
  };
  type: string;
  points: number;
  amount: number;
  description: string;
  status: string;
  payment_method?: string;
  payment_reference?: string;
  created_at: string;
}

interface PointPackage {
  id: number;
  name: string;
  description: string;
  points: number;
  price: number;
  bonus_points: number;
  is_active: boolean;
  is_featured: boolean;
  features: string[];
  total_points: number;
  formatted_price: string;
  created_at: string;
  updated_at: string;
  point_transactions: PointTransaction[];
}

interface Props {
  package: PointPackage;
}

export default function PointPackageShow({ package: pkg }: Props) {
  const deletePackage = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus paket "${pkg.name}"?`)) {
      router.delete(`/admin/point-packages/${pkg.id}`);
    }
  };

  const toggleStatus = () => {
    router.post(`/admin/point-packages/${pkg.id}/toggle-status`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      purchase: 'bg-blue-100 text-blue-800',
      usage: 'bg-orange-100 text-orange-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Calculate statistics
  const totalTransactions = pkg.point_transactions?.length || 0;
  const completedTransactions = pkg.point_transactions?.filter(t => t.status === 'completed').length || 0;
  const totalRevenue = pkg.point_transactions?.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalPointsSold = pkg.point_transactions?.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.points, 0) || 0;

  return (
    <AppLayout>
      <Head title={`Detail Paket ${pkg.name}`} />
      
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => router.get('/admin/point-packages')}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-2xl font-bold">Detail Paket: {pkg.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.get(`/admin/point-packages/${pkg.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={pkg.is_active ? "destructive" : "default"}
              onClick={toggleStatus}
            >
              {pkg.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
            <Button
              variant="destructive"
              onClick={deletePackage}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        {/* Package Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Informasi Paket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={pkg.is_active ? "default" : "secondary"}>
                  {pkg.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Featured</span>
                {pkg.is_featured ? (
                  <Star className="h-4 w-4 text-yellow-500" />
                ) : (
                  <span className="text-sm text-gray-400">Tidak</span>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Poin Dasar</span>
                  <span className="font-medium">{(pkg.points || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bonus Poin</span>
                  <span className="font-medium text-green-600">+{(pkg.bonus_points || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total Poin</span>
                  <span className="text-blue-600">{(pkg.total_points || 0).toLocaleString()}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Harga</span>
                <span className="text-green-600">{pkg.formatted_price}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Dibuat:</strong> {pkg.created_at ? new Date(pkg.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Unknown date'}
              </div>
            </CardContent>
          </Card>

          {/* Package Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Fitur Paket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                {pkg.features && pkg.features.length > 0 ? (
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">Tidak ada fitur yang didefinisikan</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transaksi</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Berhasil</p>
                  <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    Rp {(totalRevenue || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Terjual</p>
                  <p className="text-2xl font-bold text-blue-600">{(totalPointsSold || 0).toLocaleString()}</p>
                </div>
                <Coins className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Riwayat Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pkg.point_transactions && pkg.point_transactions.length > 0 ? (
              <div className="space-y-4">
                {pkg.point_transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(transaction.type)}>
                            {transaction.type === 'purchase' ? 'Pembelian' : 'Penggunaan'}
                          </Badge>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status === 'completed' ? 'Berhasil' : 
                             transaction.status === 'pending' ? 'Pending' : 'Gagal'}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium">{transaction.company?.name || 'Unknown Company'}</h4>
                        <p className="text-sm text-gray-600">{transaction.description || 'No description'}</p>
                        
                        {transaction.payment_reference && (
                          <p className="text-xs text-gray-500">
                            Ref: {transaction.payment_reference}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {(transaction.points || 0) > 0 ? '+' : ''}{(transaction.points || 0).toLocaleString()} poin
                        </p>
                        {(transaction.amount || 0) > 0 && (
                          <p className="text-sm text-gray-600">
                            Rp {(transaction.amount || 0).toLocaleString('id-ID')}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Belum ada transaksi untuk paket ini
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}