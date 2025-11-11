import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, CreditCard, Package, Calendar, Hash, FileText, DollarSign } from 'lucide-react';
import { route } from 'ziggy-js';

interface Company {
  id: number;
  name: string;
  email: string;
}

interface PointPackage {
  id: number;
  name: string;
  points: number;
  price: number;
}

interface PointTransaction {
  id: number;
  company: Company;
  point_package?: PointPackage;
  type: 'purchase' | 'usage';
  points: number;
  amount?: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method?: string;
  payment_reference?: string;
  reference_type?: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    package_name?: string;
    package_points?: number;
    package_bonus?: number;
    snap_token?: string;
    midtrans_params?: any;
    completed_at?: string;
    [key: string]: any;
  };
}

interface Props {
  transaction: PointTransaction;
}

export default function TransactionShow({ transaction }: Props) {
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const labels = {
      pending: 'Pending',
      completed: 'Berhasil',
      failed: 'Gagal',
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.pending}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      purchase: 'bg-blue-100 text-blue-800 border-blue-200',
      usage: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    
    const labels = {
      purchase: 'Pembelian Poin',
      usage: 'Penggunaan Poin',
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || colors.purchase}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout>
      <Head title={`Detail Transaksi #${transaction.id}`} />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get('/admin/transactions')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke History Transaksi
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Detail Transaksi #{transaction.id}</h1>
              <p className="text-gray-600">Informasi lengkap transaksi poin</p>
            </div>
            <div className="flex items-center gap-3">
              {getTypeBadge(transaction.type)}
              {getStatusBadge(transaction.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detail Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ID Transaksi</label>
                      <p className="font-mono text-lg">{transaction.id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipe Transaksi</label>
                      <div className="mt-1">{getTypeBadge(transaction.type)}</div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Jumlah Poin</label>
                      <p className={`text-2xl font-bold ${
                        transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'purchase' ? '+' : ''}{transaction.points}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                      <p className="text-gray-900">{transaction.description}</p>
                    </div>
                    
                    {transaction.amount && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Jumlah Pembayaran</label>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(transaction.amount)}</p>
                      </div>
                    )}

                    {transaction.payment_method && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Metode Pembayaran</label>
                        <p className="capitalize">{transaction.payment_method}</p>
                      </div>
                    )}

                    {transaction.payment_reference && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Referensi Pembayaran</label>
                        <p className="font-mono text-sm">{transaction.payment_reference}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Information (for purchase) */}
            {transaction.type === 'purchase' && transaction.point_package && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Informasi Paket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama Paket</label>
                      <p className="font-semibold">{transaction.point_package.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Harga Paket</label>
                      <p className="font-semibold">{formatCurrency(transaction.point_package.price)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Poin Diterima</label>
                      <p className="font-semibold text-green-600 text-xl">+{transaction.points}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Harga per Poin</label>
                      <p className="font-semibold text-gray-700">
                        {formatCurrency(Math.round(transaction.point_package.price / transaction.points))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informasi Perusahaan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nama Perusahaan</label>
                  <p className="font-semibold">{transaction.company.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm">{transaction.company.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">ID Perusahaan</label>
                  <p className="font-mono text-sm">#{transaction.company.id}</p>
                </div>

                <div className="pt-2">
                  <Link 
                    href={route('admin.companies.show', transaction.company.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Lihat Detail Perusahaan →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-2 border-gray-200 pl-4 space-y-4">
                  <div className="relative">
                    <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Transaksi Dibuat</p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  
                  {transaction.created_at !== transaction.updated_at && (
                    <div className="relative">
                      <div className={`absolute -left-6 w-3 h-3 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-500' :
                        transaction.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">Status Diperbarui</p>
                        <p className="text-sm text-gray-600">{formatDate(transaction.updated_at)}</p>
                      </div>
                    </div>
                  )}
                  
                  {transaction.metadata?.completed_at && (
                    <div className="relative">
                      <div className="absolute -left-6 w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Transaksi Selesai</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(transaction.metadata.completed_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Hash className="h-4 w-4 mr-2" />
                  Copy Transaction ID
                </Button>
                
                {transaction.payment_reference && (
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Copy Payment Reference
                  </Button>
                )}
                
                <Link 
                  href={route('admin.transactions.index', { 
                    company_id: transaction.company.id 
                  })}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Lihat Transaksi Perusahaan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}