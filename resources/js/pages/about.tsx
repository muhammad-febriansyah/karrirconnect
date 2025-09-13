import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import ModernFooter from '@/components/modern-footer';
import ModernNavbar from '@/components/modern-navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Award,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    Camera,
    CheckCircle,
    Clock,
    Code,
    Coffee,
    Settings,
    Compass,
    Crown,
    Database,
    Diamond,
    Eye,
    Gem,
    Gift,
    Globe,
    GraduationCap,
    Handshake,
    Heart,
    Home,
    Infinity as InfinityIcon,
    Key,
    Laptop,
    Leaf,
    Lightbulb,
    Lock,
    Mail,
    MapPin,
    Megaphone,
    MessageCircle,
    Music,
    Palette,
    Phone,
    Puzzle,
    Rocket,
    Search,
    Shield,
    Smartphone,
    Smile,
    Sparkles,
    Star,
    Sun,
    Target,
    ThumbsUp,
    TrendingUp,
    Trophy,
    Users,
    Wifi,
    Wrench,
    Zap,
} from 'lucide-react';

interface AboutUsData {
    title: string;
    description: string;
    vision: string;
    mission: string;
    values: Array<{
        title: string;
        description: string;
        image?: string;
        icon?: string;
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
    // Icon mapping for features and values (dari lucide.dev)
    const iconMap: { [key: string]: React.JSX.Element } = {
        // Core Business Values
        handshake: <Handshake className="h-8 w-8 text-white" />,
        heart: <Heart className="h-8 w-8 text-white" />,
        lightbulb: <Lightbulb className="h-8 w-8 text-white" />,
        trophy: <Trophy className="h-8 w-8 text-white" />,
        shield: <Shield className="h-8 w-8 text-white" />,
        target: <Target className="h-8 w-8 text-white" />,
        users: <Users className="h-8 w-8 text-white" />,
        globe: <Globe className="h-8 w-8 text-white" />,
        search: <Search className="h-8 w-8 text-white" />,

        // Leadership & Excellence
        crown: <Crown className="h-8 w-8 text-white" />,
        award: <Award className="h-8 w-8 text-white" />,
        star: <Star className="h-8 w-8 text-white" />,
        diamond: <Diamond className="h-8 w-8 text-white" />,
        gem: <Gem className="h-8 w-8 text-white" />,

        // Innovation & Growth
        rocket: <Rocket className="h-8 w-8 text-white" />,
        zap: <Zap className="h-8 w-8 text-white" />,
        sparkles: <Sparkles className="h-8 w-8 text-white" />,
        'trending-up': <TrendingUp className="h-8 w-8 text-white" />,
        infinity: <InfinityIcon className="h-8 w-8 text-white" />,

        // Vision & Direction
        eye: <Eye className="h-8 w-8 text-white" />,
        compass: <Compass className="h-8 w-8 text-white" />,

        // Quality & Trust
        'check-circle': <CheckCircle className="h-8 w-8 text-white" />,
        'thumbs-up': <ThumbsUp className="h-8 w-8 text-white" />,
        key: <Key className="h-8 w-8 text-white" />,
        lock: <Lock className="h-8 w-8 text-white" />,

        // Communication & Service
        megaphone: <Megaphone className="h-8 w-8 text-white" />,
        'message-circle': <MessageCircle className="h-8 w-8 text-white" />,
        smile: <Smile className="h-8 w-8 text-white" />,

        // Environment & Sustainability
        leaf: <Leaf className="h-8 w-8 text-white" />,
        sun: <Sun className="h-8 w-8 text-white" />,

        // Work & Professional
        briefcase: <Briefcase className="h-8 w-8 text-white" />,
        calendar: <Calendar className="h-8 w-8 text-white" />,
        clock: <Clock className="h-8 w-8 text-white" />,
        puzzle: <Puzzle className="h-8 w-8 text-white" />,

        // Technology & Innovation
        code: <Code className="h-8 w-8 text-white" />,
        database: <Database className="h-8 w-8 text-white" />,
        wifi: <Wifi className="h-8 w-8 text-white" />,
        smartphone: <Smartphone className="h-8 w-8 text-white" />,
        laptop: <Laptop className="h-8 w-8 text-white" />,

        // Tools & Support
        settings: <Settings className="h-8 w-8 text-white" />,
        cog: <Settings className="h-8 w-8 text-white" />,
        wrench: <Wrench className="h-8 w-8 text-white" />,

        // Creativity & Culture
        palette: <Palette className="h-8 w-8 text-white" />,
        camera: <Camera className="h-8 w-8 text-white" />,
        music: <Music className="h-8 w-8 text-white" />,
        'book-open': <BookOpen className="h-8 w-8 text-white" />,

        // Comfort & Lifestyle
        coffee: <Coffee className="h-8 w-8 text-white" />,
        gift: <Gift className="h-8 w-8 text-white" />,
        home: <Home className="h-8 w-8 text-white" />,

        // Legacy icons (for backward compatibility)
        'shield-check': <Shield className="h-8 w-8 text-white" />,
        'graduation-cap': <GraduationCap className="h-8 w-8 text-white" />,
        'building-2': <Building2 className="h-8 w-8 text-white" />,
    };

    return (
        <>
            <Head title={`${aboutUs.title} - KarirConnect`} />

            <div className="min-h-screen bg-white">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="about" />

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-40 lg:pb-20">
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

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3"
                            >
                                <Building2 className="h-4 w-4 text-[#2347FA]" />
                                <span className="text-sm font-semibold text-[#2347FA]">Platform Karir Terpercaya</span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl"
                            >
                                {aboutUs.title}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mb-8 text-lg leading-relaxed text-gray-600 md:text-xl"
                            >
                                {aboutUs.description}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-col justify-center gap-4 sm:flex-row"
                            >
                                <Link href="/jobs">
                                    <Button size="lg" className="bg-[#2347FA] px-8 font-semibold text-white hover:bg-[#3b56fc]">
                                        Mulai Cari Kerja
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/companies">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-[#2347FA] px-8 font-semibold text-[#2347FA] hover:bg-[#2347FA] hover:text-white"
                                    >
                                        Lihat Perusahaan
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission, Vision, Values */}
                <section className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-100 px-6 py-3"
                            >
                                <Award className="h-4 w-4 text-[#2347FA]" />
                                <span className="text-sm font-semibold text-[#2347FA]">Fondasi Kami</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl"
                            >
                                Misi, Visi & Nilai
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600"
                            >
                                Fondasi yang kuat mendorong inovasi berkelanjutan. Inilah komitmen kami dalam membangun ekosistem karir yang lebih
                                baik untuk semua.
                            </motion.p>
                        </div>

                        {/* Visi & Misi */}
                        <div className="mb-16 grid gap-8 lg:grid-cols-2">
                            {/* Vision */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="group"
                            >
                                <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 hover:shadow-2xl">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                                    <CardContent className="relative z-10 p-8">
                                        <div className="mb-6 flex items-center">
                                            <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                                <Award className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Visi Kami</h3>
                                                <p className="text-sm text-blue-100">Pandangan Masa Depan</p>
                                            </div>
                                        </div>
                                        <p className="text-lg leading-relaxed text-blue-50">{aboutUs.vision}</p>
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
                                <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 hover:shadow-2xl">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                                    <CardContent className="relative z-10 p-8">
                                        <div className="mb-6 flex items-center">
                                            <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                                <Target className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">Misi Kami</h3>
                                                <p className="text-sm text-emerald-100">Tujuan Strategis</p>
                                            </div>
                                        </div>
                                        <p className="text-lg leading-relaxed text-emerald-50">{aboutUs.mission}</p>
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
                            <div className="mb-12 text-center">
                                <h3 className="mb-4 text-3xl font-bold text-gray-900">Nilai-Nilai Kami</h3>
                                <p className="mx-auto max-w-2xl text-gray-600">
                                    Prinsip-prinsip fundamental yang memandu setiap keputusan dan tindakan kami
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {aboutUs.values &&
                                    aboutUs.values.map((value, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className="group"
                                        >
                                            <Card className="h-full border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 hover:shadow-xl">
                                                <CardContent className="p-6 text-center">
                                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2347FA] to-indigo-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                                                        {value.icon && iconMap[value.icon] ? (
                                                            iconMap[value.icon]
                                                        ) : value.image ? (
                                                            <img
                                                                src={`/storage/${value.image}`}
                                                                alt={value.title}
                                                                className="h-8 w-8 object-contain"
                                                            />
                                                        ) : (
                                                            <Heart className="h-8 w-8 text-white" />
                                                        )}
                                                    </div>
                                                    <h4 className="mb-3 text-lg font-bold text-gray-900">{value.title}</h4>
                                                    <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Achievements */}
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">Pencapaian Kami</h2>
                            <p className="mx-auto max-w-2xl text-gray-600">Angka-angka yang menunjukkan kepercayaan dan kesuksesan platform kami</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {aboutUs.stats &&
                                aboutUs.stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="mb-2 text-4xl font-bold text-[#2347FA] md:text-5xl">
                                            {(() => {
                                                const numericValue = parseInt(stat.number.replace(/[^0-9]/g, ''));
                                                const suffix = stat.number.replace(/[0-9]/g, '');
                                                return (
                                                    <>
                                                        <NumberTicker
                                                            value={numericValue}
                                                            className="text-4xl font-bold text-[#2347FA] md:text-5xl"
                                                            delay={0.2 + index * 0.1}
                                                        />
                                                        {suffix}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                        <div className="mb-1 text-lg font-semibold text-gray-900">{stat.label}</div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">Mengapa Memilih KarirConnect?</h2>
                            <p className="mx-auto max-w-2xl text-gray-600">Fitur-fitur unggulan yang membuat kami berbeda dari yang lain</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {aboutUs.features &&
                                aboutUs.features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2347FA]">
                                            {feature.icon && iconMap[feature.icon] ? iconMap[feature.icon] : <Star className="h-6 w-6 text-white" />}
                                        </div>
                                        <h3 className="mb-2 font-semibold text-gray-900">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900">Tim Kami</h2>
                            <p className="mx-auto max-w-2xl text-gray-600">
                                Dibangun oleh tim berpengalaman yang berdedikasi untuk memberikan yang terbaik
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {aboutUs.team &&
                                aboutUs.team.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-0 shadow-lg transition-shadow hover:shadow-xl">
                                            <CardContent className="p-6 text-center">
                                                <Avatar className="mx-auto mb-4 h-20 w-20">
                                                    {member.image ? (
                                                        <AvatarImage src={`/storage/${member.image}`} alt={member.name} />
                                                    ) : (
                                                        <AvatarFallback className="bg-[#2347FA] text-xl text-white">
                                                            {member.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <h3 className="mb-1 text-lg font-semibold text-gray-900">{member.name}</h3>
                                                <p className="mb-3 font-medium text-[#2347FA]">{member.position}</p>
                                                <p className="text-sm text-gray-600">{member.description}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="relative overflow-hidden bg-gray-50 py-20">
                    {/* Background decorative elements */}
                    <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-blue-100 opacity-40 blur-xl"></div>
                    <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-indigo-100 opacity-30 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 opacity-20 blur-3xl"></div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-100 px-6 py-3"
                            >
                                <Mail className="h-4 w-4 text-[#2347FA]" />
                                <span className="text-sm font-semibold text-[#2347FA]">Mari Terhubung</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl"
                            >
                                Hubungi Kami
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600"
                            >
                                Ada pertanyaan, ingin bermitra, atau butuh bantuan? Tim kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi
                                kami melalui berbagai channel yang tersedia.
                            </motion.p>
                        </div>

                        <div className="mb-16 grid gap-8 md:grid-cols-3">
                            {/* Email Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="group"
                            >
                                <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 hover:shadow-2xl">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                                    <CardContent className="relative z-10 p-8 text-center">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                            <Mail className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-white">Email</h3>
                                        <p className="mb-4 text-sm text-blue-100">Kirim pesan kapan saja</p>
                                        <div className="space-y-2">
                                            {Array.isArray(aboutUs.contact.email) ? (
                                                aboutUs.contact.email.map((email, index) => (
                                                    <a
                                                        key={index}
                                                        href={`mailto:${email}`}
                                                        className="block font-medium text-white transition-colors hover:text-blue-200"
                                                    >
                                                        {email}
                                                    </a>
                                                ))
                                            ) : (
                                                <a
                                                    href={`mailto:${aboutUs.contact.email}`}
                                                    className="block font-medium text-white transition-colors hover:text-blue-200"
                                                >
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
                                <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 hover:shadow-2xl">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                                    <CardContent className="relative z-10 p-8 text-center">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                            <Phone className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-white">Telepon</h3>
                                        <p className="mb-4 text-sm text-emerald-100">Hubungi langsung tim kami</p>
                                        <div className="space-y-2">
                                            {Array.isArray(aboutUs.contact.phone) ? (
                                                aboutUs.contact.phone.map((phone, index) => (
                                                    <a
                                                        key={index}
                                                        href={`tel:${phone}`}
                                                        className="block font-medium text-white transition-colors hover:text-emerald-200"
                                                    >
                                                        {phone}
                                                    </a>
                                                ))
                                            ) : (
                                                <a
                                                    href={`tel:${aboutUs.contact.phone}`}
                                                    className="block font-medium text-white transition-colors hover:text-emerald-200"
                                                >
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
                                <Card className="relative h-full overflow-hidden border-0 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 hover:shadow-2xl">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                                    <CardContent className="relative z-10 p-8 text-center">
                                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                            <MapPin className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-white">Lokasi</h3>
                                        <p className="mb-4 text-sm text-purple-100">Kunjungi kantor kami</p>
                                        <div className="space-y-2">
                                            {Array.isArray(aboutUs.contact.address) ? (
                                                aboutUs.contact.address.map((addr, index) => (
                                                    <p key={index} className="font-medium text-white">
                                                        {addr}
                                                    </p>
                                                ))
                                            ) : (
                                                <p className="font-medium text-white">{aboutUs.contact.address}</p>
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
                            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl md:p-12">
                                <div className="mx-auto max-w-3xl">
                                    <div className="mb-6 flex justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2347FA] to-indigo-600">
                                            <CheckCircle className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">Siap Memulai Perjalanan Karir Anda?</h3>
                                    <p className="mb-8 text-lg leading-relaxed text-gray-600">
                                        Tim support kami tersedia 24/7 untuk membantu Anda. Dari pertanyaan umum hingga partnership bisnis, kami
                                        berkomitmen memberikan respon cepat dan solusi terbaik.
                                    </p>
                                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                        <Link href="/register">
                                            <Button size="lg" className="bg-[#2347FA] px-8 font-semibold text-white hover:bg-[#3b56fc]">
                                                Mulai Sekarang
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href="/jobs">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="border-[#2347FA] px-8 font-semibold text-[#2347FA] hover:bg-[#2347FA] hover:text-white"
                                            >
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
                <section className="relative overflow-hidden bg-gradient-to-br from-[#2347FA] via-[#3b56fc] to-indigo-700 py-20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

                    {/* Floating Elements */}
                    <div className="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-white/10 backdrop-blur-sm"></div>
                    <div className="absolute right-10 bottom-20 h-16 w-16 animate-bounce rounded-full bg-blue-300/20 backdrop-blur-sm"></div>
                    <div className="absolute top-1/2 left-1/4 h-3 w-3 animate-ping rounded-full bg-blue-200/30"></div>
                    <div className="absolute right-1/3 bottom-1/3 h-8 w-8 animate-pulse rounded-full bg-white/5 backdrop-blur-sm"></div>

                    <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-300/30 bg-blue-100/10 px-6 py-2 backdrop-blur-sm"
                        >
                            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-300"></div>
                            <span className="text-sm font-medium text-blue-100">Bergabunglah Sekarang</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mb-6 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl"
                        >
                            {aboutUs.cta_title}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl"
                        >
                            {aboutUs.cta_description}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
                        >
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="group relative overflow-hidden bg-white px-8 py-4 font-semibold text-[#2347FA] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-2xl"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Daftar Sekarang Gratis
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Button>
                            </Link>
                            <Link href="/jobs">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-lg"
                                >
                                    <Search className="mr-2 h-5 w-5" />
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
                            className="grid grid-cols-1 gap-8 border-t border-white/20 pt-8 sm:grid-cols-3"
                        >
                            <div className="text-center">
                                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">10K+</div>
                                <div className="text-sm text-blue-200">Lowongan Aktif</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">1K+</div>
                                <div className="text-sm text-blue-200">Perusahaan Partner</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">95%</div>
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
