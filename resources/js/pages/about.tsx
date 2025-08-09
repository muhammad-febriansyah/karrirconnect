import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { 
    Building2, 
    Users, 
    Target, 
    Heart, 
    Award, 
    Globe,
    CheckCircle,
    ArrowRight,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

export default function About() {
    const stats = [
        {
            icon: <Building2 className="h-8 w-8 text-blue-600" />,
            number: "1000+",
            label: "Perusahaan Terdaftar"
        },
        {
            icon: <Users className="h-8 w-8 text-green-600" />,
            number: "50K+",
            label: "Pencari Kerja Aktif"
        },
        {
            icon: <Target className="h-8 w-8 text-purple-600" />,
            number: "25K+",
            label: "Lowongan Pekerjaan"
        },
        {
            icon: <Award className="h-8 w-8 text-orange-600" />,
            number: "15K+",
            label: "Berhasil Ditempatkan"
        }
    ];

    const values = [
        {
            icon: <Heart className="h-6 w-6 text-red-500" />,
            title: "Kepedulian",
            description: "Kami peduli dengan masa depan karir setiap individu dan kesuksesan setiap perusahaan."
        },
        {
            icon: <Users className="h-6 w-6 text-blue-500" />,
            title: "Kolaborasi",
            description: "Membangun jembatan antara talenta terbaik dengan perusahaan yang tepat."
        },
        {
            icon: <Target className="h-6 w-6 text-green-500" />,
            title: "Fokus Hasil",
            description: "Berkomitmen memberikan hasil terbaik untuk pencari kerja dan perekrut."
        },
        {
            icon: <Globe className="h-6 w-6 text-purple-500" />,
            title: "Inovasi",
            description: "Menggunakan teknologi terdepan untuk memberikan pengalaman yang luar biasa."
        }
    ];

    const features = [
        "Pencarian kerja yang mudah dan cepat",
        "Profile perusahaan yang lengkap",
        "Sistem aplikasi yang terintegrasi",
        "Notifikasi lowongan terbaru",
        "Analytics untuk perekrut",
        "Dukungan customer service 24/7"
    ];

    const team = [
        {
            name: "Ahmad Ramadhani",
            position: "CEO & Founder",
            bio: "Berpengalaman 15 tahun dalam industri HR dan teknologi.",
            image: "/images/team/ceo.jpg"
        },
        {
            name: "Sari Wijayanti",
            position: "CTO",
            bio: "Expert dalam pengembangan platform digital dan AI.",
            image: "/images/team/cto.jpg"
        },
        {
            name: "Budi Santoso",
            position: "Head of Business Development",
            bio: "Spesialis dalam pengembangan kemitraan strategis.",
            image: "/images/team/bd.jpg"
        }
    ];

    return (
        <>
            <Head title="Tentang Kami" />

            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Navigation */}
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-8 w-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900">KarirConnect</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => router.get('/')}
                                >
                                    Beranda
                                </Button>
                                <Button 
                                    onClick={() => router.get('/login')}
                                >
                                    Masuk
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Tentang <span className="text-blue-600">KarirConnect</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Platform job fair digital terdepan di Indonesia yang menghubungkan talenta terbaik 
                            dengan perusahaan berkualitas untuk menciptakan masa depan karir yang gemilang.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" onClick={() => router.get('/register')}>
                                Bergabung Sekarang
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="lg">
                                Pelajari Lebih Lanjut
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <Card key={index} className="text-center border-0 shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex justify-center mb-4">
                                            {stat.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {stat.number}
                                        </h3>
                                        <p className="text-gray-600">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Target className="h-8 w-8 text-blue-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Visi Kami</h2>
                                    </div>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        Menjadi platform job fair digital nomor satu di Indonesia yang menjembatani 
                                        talenta terbaik dengan perusahaan berkualitas, menciptakan ekosistem karir 
                                        yang berkelanjutan dan berdampak positif bagi kemajuan bangsa.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Heart className="h-8 w-8 text-red-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Misi Kami</h2>
                                    </div>
                                    <ul className="space-y-4 text-lg text-gray-700">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Menyediakan akses mudah ke peluang karir berkualitas</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Membantu perusahaan menemukan talenta yang tepat</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Memberikan pengalaman job fair yang inovatif</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
                            <p className="text-xl text-gray-600">Prinsip yang memandu setiap langkah perjalanan kami</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="p-6 text-center">
                                        <div className="flex justify-center mb-4">
                                            {value.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mengapa Pilih KarirConnect?</h2>
                            <p className="text-xl text-gray-600">Fitur-fitur unggulan yang membuat kami berbeda</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tim Kami</h2>
                            <p className="text-xl text-gray-600">Orang-orang hebat di balik KarirConnect</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <Card key={index} className="border-0 shadow-lg text-center">
                                    <CardContent className="p-8">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                            <Users className="h-12 w-12 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {member.name}
                                        </h3>
                                        <p className="text-blue-600 font-medium mb-3">
                                            {member.position}
                                        </p>
                                        <p className="text-gray-600">
                                            {member.bio}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
                            <p className="text-xl text-gray-600">Punya pertanyaan? Kami siap membantu Anda</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="border-0 shadow-lg text-center">
                                <CardContent className="p-8">
                                    <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                                    <p className="text-gray-600">info@karirconnect.id</p>
                                    <p className="text-gray-600">support@karirconnect.id</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="border-0 shadow-lg text-center">
                                <CardContent className="p-8">
                                    <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Telepon</h3>
                                    <p className="text-gray-600">+62 21 1234 5678</p>
                                    <p className="text-gray-600">+62 811 2345 6789</p>
                                </CardContent>
                            </Card>
                            
                            <Card className="border-0 shadow-lg text-center">
                                <CardContent className="p-8">
                                    <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Alamat</h3>
                                    <p className="text-gray-600">Jl. Sudirman No. 123</p>
                                    <p className="text-gray-600">Jakarta Pusat, 10220</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 bg-blue-600">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Siap Memulai Perjalanan Karir Anda?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Bergabunglah dengan ribuan profesional dan perusahaan yang telah mempercayai KarirConnect
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button 
                                size="lg" 
                                variant="secondary"
                                onClick={() => router.get('/register')}
                            >
                                Daftar Sekarang
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline"
                                className="text-white border-white hover:bg-white hover:text-blue-600"
                            >
                                Jelajahi Lowongan
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Building2 className="h-8 w-8 text-blue-400" />
                            <span className="text-2xl font-bold">KarirConnect</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Platform job fair digital terpercaya untuk masa depan karir yang gemilang
                        </p>
                        <div className="flex justify-center gap-6 text-sm text-gray-400">
                            <span>© 2025 KarirConnect. All rights reserved.</span>
                            <span>|</span>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <span>|</span>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}