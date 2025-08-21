import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { 
    Building2,
    Users,
    TrendingUp,
    Target,
    Zap,
    CheckCircle,
    ArrowRight,
    Briefcase,
    UserPlus,
    BarChart3,
    Shield,
    Clock,
    Globe,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CompanyIndex() {
    const features = [
        {
            icon: Users,
            title: "Jangkauan Kandidat Luas",
            description: "Akses ke ribuan kandidat berkualitas dari berbagai latar belakang dan keahlian",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Target,
            title: "Targeting Tepat Sasaran",
            description: "Filter dan cari kandidat berdasarkan skill, pengalaman, dan kriteria spesifik",
            color: "from-green-500 to-green-600"
        },
        {
            icon: BarChart3,
            title: "Dashboard Analytics",
            description: "Pantau performa posting lowongan dengan analytics dan insights mendalam",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Zap,
            title: "Posting Cepat & Mudah",
            description: "Interface yang intuitif untuk posting lowongan dalam hitungan menit",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: Shield,
            title: "Verifikasi Perusahaan",
            description: "Dapatkan badge verifikasi untuk meningkatkan kredibilitas perusahaan",
            color: "from-indigo-500 to-indigo-600"
        },
        {
            icon: Clock,
            title: "Manajemen Aplikasi",
            description: "Kelola dan review aplikasi kandidat dengan tools yang powerful",
            color: "from-red-500 to-red-600"
        }
    ];

    const pricing = [
        {
            name: "Starter",
            price: "Gratis",
            period: "selamanya",
            description: "Cocok untuk startup dan perusahaan kecil",
            features: [
                "1 lowongan aktif",
                "Basic applicant tracking",
                "Email support",
                "Company profile"
            ],
            popular: false,
            buttonText: "Mulai Gratis",
            buttonVariant: "outline" as const
        },
        {
            name: "Professional",
            price: "299K",
            period: "per bulan",
            description: "Ideal untuk perusahaan berkembang",
            features: [
                "10 lowongan aktif",
                "Advanced filtering",
                "Priority support",
                "Analytics dashboard",
                "Company verification",
                "Featured job posts"
            ],
            popular: true,
            buttonText: "Upgrade Sekarang",
            buttonVariant: "default" as const
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "per bulan",
            description: "Untuk perusahaan besar dan kebutuhan khusus",
            features: [
                "Unlimited job posts",
                "Dedicated account manager",
                "Custom integrations",
                "White-label solution",
                "API access",
                "Custom reporting"
            ],
            popular: false,
            buttonText: "Hubungi Sales",
            buttonVariant: "outline" as const
        }
    ];

    const stats = [
        { number: 50, suffix: "K+", label: "Kandidat Aktif", icon: Users },
        { number: 5, suffix: "K+", label: "Perusahaan Partner", icon: Building2 },
        { number: 95, suffix: "%", label: "Success Rate", icon: TrendingUp },
        { number: 24, suffix: "/7", label: "Customer Support", icon: Clock }
    ];

    return (
        <>
            <Head title="Untuk Perusahaan - Temukan Talenta Terbaik" />
            
            <div className="min-h-screen bg-gray-50">
                <ModernNavbar currentPage="companies" />

                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid 
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(99, 102, 241)"
                            maxOpacity={0.05}
                            flickerChance={0.08}
                        />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-full px-6 py-3 mb-8 shadow-sm"
                            >
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                <span className="text-indigo-700 font-semibold text-sm">Platform Rekrutmen #1 di Indonesia</span>
                            </motion.div>
                            
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                Temukan <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Talenta Terbaik</span><br className="hidden sm:block" />
                                <span className="sm:hidden"> </span>Untuk Perusahaan Anda
                            </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-base sm:text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4"
                            >
                                Bergabung dengan <span className="font-semibold text-gray-900">5.000+</span> perusahaan yang telah mempercayai platform kami untuk menemukan kandidat terbaik dan membangun tim yang solid.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                            >
                                <Link href="/register">
                                    <Button size="lg" className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg transform transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Daftar Gratis
                                    </Button>
                                </Link>
                                <Link href="/companies">
                                    <Button variant="outline" size="lg" className="border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA] transition-all duration-300 px-8 py-4 text-lg">
                                        <Search className="w-5 h-5 mr-2" />
                                        Lihat Perusahaan
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 + (index * 0.1) }}
                                    className="text-center"
                                >
                                    <stat.icon className="w-8 h-8 text-[#2347FA] mx-auto mb-3" />
                                    <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                                        <NumberTicker 
                                            value={stat.number} 
                                            className="text-2xl lg:text-3xl font-bold text-gray-900" 
                                            delay={0.3 + (index * 0.1)} 
                                        />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Mengapa Perusahaan Memilih Kami?
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Platform komprehensif dengan fitur-fitur canggih untuk memudahkan proses rekrutmen
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                                        <CardContent className="p-8">
                                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shadow-lg`}>
                                                <feature.icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Pilih Paket Yang Sesuai
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Mulai dari gratis hingga solusi enterprise, kami punya paket untuk setiap kebutuhan
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {pricing.map((plan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
                                >
                                    <Card className={`hover:shadow-2xl transition-all duration-300 border-0 shadow-lg h-full ${
                                        plan.popular 
                                            ? 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 ring-2 ring-indigo-200' 
                                            : 'bg-white'
                                    }`}>
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <Badge className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1 shadow-lg">
                                                    Paling Populer
                                                </Badge>
                                            </div>
                                        )}
                                        <CardHeader className="text-center pb-8">
                                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                                            <div className="mb-2">
                                                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                                {plan.period && <span className="text-gray-600 ml-2">/{plan.period}</span>}
                                            </div>
                                            <p className="text-gray-600">{plan.description}</p>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-center">
                                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                        <span className="text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <Link href="/register" className="block">
                                                <Button 
                                                    variant={plan.buttonVariant}
                                                    className={`w-full py-3 ${
                                                        plan.popular 
                                                            ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg' 
                                                            : ''
                                                    }`}
                                                >
                                                    {plan.buttonText}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-[#2347FA] to-[#3b56fc]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Siap Membangun Tim Impian?
                            </h2>
                            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                                Bergabunglah dengan ribuan perusahaan yang telah menemukan talenta terbaik melalui platform kami
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href="/register">
                                    <Button size="lg" className="bg-white text-[#2347FA] hover:bg-gray-100 shadow-lg transform transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Mulai Rekrut Sekarang
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#2347FA] transition-all duration-300 px-8 py-4 text-lg">
                                        <Globe className="w-5 h-5 mr-2" />
                                        Hubungi Sales
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <ModernFooter />
            </div>
        </>
    );
}