import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { transactionsColumns, type Transaction } from '@/components/tables/transactions-columns';
import { ArrowLeft, Search, Filter, Eye, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { route } from 'ziggy-js';

interface Company {
  id: number;
  name: string;
}

interface PointPackage {
  id: number;
  name: string;
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
  created_at: string;
  metadata?: any;
}

interface Stats {
  total_transactions: number;
  total_points_sold: number;
  total_points_used: number;
  total_revenue: number;
  pending_transactions: number;
}

interface Props {
  transactions: {
    data: PointTransaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  stats: Stats;
  filters: {
    search?: string;
    status?: string;
    type?: string;
    company_id?: string;
    date_from?: string;
    date_to?: string;
  };
  companies: Company[];
  userRole: string;
}

export default function TransactionIndex({ transactions, stats, filters, companies, userRole }: Props) {
  const [localFilters, setLocalFilters] = useState(filters);

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleFilter = () => {
    router.get(route('admin.transactions.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    router.get(route('admin.transactions.index'), clearedFilters);
  };



  return (
    <AppLayout>
      <Head title="History Transaksi" />
      
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get('/admin/dashboard')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">History Transaksi</h1>
              <p className="text-gray-600">
                {userRole === 'company_admin' 
                  ? 'Lihat riwayat transaksi poin perusahaan Anda' 
                  : 'Kelola dan pantau semua transaksi poin'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Hidden for Company Admin */}
        {userRole !== 'company_admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transaksi</p>
                  <p className="text-2xl font-bold">{stats.total_transactions.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Terjual</p>
                  <p className="text-2xl font-bold text-green-600">{stats.total_points_sold.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Poin Terpakai</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.total_points_used.toLocaleString()}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.total_revenue)}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending_transactions}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Filters - Hidden for Company Admin */}
        {userRole !== 'company_admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Pencarian</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Company, deskripsi, payment ref..."
                    value={localFilters.search || ''}
                    onChange={(e) => setLocalFilters({...localFilters, search: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={localFilters.status || 'all'} onValueChange={(value) => setLocalFilters({...localFilters, status: value === 'all' ? undefined : value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Berhasil</SelectItem>
                    <SelectItem value="failed">Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Tipe</label>
                <Select value={localFilters.type || 'all'} onValueChange={(value) => setLocalFilters({...localFilters, type: value === 'all' ? undefined : value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="purchase">Pembelian</SelectItem>
                    <SelectItem value="usage">Penggunaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Perusahaan</label>
                <Select value={localFilters.company_id || 'all'} onValueChange={(value) => setLocalFilters({...localFilters, company_id: value === 'all' ? undefined : value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Semua Perusahaan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Perusahaan</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tanggal Mulai</label>
                <Input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => setLocalFilters({...localFilters, date_from: e.target.value || undefined})}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tanggal Akhir</label>
                <Input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => setLocalFilters({...localFilters, date_to: e.target.value || undefined})}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleFilter}>
                Terapkan Filter
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Transaksi</CardTitle>
              <div className="text-sm text-gray-600">
                Total: {transactions.total} transaksi
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={transactionsColumns} 
              data={transactions.data as Transaction[]}
              searchKey="company"
              searchPlaceholder="Cari perusahaan..."
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}