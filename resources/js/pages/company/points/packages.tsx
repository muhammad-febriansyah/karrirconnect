import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Coins, CreditCard, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

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
  service_fee: number;
  total_price: number;
  formatted_total_price: string;
}

interface Company {
  id: number;
  name: string;
  job_posting_points: number;
}

interface Props {
  packages: PointPackage[];
  company: Company;
  serviceFee: number;
  formattedServiceFee: string;
}

// Declare snap type for TypeScript
declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

export default function PointPackages({ packages, company, serviceFee, formattedServiceFee }: Props) {
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (packageId: number) => {
    console.log('Attempting to purchase package:', packageId);
    setPurchasingId(packageId);
    
    try {
      const response = await axios.post('/company/points/purchase', {
        package_id: packageId
      }, {
        headers: {
          'X-Inertia': 'true',
          'X-Inertia-Version': (window as any).Inertia?.version || '',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        }
      });

      if (response.data.success) {
        console.log('Payment created, opening Snap:', response.data.snap_token);
        
        // Open Midtrans Snap popup
        window.snap.pay(response.data.snap_token, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result);
            toast({
              title: 'Pembayaran berhasil! Poin akan ditambahkan ke akun Anda.',
              variant: 'default'
            });
            // Redirect to points dashboard
            router.get('/company/points');
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result);
            toast({
              title: 'Pembayaran sedang diproses. Kami akan mengkonfirmasi pembayaran Anda.'
            });
            router.get('/company/points');
          },
          onError: (result: any) => {
            console.log('Payment error:', result);
            toast({
              title: 'Terjadi kesalahan saat memproses pembayaran.',
              variant: 'destructive'
            });
          },
          onClose: () => {
            console.log('Payment popup closed');
          }
        });
      } else {
        throw new Error(response.data.error || 'Gagal membuat pembayaran');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Terjadi kesalahan saat membeli paket';
      toast({
        title: 'Error: ' + errorMessage,
        variant: 'destructive'
      });
    } finally {
      setPurchasingId(null);
    }
  };

  const getValuePerPoint = (pkg: PointPackage) => {
    if (!pkg.total_points || pkg.total_points === 0 || !pkg.price) {
      return 0;
    }
    return Math.round(pkg.price / pkg.total_points);
  };

  const getBestValue = () => {
    if (packages.length === 0) return null;
    return packages.reduce((best, current) => 
      getValuePerPoint(current) < getValuePerPoint(best) ? current : best
    );
  };

  const bestValue = getBestValue();

  return (
    <AppLayout>
      <Head title="Beli Paket Poin" />
      
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.get('/company/points')}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Poin Saya
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Pilih Paket Poin</h1>
              <p className="text-gray-600">Beli poin untuk posting lowongan pekerjaan</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Poin Saat Ini</p>
              <p className="text-2xl font-bold text-blue-600"><NumberTicker value={company.job_posting_points} className="text-2xl font-bold text-blue-600" delay={0.2} /></p>
            </div>
          </div>
        </div>

        {/* Current Balance Alert */}
        {company.job_posting_points <= 2 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Coins className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">Poin Hampir Habis!</h3>
                  <p className="text-sm text-orange-700">
                    Beli paket poin sekarang untuk melanjutkan posting lowongan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative transition-all hover:shadow-lg ${
                pkg.is_featured ? 'ring-2 ring-blue-500 scale-105' : ''
              } ${bestValue?.id === pkg.id ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Badges */}
              <div className="absolute -top-2 left-4 flex gap-2">
                {pkg.is_featured && (
                  <Badge className="bg-blue-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {bestValue?.id === pkg.id && (
                  <Badge className="bg-green-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Best Value
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-4 pt-6">
                <div className="text-center">
                  <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {pkg.formatted_total_price}
                  </div>
                  {serviceFee > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-center items-center space-x-2">
                        <span>Paket: {pkg.formatted_price}</span>
                      </div>
                      <div className="flex justify-center items-center space-x-2">
                        <span>+ Biaya layanan: {formattedServiceFee}</span>
                      </div>
                      <div className="w-16 h-px bg-gray-300 mx-auto"></div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Points Info */}
                <div className="text-center bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    <NumberTicker value={pkg.total_points} className="text-2xl font-bold text-green-600" delay={0.3} /> Poin
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><NumberTicker value={pkg.points} className="" delay={0.4} /> poin utama</div>
                    {pkg.bonus_points > 0 && (
                      <div className="text-green-600">+ <NumberTicker value={pkg.bonus_points} className="text-green-600" delay={0.5} /> bonus poin</div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Permanent Points Info */}
                <div className="flex items-center gap-2 text-sm text-green-600 pt-2 border-t">
                  <CheckCircle className="h-4 w-4" />
                  <span>Poin tidak akan kadaluarsa</span>
                </div>

                {/* Purchase Button */}
                <Button 
                  onClick={() => handlePurchase(pkg.id)}
                  className="w-full mt-4"
                  size="lg"
                  disabled={!pkg.is_active || purchasingId === pkg.id}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {purchasingId === pkg.id ? 'Memproses...' : pkg.is_active ? 'Beli Sekarang' : 'Tidak Tersedia'}
                </Button>

                {/* Description */}
                <p className="text-xs text-gray-600 text-center">
                  {pkg.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Paket Belum Tersedia</h3>
              <p className="text-gray-600 mb-4">
                Saat ini belum ada paket poin yang tersedia. Silakan hubungi admin untuk informasi lebih lanjut.
              </p>
              <Button 
                variant="outline"
                onClick={() => router.get('/company/points')}
              >
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Service Fee Notice */}
        {serviceFee > 0 && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Informasi Biaya Layanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                Semua harga paket sudah termasuk biaya layanan sebesar <strong>{formattedServiceFee}</strong>.
              </div>
              <div className="text-blue-700">
                ✓ Biaya administrasi dan pemeliharaan sistem<br/>
                ✓ Dukungan teknis 24/7<br/>
                ✓ Keamanan transaksi terjamin
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">💡 Tips Memilih Paket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>Paket Starter:</strong> Cocok untuk perusahaan kecil dengan kebutuhan rekrutmen terbatas.
            </div>
            <div>
              <strong>Paket Business:</strong> Pilihan terpopuler untuk perusahaan menengah dengan rekrutmen rutin.
            </div>
            <div>
              <strong>Paket Enterprise:</strong> Ideal untuk perusahaan besar dengan volume rekrutmen tinggi.
            </div>
            <div>
              <strong>Best Value:</strong> Paket dengan harga per poin termurah memberikan nilai terbaik.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}