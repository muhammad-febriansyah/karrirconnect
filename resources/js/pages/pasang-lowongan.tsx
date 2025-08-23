import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { type SharedData } from '@/types';
import {
  ArrowRight,
  Building,
  CheckCircle,
  Coins,
  CreditCard,
  Globe,
  Heart,
  Shield,
  Star,
  Target,
  Users,
  Zap,
  Briefcase,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  DollarSign,
  Eye,
  UserPlus,
  Search,
  MapPin
} from 'lucide-react';

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

interface Statistics {
  total_jobs: number;
  total_companies: number;
  total_candidates: number;
}

interface Settings {
  site_name: string;
  description: string;
  logo: string | null;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
}

interface Props {
  pointPackages: PointPackage[];
  statistics: Statistics;
  settings: Settings;
}

export default function PasangLowongan({ pointPackages, statistics, settings }: Props) {
  const { auth } = usePage<SharedData>().props;
  
  // Get site info from settings with fallbacks
  const siteName = settings?.site_name || 'KarirConnect';
  const siteDescription = settings?.description || 'Platform karir terpercaya yang menghubungkan talenta dengan peluang terbaik';

  const benefits = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Jangkau Talenta Terbaik",
      description: "Akses ke database 100,000+ profesional berpengalaman di seluruh Indonesia"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Proses Cepat & Mudah",
      description: "Posting lowongan hanya dalam 5 menit dengan sistem yang user-friendly"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Kandidat Terverifikasi",
      description: "Semua profil kandidat telah melalui proses verifikasi untuk kualitas terjamin"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Analytics Mendalam",
      description: "Pantau performa lowongan dengan analitik real-time dan insights mendalam"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Daftar & Verifikasi",
      description: "Buat akun perusahaan dan verifikasi data perusahaan Anda",
      icon: <UserPlus className="h-6 w-6" />
    },
    {
      number: "02", 
      title: "Beli Paket Poin",
      description: "Pilih paket poin yang sesuai dengan kebutuhan rekrutmen Anda",
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      number: "03",
      title: "Posting Lowongan",
      description: "Buat dan publikasikan lowongan kerja dengan menggunakan 1 poin per posting",
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      number: "04",
      title: "Terima Lamaran",
      description: "Kelola lamaran masuk dan temukan kandidat terbaik untuk perusahaan Anda",
      icon: <Users className="h-6 w-6" />
    }
  ];

  const faqs = [
    {
      question: "Berapa biaya untuk posting lowongan?",
      answer: "Setiap posting lowongan membutuhkan 1 poin. Anda dapat membeli paket poin dengan harga mulai dari Rp 50.000 untuk 5 poin."
    },
    {
      question: "Apakah ada durasi posting lowongan?",
      answer: "Lowongan yang dipublikasikan akan aktif selama 30 hari atau hingga posisi terisi, mana yang lebih dulu."
    },
    {
      question: "Bisakah saya mengedit lowongan setelah dipublikasikan?",
      answer: "Ya, Anda dapat mengedit informasi lowongan kapan saja tanpa biaya tambahan selama masih dalam periode aktif."
    },
    {
      question: "Bagaimana cara melihat kandidat yang melamar?",
      answer: "Semua lamaran akan masuk ke dashboard perusahaan Anda. Anda dapat melihat profil lengkap, CV, dan mengelola status lamaran."
    }
  ];

  return (
    <>
      <Head title="Pasang Lowongan - Temukan Talenta Terbaik" />
      
      <div className="relative min-h-screen bg-white">
        {/* Modern Navbar */}
        <ModernNavbar currentPage="pasang-lowongan" />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-40 lg:pb-24">
          {/* Flickering Grid Background */}
          <div className="absolute inset-0 z-0">
            <FlickeringGrid
              className="h-full w-full"
              squareSize={4}
              gridGap={6}
              color="rgb(59, 130, 246)"
              maxOpacity={0.1}
              flickerChance={0.1}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl"></div>
          <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-400/15 blur-lg"></div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 backdrop-blur-sm"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                <Building className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Untuk Perusahaan & HR</span>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl"
              >
                Pasang <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Lowongan</span>
                <br />
                Temukan Talenta Terbaik
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600"
              >
                Platform rekrutmen terpercaya dengan akses ke {statistics.total_candidates.toLocaleString()}+ profesional berkualitas. 
                Sistem poin yang fleksibel, mulai dari Rp 10.000 per lowongan.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col justify-center gap-4 sm:flex-row"
              >
                {auth ? (
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
                    <Link href="/company/jobs/create" className="flex items-center">
                      Mulai Posting Lowongan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
                    <Link href="/register?type=company" className="flex items-center">
                      Daftar Sekarang Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4">
                  <Link href="#packages" className="flex items-center">
                    Lihat Paket Harga
                    <Eye className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-900">
                  <NumberTicker value={statistics.total_jobs} className="text-3xl font-bold text-gray-900" />+
                </div>
                <div className="text-gray-600">Lowongan Aktif</div>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-900">
                  <NumberTicker value={statistics.total_companies} className="text-3xl font-bold text-gray-900" />+
                </div>
                <div className="text-gray-600">Perusahaan Partner</div>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-900">
                  <NumberTicker value={statistics.total_candidates} className="text-3xl font-bold text-gray-900" />+
                </div>
                <div className="text-gray-600">Kandidat Terdaftar</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Mengapa Memilih Platform Kami?
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Dapatkan akses ke talenta terbaik dengan sistem yang terpercaya dan fitur lengkap
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                    {benefit.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="packages" className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Paket Poin Fleksibel
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Pilih paket yang sesuai dengan kebutuhan rekrutmen perusahaan Anda
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pointPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative h-full ${pkg.is_featured ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                    {pkg.is_featured && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Terpopuler
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-blue-600">{pkg.formatted_price}</span>
                        <div className="mt-2 text-sm text-gray-500">
                          ~Rp {Math.round(pkg.price / pkg.total_points).toLocaleString()} per lowongan
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{pkg.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Poin Dasar</span>
                          <span className="font-semibold">{pkg.points} poin</span>
                        </div>
                        {pkg.bonus_points > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Bonus Poin</span>
                            <span className="font-semibold text-green-600">+{pkg.bonus_points} poin</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between border-t pt-3">
                          <span className="text-sm font-medium">Total Poin</span>
                          <span className="text-lg font-bold text-blue-600">{pkg.total_points} poin</span>
                        </div>
                      </div>

                      {pkg.features && pkg.features.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">Fitur Termasuk:</div>
                          <ul className="space-y-1">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button 
                        className={`w-full mt-6 ${pkg.is_featured 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        {auth ? (
                          <Link href="/company/points/packages" className="flex items-center w-full justify-center">
                            Beli Paket Ini
                            <CreditCard className="ml-2 h-4 w-4" />
                          </Link>
                        ) : (
                          <Link href="/register?type=company" className="flex items-center w-full justify-center">
                            Mulai Sekarang
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Cara Memulai
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Langkah mudah untuk mulai merekrut talenta terbaik
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-gray-300 mx-auto" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Pertanyaan Umum
              </h2>
              <p className="text-lg text-gray-600">
                Jawaban untuk pertanyaan yang sering diajukan
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Siap Temukan Talenta Terbaik?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
                Bergabunglah dengan {statistics.total_companies.toLocaleString()}+ perusahaan yang telah mempercayai platform kami
              </p>
              
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                {auth ? (
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4">
                    <Link href="/company/jobs/create" className="flex items-center">
                      Mulai Posting Lowongan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4">
                    <Link href="/register?type=company" className="flex items-center">
                      Daftar Gratis Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 px-8 py-4">
                  <Link href="/contact" className="flex items-center">
                    Hubungi Kami
                    <Building className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Modern Footer */}
        <ModernFooter siteName={siteName} siteDescription={siteDescription} statistics={statistics} settings={settings} />
      </div>
    </>
  );
}