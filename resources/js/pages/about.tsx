import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { 
    Users, 
    Target, 
    Award, 
    Heart,
    CheckCircle,
    ArrowRight,
    Mail,
    Phone,
    MapPin,
    Globe,
    Star,
    Building2,
    Briefcase,
    Search,
    Shield,
    GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AboutUsData {
    title: string;
    description: string;
    vision: string;
    mission: string;
    values: Array<{
        title: string;
        description: string;
    }>;
    features: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    stats: Array<{
        number: string;
        label: string;
    }>;
    team: Array<{
        name: string;
        position: string;
        description: string;
        image?: string;
    }>;
    contact: {
        email: string;
        phone: string;
        address: string;
        social: {
            linkedin?: string;
            twitter?: string;
            instagram?: string;
        };
    };
    cta_title: string;
    cta_description: string;
}

interface AboutProps {
    aboutUs: AboutUsData;
}

export default function About({ aboutUs }: AboutProps) {
    // Icon mapping for features and values
    const iconMap: { [key: string]: JSX.Element } = {
        'target': <Target className="h-6 w-6 text-white" />,
        'shield-check': <Shield className="h-6 w-6 text-white" />,
        'graduation-cap': <GraduationCap className="h-6 w-6 text-white" />,
        'heart': <Heart className="h-6 w-6 text-white" />,
        'users': <Users className="h-6 w-6 text-white" />,
        'globe': <Globe className="h-6 w-6 text-white" />,
        'award': <Award className="h-6 w-6 text-white" />,
    };

    return (
        <>
            <Head title={`${aboutUs.title} - KarirConnect`} />
            
            <div className="min-h-screen bg-white">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="about" />

                {/* Hero Section */}
                <section className="relative bg-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
                    {/* Flickering Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid 
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(34, 197, 94)"
                            maxOpacity={0.08}
                            flickerChance={0.1}
                        />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            {/* Badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8"
                            >
                                <Building2 className="w-4 h-4 text-[#2347FA]" />
                                <span className="text-[#2347FA] font-semibold text-sm">Platform Karir Terpercaya</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                {aboutUs.title}
                            </motion.h1>
                            
                            {/* Description */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
                            >
                                {aboutUs.description}
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Link href="/jobs">
                                    <Button size="lg" className="bg-[#2347FA] hover:bg-[#3b56fc] text-white font-semibold px-8">
                                        Mulai Cari Kerja
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="/companies">
                                    <Button size="lg" variant="outline" className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white font-semibold px-8">
                                        Lihat Perusahaan
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission, Vision, Values */}
                <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6"
                            >
                                <Award className="w-4 h-4 text-[#2347FA]" />
                                <span className="text-[#2347FA] font-semibold text-sm">Fondasi Kami</span>
                            </motion.div>
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                            >
                                Misi, Visi & Nilai
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            >
                                Fondasi yang kuat mendorong inovasi berkelanjutan. Inilah komitmen kami dalam membangun ekosistem karir yang lebih baik untuk semua.
                            </motion.p>
                        </div>

                        {/* Visi & Misi */}
                        <div className="grid lg:grid-cols-2 gap-8 mb-16">
                            {/* Vision */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="group"
                            >
                                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                                    
                                    <CardContent className="p-8 relative z-10">
                                        <div className="flex items-center mb-6">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                                                <Award className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Visi Kami</h3>
                                                <p className="text-blue-100 text-sm">Pandangan Masa Depan</p>
                                            </div>
                                        </div>
                                        <p className="text-blue-50 leading-relaxed text-lg">{aboutUs.vision}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            {/* Mission */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="group"
                            >
                                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white overflow-hidden relative">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                                    
                                    <CardContent className="p-8 relative z-10">
                                        <div className="flex items-center mb-6">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                                                <Target className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Misi Kami</h3>
                                                <p className="text-emerald-100 text-sm">Tujuan Strategis</p>
                                            </div>
                                        </div>
                                        <p className="text-emerald-50 leading-relaxed text-lg">{aboutUs.mission}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Values */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="text-center mb-12">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h3>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Prinsip-prinsip fundamental yang memandu setiap keputusan dan tindakan kami
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {aboutUs.values && aboutUs.values.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + index * 0.1 }}
                                        className="group"
                                    >
                                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                                            <CardContent className="p-6 text-center">
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#2347FA] to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                                    {iconMap[value.icon] ? (
                                                        iconMap[value.icon]
                                                    ) : (
                                                        <Heart className="h-8 w-8 text-white" />
                                                    )}
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Achievements */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pencapaian Kami</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Angka-angka yang menunjukkan kepercayaan dan kesuksesan platform kami
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {aboutUs.stats && aboutUs.stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl md:text-5xl font-bold text-[#2347FA] mb-2">
                                        {(() => {
                                            const numericValue = parseInt(stat.number.replace(/[^0-9]/g, ''));
                                            const suffix = stat.number.replace(/[0-9]/g, '');
                                            return (
                                                <>
                                                    <NumberTicker value={numericValue} className="text-4xl md:text-5xl font-bold text-[#2347FA]" delay={0.2 + index * 0.1} />
                                                    {suffix}
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 mb-1">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Mengapa Memilih KarirConnect?
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Fitur-fitur unggulan yang membuat kami berbeda dari yang lain
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {aboutUs.features && aboutUs.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl"
                                >
                                    <div className="w-12 h-12 bg-[#2347FA] rounded-lg flex items-center justify-center mb-4">
                                        {iconMap[feature.icon] ? (
                                            iconMap[feature.icon]
                                        ) : (
                                            <Star className="h-6 w-6 text-white" />
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tim Kami</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Dibangun oleh tim berpengalaman yang berdedikasi untuk memberikan yang terbaik
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {aboutUs.team && aboutUs.team.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                        <CardContent className="p-6 text-center">
                                            <Avatar className="w-20 h-20 mx-auto mb-4">
                                                {member.image ? (
                                                    <AvatarImage src={`/storage/${member.image}`} alt={member.name} />
                                                ) : (
                                                    <AvatarFallback className="bg-[#2347FA] text-white text-xl">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {member.name}
                                            </h3>
                                            <p className="text-[#2347FA] font-medium mb-3">
                                                {member.position}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {member.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="py-20 bg-gray-50 relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full opacity-20 blur-3xl"></div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 rounded-full px-6 py-3 mb-6"
                            >
                                <Mail className="w-4 h-4 text-[#2347FA]" />
                                <span className="text-[#2347FA] font-semibold text-sm">Mari Terhubung</span>
                            </motion.div>
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                            >
                                Hubungi Kami
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            >
                                Ada pertanyaan, ingin bermitra, atau butuh bantuan? Tim kami siap membantu Anda 24/7. 
                                Jangan ragu untuk menghubungi kami melalui berbagai channel yang tersedia.
                            </motion.p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {/* Email Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="group"
                            >
                                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                                    
                                    <CardContent className="p-8 text-center relative z-10">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">Email</h3>
                                        <p className="text-blue-100 text-sm mb-4">Kirim pesan kapan saja</p>
                                        <div className="space-y-2">
                                            {Array.isArray(aboutUs.contact.email) ? (
                                                aboutUs.contact.email.map((email, index) => (
                                                    <a key={index} href={`mailto:${email}`} className="block text-white hover:text-blue-200 transition-colors font-medium">
                                                        {email}
                                                    </a>
                                                ))
                                            ) : (
                                                <a href={`mailto:${aboutUs.contact.email}`} className="block text-white hover:text-blue-200 transition-colors font-medium">
                                                    {aboutUs.contact.email}
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Phone Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="group"
                            >
                                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white overflow-hidden relative">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                                    
                                    <CardContent className="p-8 text-center relative z-10">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <Phone className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">Telepon</h3>
                                        <p className="text-emerald-100 text-sm mb-4">Hubungi langsung tim kami</p>
                                        <div className="space-y-2">
                                            {Array.isArray(aboutUs.contact.phone) ? (
                                                aboutUs.contact.phone.map((phone, index) => (
                                                    <a key={index} href={`tel:${phone}`} className="block text-white hover:text-emerald-200 transition-colors font-medium">
                                                        {phone}
                                                    </a>
                                                ))
                                            ) : (
                                                <a href={`tel:${aboutUs.contact.phone}`} className="block text-white hover:text-emerald-200 transition-colors font-medium">
                                                    {aboutUs.contact.phone}
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Address Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="group"
                            >
                                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-gradient-to-br from-purple-600 to-indigo-700 text-white overflow-hidden relative">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                                    
                                    <CardContent className="p-8 text-center relative z-10">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <MapPin className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">Lokasi</h3>
                                        <p className="text-purple-100 text-sm mb-4">Kunjungi kantor kami</p>
                                        <div className="space-y-2">
                                            {Array.isArray(aboutUs.contact.address) ? (
                                                aboutUs.contact.address.map((addr, index) => (
                                                    <p key={index} className="text-white font-medium">
                                                        {addr}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="text-white font-medium">
                                                    {aboutUs.contact.address}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                                <div className="max-w-3xl mx-auto">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#2347FA] to-indigo-600 rounded-2xl flex items-center justify-center">
                                            <CheckCircle className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                        Siap Memulai Perjalanan Karir Anda?
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                        Tim support kami tersedia 24/7 untuk membantu Anda. Dari pertanyaan umum hingga partnership bisnis, 
                                        kami berkomitmen memberikan respon cepat dan solusi terbaik.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link href="/register">
                                            <Button size="lg" className="bg-[#2347FA] hover:bg-[#3b56fc] text-white font-semibold px-8">
                                                Mulai Sekarang
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </Link>
                                        <Link href="/jobs">
                                            <Button size="lg" variant="outline" className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white font-semibold px-8">
                                                Lihat Lowongan
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden py-20 bg-gradient-to-br from-[#2347FA] via-[#3b56fc] to-indigo-700">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-white/10 backdrop-blur-sm"></div>
                    <div className="absolute right-10 bottom-20 h-16 w-16 animate-bounce rounded-full bg-blue-300/20 backdrop-blur-sm"></div>
                    <div className="absolute top-1/2 left-1/4 h-3 w-3 animate-ping rounded-full bg-blue-200/30"></div>
                    <div className="absolute bottom-1/3 right-1/3 h-8 w-8 animate-pulse rounded-full bg-white/5 backdrop-blur-sm"></div>

                    <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-300/30 bg-blue-100/10 px-6 py-2 backdrop-blur-sm"
                        >
                            <div className="h-2 w-2 rounded-full bg-blue-300 animate-pulse"></div>
                            <span className="text-sm font-medium text-blue-100">Bergabunglah Sekarang</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
                        >
                            {aboutUs.cta_title}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
                        >
                            {aboutUs.cta_description}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                        >
                            <Link href="/register">
                                <Button 
                                    size="lg" 
                                    className="group relative overflow-hidden bg-white text-[#2347FA] hover:bg-blue-50 font-semibold px-8 py-4 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Daftar Sekarang Gratis
                                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Button>
                            </Link>
                            <Link href="/jobs">
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 font-semibold px-8 py-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                                >
                                    <Search className="mr-2 w-5 h-5" />
                                    Jelajahi Lowongan
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/20 pt-8"
                        >
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">10K+</div>
                                <div className="text-sm text-blue-200">Lowongan Aktif</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">1K+</div>
                                <div className="text-sm text-blue-200">Perusahaan Partner</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">95%</div>
                                <div className="text-sm text-blue-200">Tingkat Kepuasan</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Modern Footer */}
                <ModernFooter />
            </div>
        </>
    );
}