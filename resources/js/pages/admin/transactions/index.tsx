import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Download, Filter, Eye, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';

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
}

export default function TransactionIndex({ transactions, stats, filters, companies }: Props) {
  const [localFilters, setLocalFilters] = useState(filters);

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

  const exportCSV = () => {
    router.get(route('admin.transactions.export'), localFilters);
  };

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
      purchase: 'Pembelian',
      usage: 'Penggunaan',
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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              <p className="text-gray-600">Kelola dan pantau semua transaksi poin</p>
            </div>
            <Button onClick={exportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
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

        {/* Filters */}
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">ID</th>
                    <th className="text-left p-3 font-semibold">Perusahaan</th>
                    <th className="text-left p-3 font-semibold">Tipe</th>
                    <th className="text-left p-3 font-semibold">Poin</th>
                    <th className="text-left p-3 font-semibold">Jumlah</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Tanggal</th>
                    <th className="text-left p-3 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.data.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">#{transaction.id}</td>
                      <td className="p-3">
                        <div className="font-medium">{transaction.company.name}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {transaction.description}
                        </div>
                      </td>
                      <td className="p-3">{getTypeBadge(transaction.type)}</td>
                      <td className="p-3">
                        <span className={`font-semibold ${
                          transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'purchase' ? '+' : ''}{transaction.points}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(transaction.amount)}</td>
                      <td className="p-3">{getStatusBadge(transaction.status)}</td>
                      <td className="p-3 text-sm">{formatDate(transaction.created_at)}</td>
                      <td className="p-3">
                        <Link 
                          href={route('admin.transactions.show', transaction.id)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactions.data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada transaksi yang ditemukan</p>
              </div>
            )}

            {/* Pagination */}
            {transactions.last_page > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  {transactions.links.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}