import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/layouts/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coins,
  Star,
  Check,
  ArrowRight,
  Zap,
  Crown,
  Building,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { NumberTicker } from '@/components/ui/number-ticker';
import { motion } from 'framer-motion';

interface PointPackage {
  id: number;
  name: string;
  description: string;
  points: number;
  price: number;
  bonus_points: number;
  is_featured: boolean;
  features: string[];
  total_points: number;
  formatted_price: string;
}

interface Props {
  packages: PointPackage[];
}

export default function PointsIndex({ packages }: Props) {
  const benefits = [
    {
      icon: Building,
      title: "Posting Lowongan Unlimited",
      description: "Setiap 1 poin dapat digunakan untuk posting 1 lowongan pekerjaan"
    },
    {
      icon: Users,
      title: "Jangkauan Kandidat Luas",
      description: "Lowongan Anda akan dilihat oleh ribuan pencari kerja aktif"
    },
    {
      icon: TrendingUp,
      title: "Peningkatan Visibilitas",
      description: "Dapatkan lebih banyak aplikasi dengan sistem rekomendasi kami"
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Sistem pembayaran aman dengan berbagai metode payment"
    }
  ];

  const getPopularityBadge = (pkg: PointPackage) => {
    if (pkg.is_featured) {
      return (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
            <Crown className="h-3 w-3 mr-1" />
            Paling Populer
          </Badge>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <Head title="Paket Poin - KarirConnect" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Coins className="h-12 w-12 text-yellow-300" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Paket Poin untuk
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Posting Lowongan
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Pilih paket poin yang sesuai dengan kebutuhan perusahaan Anda. 
                Setiap 1 poin dapat digunakan untuk posting 1 lowongan pekerjaan.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-300" />
                  <span>1 Poin = 1 Lowongan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-300" />
                  <span>Tidak Ada Expired</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-300" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Packages Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilih Paket Yang Tepat
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dapatkan lebih banyak poin dengan harga yang lebih efisien. 
              Semakin besar paket, semakin banyak bonus yang Anda dapatkan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <Card className={`relative h-full transition-all duration-300 hover:shadow-2xl ${
                  pkg.is_featured 
                    ? 'ring-2 ring-yellow-400 shadow-xl scale-105' 
                    : 'hover:scale-105'
                }`}>
                  {getPopularityBadge(pkg)}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-4 rounded-2xl ${
                        pkg.is_featured 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}>
                        {pkg.is_featured ? (
                          <Crown className="h-8 w-8 text-white" />
                        ) : (
                          <Coins className="h-8 w-8 text-white" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gray-900">
                        {pkg.formatted_price}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span>{pkg.points} Poin</span>
                        {pkg.bonus_points > 0 && (
                          <>
                            <span>+</span>
                            <span className="text-green-600 font-medium">
                              {pkg.bonus_points} Bonus
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        Total: <NumberTicker value={pkg.total_points} className="font-semibold" /> Poin
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Yang Anda Dapatkan:</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <Link href="/login">
                        <Button 
                          className={`w-full py-3 text-base font-medium transition-all duration-300 ${
                            pkg.is_featured
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          }`}
                        >
                          Pilih Paket Ini
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mengapa Memilih KarirConnect?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Platform yang tepat untuk menemukan talenta terbaik dengan sistem yang efisien dan terpercaya.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                          <benefit.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <Zap className="h-12 w-12 text-yellow-300" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Siap Mulai Rekrutmen?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan perusahaan yang telah mempercayai KarirConnect 
                untuk menemukan talenta terbaik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium"
                  >
                    Daftar Sekarang
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-medium"
                  >
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}