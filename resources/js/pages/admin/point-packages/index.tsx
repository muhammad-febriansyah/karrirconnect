import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Star, Coins, Eye } from 'lucide-react';

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
}

interface Props {
  packages: PointPackage[];
}

export default function PointPackagesIndex({ packages }: Props) {
  const toggleStatus = (pkg: PointPackage) => {
    router.post(`/admin/point-packages/${pkg.id}/toggle-status`);
  };

  const deletePackage = (pkg: PointPackage) => {
    if (confirm(`Apakah Anda yakin ingin menghapus paket "${pkg.name}"?`)) {
      router.delete(`/admin/point-packages/${pkg.id}`);
    }
  };

  return (
    <AppLayout>
      <Head title="Manajemen Paket Poin" />
      
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
              <h1 className="text-2xl font-bold">Manajemen Paket Poin</h1>
              <p className="text-gray-600">Kelola paket poin untuk perusahaan</p>
            </div>
            <Link href="/admin/point-packages/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Buat Paket Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paket</p>
                  <p className="text-2xl font-bold">{packages.length}</p>
                </div>
                <Coins className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paket Aktif</p>
                  <p className="text-2xl font-bold text-green-600">
                    {packages.filter(pkg => pkg.is_active).length}
                  </p>
                </div>
                <ToggleRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paket Featured</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {packages.filter(pkg => pkg.is_featured).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paket Nonaktif</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {packages.filter(pkg => !pkg.is_active).length}
                  </p>
                </div>
                <ToggleLeft className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={`relative ${pkg.is_featured ? 'ring-2 ring-yellow-400' : ''}`}>
              {pkg.is_featured && (
                <div className="absolute -top-2 left-4">
                  <Badge className="bg-yellow-400 text-yellow-900">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {pkg.formatted_price}
                    </p>
                  </div>
                  <Badge className={pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {pkg.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Poin</span>
                    <span className="font-semibold">{pkg.total_points} poin</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Poin Utama</span>
                    <span>{pkg.points} poin</span>
                  </div>
                  {pkg.bonus_points > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Bonus</span>
                      <span className="text-green-600">+{pkg.bonus_points} poin</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Masa Berlaku</span>
                    <span className="text-green-600 font-medium">Permanen</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Features:</p>
                  <ul className="text-sm space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/point-packages/${pkg.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                      </Button>
                    </Link>
                    
                    <Link href={`/admin/point-packages/${pkg.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleStatus(pkg)}
                    >
                      {pkg.is_active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                    </Button>

                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deletePackage(pkg)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada paket poin</h3>
              <p className="text-gray-600 mb-4">
                Mulai dengan membuat paket poin pertama untuk perusahaan.
              </p>
              <Link href="/admin/point-packages/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Paket Poin
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}