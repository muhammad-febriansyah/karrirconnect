import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { Marquee } from '@/components/magicui/marquee';
import { NumberTicker } from '@/components/magicui/number-ticker';
import ModernFooter from '@/components/modern-footer';
import ModernNavbar from '@/components/modern-navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    ArrowRight,
    Award,
    Briefcase,
    Building,
    CheckCircle,
    Clock,
    Crown,
    Flame,
    Globe,
    Heart,
    MapPin,
    Search,
    Shield,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap,
    Handshake,
    Lightbulb,
    Trophy,
    Eye,
    Compass,
    Rocket,
    Gem,
    Diamond,
    ThumbsUp,
    Smile,
    Infinity,
    Leaf,
    Sun,
    Puzzle,
    Key,
    Lock,
    Megaphone,
    MessageCircle,
    BookOpen,
    Calendar,
    Coffee,
    Gift,
    Home,
    Music,
    Palette,
    Camera,
    Code,
    Database,
    GraduationCap,
    Building2,
} from 'lucide-react';

interface Company {
    id: number;
    name: string;
    description: string;
    logo: string | null;
    website: string;
    industry: string;
    size: string;
    location: string;
    is_verified: boolean;
    active_jobs_count: number;
    total_job_posts: number;
}

interface JobCategory {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    jobs_count: number;
}

interface JobListing {
    id: number;
    slug: string;
    title: string;
    company: {
        id: number;
        name: string;
        logo: string | null;
        location: string;
    };
    category: {
        id: number;
        name: string;
        slug: string;
    };
    location: string;
    employment_type: string;
    work_arrangement: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    salary_negotiable: boolean;
    featured: boolean;
    created_at: string;
    application_deadline: string | null;
    applications_count: number;
    positions_available: number;
    remaining_positions: number;
}

interface NewsArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    author: {
        id: number;
        name: string;
        avatar: string | null;
    };
    published_at: string;
}

interface SuccessStory {
    id: number;
    name: string;
    position: string;
    company: string;
    story: string;
    location: string | null;
    experience_years: number | null;
    salary_before: number | null;
    salary_after: number | null;
    salary_increase_percentage: number | null;
    avatar_url: string | null;
    created_at: string;
}

interface Statistics {
    total_jobs: number;
    total_companies: number;
    total_candidates: number;
    featured_jobs: number;
}

interface Settings {
    site_name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    logo: string | null;
    thumbnail: string | null;
    social: {
        facebook: string;
        instagram: string;
        youtube: string;
        tiktok: string;
    };
    keywords: string;
}

interface AboutUs {
    id: number;
    title: string;
    description: string;
    vision: string;
    mission: string;
    values: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    features: string[];
    stats: Array<{
        number: string;
        label: string;
        icon: string;
    }>;
    team: Array<{
        name: string;
        position: string;
        bio: string;
        image: string | null;
    }>;
    contact: {
        email: string[];
        phone: string[];
        address: string[];
    };
    cta_title: string;
    cta_description: string;
    is_active: boolean;
}

interface HomePageProps {
    settings?: Settings;
    statistics: Statistics;
    featuredJobs: JobListing[];
    topCompanies: Company[];
    jobCategories: JobCategory[];
    latestNews: NewsArticle[];
    successStories: SuccessStory[];
    aboutUs: AboutUs | null;
    [key: string]: any;
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { settings, statistics, featuredJobs, topCompanies, jobCategories, latestNews, successStories, aboutUs } = usePage<HomePageProps>().props;

    // State untuk search form
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');

    // Fungsi untuk handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Buat query parameters untuk search
        const params = new URLSearchParams();
        
        if (searchQuery.trim()) {
            params.append('search', searchQuery.trim());
        }
        
        if (locationQuery.trim()) {
            params.append('location', locationQuery.trim());
        }
        
        // Redirect ke halaman jobs dengan query parameters
        const queryString = params.toString();
        const url = queryString ? `/jobs?${queryString}` : '/jobs';
        
        router.visit(url);
    };

    const formatSalary = (min: number | null, max: number | null, currency: string, negotiable: boolean) => {
        if (negotiable) return 'Negotiable';
        if (!min && !max) return 'Competitive';

        const format = (amount: number) => {
            if (amount >= 1000000) {
                return `${Math.floor(amount / 1000000)}M`;
            }
            return `${Math.floor(amount / 1000)}K`;
        };

        if (min && max && min !== max) {
            return `${currency} ${format(min)} - ${format(max)}`;
        }
        return `${currency} ${format(min || max || 0)}`;
    };

    // Get site info from settings with fallbacks
    const siteName = settings?.site_name || 'KarirConnect';
    const siteDescription = settings?.description || 'Platform karir terpercaya yang menghubungkan talenta dengan peluang terbaik';
    const siteLogo = settings?.logo;

    return (
        <>
            <Head title={`${siteName} - Temukan Karir Impian Anda`} />

            <div className="relative min-h-screen bg-white">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="home" />

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-40 lg:pb-20">
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

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            {/* Simple Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
                            >
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-blue-700">Platform Karir Terpercaya</span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-6 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                            >
                                Temukan Karir <span className="text-blue-600">Impian</span>
                                <br />
                                Anda di {siteName}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mx-auto mb-8 sm:mb-12 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl px-4 sm:px-0"
                            >
                                {siteDescription}. Bergabunglah dengan lebih dari{' '}
                                <span className="font-semibold text-gray-900">{statistics.total_candidates.toLocaleString()}+</span> talenta dan{' '}
                                <span className="font-semibold text-gray-900">{statistics.total_companies.toLocaleString()}+</span> perusahaan
                                terpercaya.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg"
                            >
                                <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:gap-4 md:grid md:grid-cols-5 md:items-center">
                                    {/* Job Search Input */}
                                    <div className="relative md:col-span-2">
                                        <Search className="absolute top-1/2 left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari posisi atau perusahaan"
                                            className="h-10 sm:h-12 rounded-lg border-gray-300 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Location Input */}
                                    <div className="relative md:col-span-2">
                                        <MapPin className="absolute top-1/2 left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            value={locationQuery}
                                            onChange={(e) => setLocationQuery(e.target.value)}
                                            placeholder="Kota atau wilayah"
                                            className="h-10 sm:h-12 rounded-lg border-gray-300 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Search Button */}
                                    <div className="md:col-span-1">
                                        <Button type="submit" className="h-10 sm:h-12 w-full rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700 text-sm sm:text-base">
                                            <Search className="mr-2 h-4 w-4" />
                                            <span>Cari</span>
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="mx-auto mt-12 sm:mt-16 grid max-w-2xl grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-0"
                            >
                                <div className="text-center">
                                    <div className="mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                                        <NumberTicker value={statistics.total_jobs} className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600" delay={0.2} />+
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-600">Lowongan Kerja</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                                        <NumberTicker value={statistics.total_companies} className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600" delay={0.4} />+
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-600">Perusahaan</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-1 sm:mb-2 text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                                        <NumberTicker value={statistics.total_candidates} className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600" delay={0.6} />+
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-600">Pengguna</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Trusted Companies - Enhanced */}
                <section className="relative overflow-hidden py-24" id="companies">
                    {/* Background with sophisticated pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSIjMjM0N0ZBIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] opacity-30"></div>

                    {/* Floating elements */}
                    <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-gradient-to-br from-[#2347FA]/10 to-[#3b56fc]/10 blur-xl"></div>
                    <div className="absolute right-10 bottom-20 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-xl"></div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Enhanced Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mb-16 text-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                                className="mb-8 inline-flex items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-3 backdrop-blur-sm"
                            >
                                <Crown className="h-5 w-5 text-amber-500" />
                                <span className="text-sm font-semibold text-blue-700">Trusted by Industry Leaders</span>
                                <Shield className="h-5 w-5 text-emerald-500" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl"
                            >
                                Dipercaya oleh{' '}
                                <span className="bg-gradient-to-r from-[#2347FA] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {statistics.total_companies.toLocaleString()}+
                                </span>
                                <br />
                                <span className="text-2xl font-medium text-gray-600 sm:text-3xl lg:text-4xl">
                                    Perusahaan Terkemuka
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg"
                            >
                                Dari startup inovatif hingga korporasi global, perusahaan-perusahaan terdepan memilih 
                                KarirConnect sebagai partner dalam menemukan talenta terbaik Indonesia.
                            </motion.p>

                        </motion.div>

                        {/* Company Showcase */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {topCompanies.map((company, index) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05, duration: 0.6 }}
                                    className="group cursor-pointer"
                                >
                                    <Link href={`/companies/${company.id}`}>
                                        <div className="relative rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200">
                                            {/* Top badge for featured companies */}
                                            {index < 3 && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <div className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 p-1.5 shadow-sm">
                                                        <Crown className="h-3 w-3 text-white" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center space-y-2 sm:space-y-3 text-center">
                                                {/* Company Logo */}
                                                <div className="relative">
                                                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gray-50 p-2 sm:p-3 transition-colors duration-300 group-hover:bg-blue-50">
                                                        <Avatar className="h-full w-full">
                                                            {company.logo ? (
                                                                <AvatarImage
                                                                    src={company.logo}
                                                                    alt={company.name}
                                                                    className="object-contain"
                                                                />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-blue-600 text-white text-sm font-semibold">
                                                                    {company.name.charAt(0)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                    </div>

                                                    {/* Status indicators */}
                                                    {company.is_verified && (
                                                        <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-sm">
                                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Company Information */}
                                                <div className="w-full space-y-1 sm:space-y-2">
                                                    <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 leading-tight">
                                                        {company.name}
                                                    </h3>

                                                    {/* Quick stats */}
                                                    <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Briefcase className="h-3 w-3 flex-shrink-0" />
                                                            <span>{company.active_jobs_count}</span>
                                                        </div>
                                                        <div className="h-1 w-1 rounded-full bg-gray-300 flex-shrink-0"></div>
                                                        <div className="flex items-center gap-1 min-w-0">
                                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                                            <span className="max-w-[40px] sm:max-w-[60px] truncate">{company.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mt-12 text-center"
                        >
                            <div className="inline-flex flex-col items-center gap-4 sm:gap-6 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 sm:p-6 lg:p-8 sm:flex-row">
                                <div className="text-center sm:text-left">
                                    <p className="font-semibold text-gray-900">Bergabung dengan {statistics.total_companies.toLocaleString()}+ perusahaan lainnya</p>
                                    <p className="text-sm text-gray-600">Temukan talenta terbaik untuk tim Anda di KarirConnect</p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button asChild variant="outline" size="sm" className="rounded-full">
                                        <Link href="/companies">
                                            Lihat Semua
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm" className="rounded-full bg-[#2347FA] hover:bg-blue-700">
                                        <Link href="/employer/register">
                                            Mulai Sekarang
                                            <Building className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* About Us Section */}
                {aboutUs && (
                    <section className="bg-white py-20" id="about">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-16 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
                                >
                                    <Building className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Tentang Kami</span>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl"
                                >
                                    Mengenal <span className="text-blue-600">{aboutUs.title}</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="mx-auto max-w-3xl text-lg text-gray-600"
                                >
                                    {aboutUs.description}
                                </motion.p>
                            </div>

                            {/* Values */}
                            <div className="mb-12 sm:mb-16 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {aboutUs.values.map((value, index) => {
                                    // Icon mapping for values (from lucide.dev) - same as about page
                                    const iconMap: { [key: string]: JSX.Element } = {
                                        // Core Business Values
                                        handshake: <Handshake className="h-8 w-8 text-blue-600" />,
                                        heart: <Heart className="h-8 w-8 text-blue-600" />,
                                        lightbulb: <Lightbulb className="h-8 w-8 text-blue-600" />,
                                        trophy: <Trophy className="h-8 w-8 text-blue-600" />,
                                        shield: <Shield className="h-8 w-8 text-blue-600" />,
                                        target: <Target className="h-8 w-8 text-blue-600" />,
                                        users: <Users className="h-8 w-8 text-blue-600" />,
                                        globe: <Globe className="h-8 w-8 text-blue-600" />,
                                        search: <Search className="h-8 w-8 text-blue-600" />,
                                        
                                        // Leadership & Excellence
                                        crown: <Crown className="h-8 w-8 text-blue-600" />,
                                        award: <Award className="h-8 w-8 text-blue-600" />,
                                        star: <Star className="h-8 w-8 text-blue-600" />,
                                        diamond: <Diamond className="h-8 w-8 text-blue-600" />,
                                        gem: <Gem className="h-8 w-8 text-blue-600" />,
                                        
                                        // Growth & Progress
                                        'trending-up': <TrendingUp className="h-8 w-8 text-blue-600" />,
                                        rocket: <Rocket className="h-8 w-8 text-blue-600" />,
                                        zap: <Zap className="h-8 w-8 text-blue-600" />,
                                        flame: <Flame className="h-8 w-8 text-blue-600" />,
                                        sparkles: <Sparkles className="h-8 w-8 text-blue-600" />,
                                        infinity: <Infinity className="h-8 w-8 text-blue-600" />,
                                        
                                        // Vision & Insight
                                        eye: <Eye className="h-8 w-8 text-blue-600" />,
                                        compass: <Compass className="h-8 w-8 text-blue-600" />,
                                        sun: <Sun className="h-8 w-8 text-blue-600" />,
                                        
                                        // Collaboration & Communication
                                        'thumbs-up': <ThumbsUp className="h-8 w-8 text-blue-600" />,
                                        smile: <Smile className="h-8 w-8 text-blue-600" />,
                                        'message-circle': <MessageCircle className="h-8 w-8 text-blue-600" />,
                                        megaphone: <Megaphone className="h-8 w-8 text-blue-600" />,
                                        
                                        // Innovation & Technology
                                        puzzle: <Puzzle className="h-8 w-8 text-blue-600" />,
                                        code: <Code className="h-8 w-8 text-blue-600" />,
                                        database: <Database className="h-8 w-8 text-blue-600" />,
                                        key: <Key className="h-8 w-8 text-blue-600" />,
                                        lock: <Lock className="h-8 w-8 text-blue-600" />,
                                        
                                        // Learning & Development
                                        'graduation-cap': <GraduationCap className="h-8 w-8 text-blue-600" />,
                                        'book-open': <BookOpen className="h-8 w-8 text-blue-600" />,
                                        
                                        // Work & Business
                                        briefcase: <Briefcase className="h-8 w-8 text-blue-600" />,
                                        building: <Building className="h-8 w-8 text-blue-600" />,
                                        'building-2': <Building2 className="h-8 w-8 text-blue-600" />,
                                        calendar: <Calendar className="h-8 w-8 text-blue-600" />,
                                        clock: <Clock className="h-8 w-8 text-blue-600" />,
                                        
                                        // Comfort & Lifestyle
                                        coffee: <Coffee className="h-8 w-8 text-blue-600" />,
                                        gift: <Gift className="h-8 w-8 text-blue-600" />,
                                        home: <Home className="h-8 w-8 text-blue-600" />,
                                        music: <Music className="h-8 w-8 text-blue-600" />,
                                        palette: <Palette className="h-8 w-8 text-blue-600" />,
                                        camera: <Camera className="h-8 w-8 text-blue-600" />,
                                        leaf: <Leaf className="h-8 w-8 text-blue-600" />,
                                        
                                        // Legacy icons (for backward compatibility)
                                        'shield-check': <Shield className="h-8 w-8 text-blue-600" />,
                                    };

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group cursor-pointer"
                                        >
                                            <div className="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
                                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm">
                                                    {iconMap[value.icon] ? iconMap[value.icon] : <Building className="h-8 w-8 text-blue-600" />}
                                                </div>
                                                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                                    {value.title}
                                                </h3>
                                                <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                                                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform rounded-b-2xl bg-gradient-to-r from-blue-600 to-blue-700 transition-transform duration-300 group-hover:scale-x-100"></div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Stats */}
                            <div className="mb-12 sm:mb-16 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                                {aboutUs.stats.map((stat, index) => {
                                    // Icon mapping for stats (from lucide.dev) - same as about page
                                    const statIconMap: { [key: string]: JSX.Element } = {
                                        // Core Business Values
                                        handshake: <Handshake className="h-6 w-6 text-blue-600" />,
                                        heart: <Heart className="h-6 w-6 text-blue-600" />,
                                        lightbulb: <Lightbulb className="h-6 w-6 text-blue-600" />,
                                        trophy: <Trophy className="h-6 w-6 text-blue-600" />,
                                        shield: <Shield className="h-6 w-6 text-blue-600" />,
                                        target: <Target className="h-6 w-6 text-blue-600" />,
                                        users: <Users className="h-6 w-6 text-blue-600" />,
                                        globe: <Globe className="h-6 w-6 text-blue-600" />,
                                        search: <Search className="h-6 w-6 text-blue-600" />,
                                        
                                        // Leadership & Excellence
                                        crown: <Crown className="h-6 w-6 text-blue-600" />,
                                        award: <Award className="h-6 w-6 text-blue-600" />,
                                        star: <Star className="h-6 w-6 text-blue-600" />,
                                        diamond: <Diamond className="h-6 w-6 text-blue-600" />,
                                        gem: <Gem className="h-6 w-6 text-blue-600" />,
                                        
                                        // Growth & Progress
                                        'trending-up': <TrendingUp className="h-6 w-6 text-blue-600" />,
                                        rocket: <Rocket className="h-6 w-6 text-blue-600" />,
                                        zap: <Zap className="h-6 w-6 text-blue-600" />,
                                        flame: <Flame className="h-6 w-6 text-blue-600" />,
                                        sparkles: <Sparkles className="h-6 w-6 text-blue-600" />,
                                        infinity: <Infinity className="h-6 w-6 text-blue-600" />,
                                        
                                        // Vision & Insight
                                        eye: <Eye className="h-6 w-6 text-blue-600" />,
                                        compass: <Compass className="h-6 w-6 text-blue-600" />,
                                        sun: <Sun className="h-6 w-6 text-blue-600" />,
                                        
                                        // Collaboration & Communication
                                        'thumbs-up': <ThumbsUp className="h-6 w-6 text-blue-600" />,
                                        smile: <Smile className="h-6 w-6 text-blue-600" />,
                                        'message-circle': <MessageCircle className="h-6 w-6 text-blue-600" />,
                                        megaphone: <Megaphone className="h-6 w-6 text-blue-600" />,
                                        
                                        // Innovation & Technology
                                        puzzle: <Puzzle className="h-6 w-6 text-blue-600" />,
                                        code: <Code className="h-6 w-6 text-blue-600" />,
                                        database: <Database className="h-6 w-6 text-blue-600" />,
                                        key: <Key className="h-6 w-6 text-blue-600" />,
                                        lock: <Lock className="h-6 w-6 text-blue-600" />,
                                        
                                        // Learning & Development
                                        'graduation-cap': <GraduationCap className="h-6 w-6 text-blue-600" />,
                                        'book-open': <BookOpen className="h-6 w-6 text-blue-600" />,
                                        
                                        // Work & Business
                                        briefcase: <Briefcase className="h-6 w-6 text-blue-600" />,
                                        building: <Building className="h-6 w-6 text-blue-600" />,
                                        'building-2': <Building2 className="h-6 w-6 text-blue-600" />,
                                        calendar: <Calendar className="h-6 w-6 text-blue-600" />,
                                        clock: <Clock className="h-6 w-6 text-blue-600" />,
                                        
                                        // Comfort & Lifestyle
                                        coffee: <Coffee className="h-6 w-6 text-blue-600" />,
                                        gift: <Gift className="h-6 w-6 text-blue-600" />,
                                        home: <Home className="h-6 w-6 text-blue-600" />,
                                        music: <Music className="h-6 w-6 text-blue-600" />,
                                        palette: <Palette className="h-6 w-6 text-blue-600" />,
                                        camera: <Camera className="h-6 w-6 text-blue-600" />,
                                        leaf: <Leaf className="h-6 w-6 text-blue-600" />,
                                        
                                        // Legacy icons (for backward compatibility)
                                        'shield-check': <Shield className="h-6 w-6 text-blue-600" />,
                                    };

                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="text-center"
                                        >
                                            <div className="mb-4 flex items-center justify-center">
                                                {statIconMap[stat.icon] ? statIconMap[stat.icon] : <Building className="h-6 w-6 text-blue-600" />}
                                            </div>
                                            <div className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl">{stat.number}</div>
                                            <div className="text-lg font-semibold text-gray-900">{stat.label}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Mission & Vision */}
                            <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-gray-900">Misi Kami</h3>
                                    <p className="leading-relaxed text-gray-700">{aboutUs.mission}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-4 text-xl font-bold text-gray-900">Visi Kami</h3>
                                    <p className="leading-relaxed text-gray-700">{aboutUs.vision}</p>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Popular Job Categories */}
                <section className="py-20" id="categories">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
                            >
                                <Briefcase className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Kategori Terpopuler</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl"
                            >
                                Temukan <span className="text-blue-600">Pekerjaan</span> Impian Anda
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto max-w-3xl text-lg text-gray-600"
                            >
                                Jelajahi berbagai kategori pekerjaan dari industri terdepan dengan ribuan peluang karir menanti
                            </motion.p>
                        </div>

                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {jobCategories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl">
                                        {/* Background gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                        <div className="relative">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="relative">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                        {category.icon ? (
                                                            <img src={`/storage/${category.icon}`} alt={category.name} className="h-8 w-8" />
                                                        ) : (
                                                            <Briefcase className="h-8 w-8 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                </div>
                                                <div className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                                                    {category.jobs_count} jobs
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                                    {category.name}
                                                </h3>
                                                <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{category.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span>Tersedia sekarang</span>
                                                </div>
                                                <div className="flex items-center text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                                    <span className="text-sm font-medium">Lihat semua</span>
                                                    <ArrowRight className="ml-1 h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom accent */}
                                        <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 transform bg-gradient-to-r from-blue-600 to-blue-700 transition-transform duration-300 group-hover:scale-x-100"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 text-center"
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-indigo-200 bg-white px-8 py-3 font-semibold text-indigo-600 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                            >
                                Lihat Semua Kategori
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    </div>
                </section>

                {/* Latest Jobs - Enhanced */}
                <section className="relative py-20" id="jobs">
                    {/* Background with gradient and subtle pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjM0N0ZBIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Enhanced Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-16 text-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-6 inline-flex items-center space-x-2 rounded-full border border-[#2347FA]/20 bg-[#2347FA]/5 px-4 py-2 backdrop-blur-sm"
                            >
                                <Flame className="h-4 w-4 text-[#2347FA]" />
                                <span className="text-sm font-medium text-[#2347FA]">Hot Jobs</span>
                                <Zap className="h-4 w-4 text-yellow-500" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl"
                            >
                                Lowongan <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">Terbaru</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600"
                            >
                                Temukan peluang karir terbaik dari perusahaan-perusahaan top di Indonesia
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 flex justify-center"
                            >
                                <Button
                                    asChild
                                    className="rounded-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] px-6 py-2 text-white shadow-lg transition-all duration-300 hover:from-[#1a3af0] hover:to-[#2d47f5] hover:shadow-xl"
                                >
                                    <Link href="/jobs">
                                        Lihat Semua Lowongan
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Enhanced Job Cards Grid */}
                        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {featuredJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="group relative h-full cursor-pointer overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-[#2347FA]/10">
                                        {/* Decorative elements */}
                                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2347FA]/5 to-[#3b56fc]/5 transition-all duration-500 group-hover:scale-150"></div>

                                        {/* Featured badge */}
                                        {job.featured && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                                    <Sparkles className="mr-1 h-3 w-3" />
                                                    Featured
                                                </div>
                                            </div>
                                        )}

                                        <CardContent className="relative z-10 p-4 sm:p-6">
                                            {/* Company Info */}
                                            <div className="mb-3 sm:mb-4 flex items-center space-x-3 sm:space-x-4">
                                                <div className="relative flex-shrink-0">
                                                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-[#2347FA]/20">
                                                        {job.company.logo ? (
                                                            <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                        ) : (
                                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-sm sm:text-lg font-semibold text-white">
                                                                {job.company.name.charAt(0)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border-2 border-white bg-green-500">
                                                        <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                                                    </div>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-500">{job.company.name}</p>
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate">{job.company.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Job Title */}
                                            <h3 className="mb-2 sm:mb-3 line-clamp-2 text-lg sm:text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#2347FA] leading-tight">
                                                {job.title}
                                            </h3>

                                            {/* Job Details */}
                                            <div className="mb-3 sm:mb-4 space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-gray-500 min-w-0">
                                                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                                                        <span className="truncate">{job.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-500 ml-2">
                                                        <Briefcase className="mr-1 sm:mr-2 h-4 w-4 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm truncate">
                                                            {job.employment_type === 'full_time'
                                                                ? 'Full Time'
                                                                : job.employment_type === 'part_time'
                                                                  ? 'Part Time'
                                                                  : job.employment_type === 'contract'
                                                                    ? 'Contract'
                                                                    : job.employment_type}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-gray-500">
                                                        <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm">{job.applications_count} pelamar</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-500">
                                                        <Clock className="mr-1 sm:mr-2 h-4 w-4 flex-shrink-0" />
                                                        <span className="text-xs sm:text-sm">
                                                            {new Date(job.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Salary */}
                                            <div className="mb-3 sm:mb-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-lg sm:text-xl lg:text-2xl font-bold text-transparent flex-1 min-w-0">
                                                        <span className="block truncate">{formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}</span>
                                                    </span>
                                                    <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-xs text-blue-700 flex-shrink-0">
                                                        {job.category.name}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Work Arrangement */}
                                            {job.work_arrangement && (
                                                <div className="mb-4">
                                                    <Badge variant="outline" className="border-green-200 bg-green-50 text-xs text-green-700">
                                                        {job.work_arrangement === 'remote'
                                                            ? 'Remote'
                                                            : job.work_arrangement === 'hybrid'
                                                              ? 'Hybrid'
                                                              : job.work_arrangement === 'onsite'
                                                                ? 'On-site'
                                                                : job.work_arrangement}
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Apply Button */}
                                            <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-3 sm:pt-4">
                                                <Button
                                                    asChild
                                                    className="w-full rounded-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-md transition-all duration-300 hover:from-[#1a3af0] hover:to-[#2d47f5] hover:shadow-lg text-sm sm:text-base h-10 sm:h-11"
                                                >
                                                    <Link href={`/jobs/${job.slug}`}>
                                                        <span>Lamar Sekarang</span>
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>

                                            {/* Urgency indicator */}
                                            {job.application_deadline &&
                                                new Date(job.application_deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                                                    <div className="mt-3 flex items-center justify-center text-xs text-orange-600">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        <span>Deadline: {new Date(job.application_deadline).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* View More Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 text-center"
                        >
                            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:space-x-4 rounded-2xl border border-gray-200/50 bg-white/80 px-4 sm:px-6 py-4 shadow-lg backdrop-blur-sm">
                                <div className="flex items-center space-x-2 text-sm text-gray-600 text-center sm:text-left">
                                    <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Tersedia {statistics.total_jobs.toLocaleString()}+ lowongan lainnya</span>
                                </div>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-full border-[#2347FA]/20 text-[#2347FA] hover:bg-[#2347FA] hover:text-white"
                                >
                                    <Link href="/jobs">
                                        Jelajahi Semua
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Success Stories with Marquee */}
                {successStories.length > 0 && (
                    <section className="relative overflow-hidden py-20">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMzQ3RkEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

                        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {/* Enhanced Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-16 text-center"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200/50 bg-blue-50/80 px-4 py-2 backdrop-blur-sm"
                                >
                                    <Star className="h-4 w-4 fill-current text-[#2347FA]" />
                                    <span className="text-sm font-medium text-[#2347FA]">Success Stories</span>
                                    <Star className="h-4 w-4 fill-current text-[#2347FA]" />
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl"
                                >
                                    Kisah Sukses{' '}
                                    <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">Nyata</span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600"
                                >
                                    Bergabunglah dengan ribuan profesional yang telah mentransformasi karir mereka dan meraih impian bersama
                                    KarirConnect
                                </motion.p>

                                {/* Statistics */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600"
                                >
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span>Rata-rata kenaikan gaji 85%</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Award className="h-4 w-4 text-[#2347FA]" />
                                        <span>1000+ sukses placement</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <span>98% kepuasan pengguna</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Enhanced Marquee */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="relative overflow-hidden"
                            >
                                <Marquee pauseOnHover className="[--duration:25s] [--gap:1.5rem]">
                                    {successStories.map((story) => (
                                        <div
                                            key={story.id}
                                            className="group relative w-72 sm:w-80 cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-[#2347FA]/10"
                                        >
                                            {/* Decorative element */}
                                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                            <div className="mb-4 flex flex-row items-start gap-3">
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-[#2347FA]/20">
                                                        {story.avatar_url ? <AvatarImage src={story.avatar_url} alt={story.name} /> : null}
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] font-semibold text-white">
                                                            {story.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-green-500">
                                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <figcaption className="truncate text-sm font-semibold text-gray-900">{story.name}</figcaption>
                                                    <p className="truncate text-xs font-medium text-[#2347FA]">{story.position}</p>
                                                    <p className="mt-0.5 flex items-center truncate text-xs text-gray-500">
                                                        <Building className="mr-1 h-3 w-3 flex-shrink-0" />
                                                        {story.company}
                                                    </p>
                                                </div>

                                                {story.salary_increase_percentage && (
                                                    <div className="flex flex-col items-end">
                                                        <Badge className="border-0 bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 text-xs text-white">
                                                            +{story.salary_increase_percentage}%
                                                        </Badge>
                                                        <span className="mt-1 text-xs font-medium text-green-600">gaji naik</span>
                                                    </div>
                                                )}
                                            </div>

                                            <blockquote className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-700 italic">
                                                "{story.story}"
                                            </blockquote>

                                            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                                                <div className="flex items-center space-x-3">
                                                    {story.location && (
                                                        <div className="flex items-center">
                                                            <MapPin className="mr-1 h-3 w-3" />
                                                            <span>{story.location}</span>
                                                        </div>
                                                    )}
                                                    {story.experience_years && (
                                                        <div className="flex items-center">
                                                            <Briefcase className="mr-1 h-3 w-3" />
                                                            <span>{story.experience_years} tahun</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex space-x-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Marquee>

                                <Marquee reverse pauseOnHover className="mt-6 [--duration:25s] [--gap:1.5rem]">
                                    {successStories
                                        .slice()
                                        .reverse()
                                        .map((story) => (
                                            <div
                                                key={`reverse-${story.id}`}
                                                className="group relative w-72 sm:w-80 cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-[#2347FA]/10"
                                            >
                                                {/* Decorative element */}
                                                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                                <div className="mb-4 flex flex-row items-start gap-3">
                                                    <div className="relative">
                                                        <Avatar className="h-12 w-12 ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-[#2347FA]/20">
                                                            {story.avatar_url ? <AvatarImage src={story.avatar_url} alt={story.name} /> : null}
                                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] font-semibold text-white">
                                                                {story.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-green-500">
                                                            <CheckCircle className="h-2.5 w-2.5 text-white" />
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <figcaption className="truncate text-sm font-semibold text-gray-900">{story.name}</figcaption>
                                                        <p className="truncate text-xs font-medium text-[#2347FA]">{story.position}</p>
                                                        <p className="mt-0.5 flex items-center truncate text-xs text-gray-500">
                                                            <Building className="mr-1 h-3 w-3 flex-shrink-0" />
                                                            {story.company}
                                                        </p>
                                                    </div>

                                                    {story.salary_increase_percentage && (
                                                        <div className="flex flex-col items-end">
                                                            <Badge className="border-0 bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 text-xs text-white">
                                                                +{story.salary_increase_percentage}%
                                                            </Badge>
                                                            <span className="mt-1 text-xs font-medium text-green-600">gaji naik</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <blockquote className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-700 italic">
                                                    "{story.story}"
                                                </blockquote>

                                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                                                    <div className="flex items-center space-x-3">
                                                        {story.location && (
                                                            <div className="flex items-center">
                                                                <MapPin className="mr-1 h-3 w-3" />
                                                                <span>{story.location}</span>
                                                            </div>
                                                        )}
                                                        {story.experience_years && (
                                                            <div className="flex items-center">
                                                                <Briefcase className="mr-1 h-3 w-3" />
                                                                <span>{story.experience_years} tahun</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </Marquee>

                                {/* Enhanced gradient fade */}
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blue-50/50 via-white/80 to-transparent"></div>
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-50/50 via-white/80 to-transparent"></div>
                            </motion.div>

                            {/* Call to Action */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="mt-12 text-center"
                            >
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] px-8 py-3 text-white shadow-lg transition-all duration-300 hover:from-[#1a3af0] hover:to-[#2d47f5] hover:shadow-xl"
                                >
                                    <Link href="/jobs">
                                        Mulai Perjalanan Karir Anda
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <p className="mt-3 text-sm text-gray-500">
                                    Bergabunglah dengan {statistics.total_candidates.toLocaleString()}+ profesional lainnya
                                </p>
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="relative overflow-hidden py-20">
                    {/* Background with gradient and pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-300/30 bg-blue-100/10 px-4 py-2 backdrop-blur-sm"
                        >
                            <div className="h-2 w-2 rounded-full bg-blue-300"></div>
                            <span className="text-sm font-medium text-blue-100">Mulai Hari Ini</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mb-6 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl"
                        >
                            Wujudkan Karir <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Impian</span> Anda
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl"
                        >
                            Bergabunglah dengan komunitas {statistics.total_candidates.toLocaleString()}+ profesional dan akses{' '}
                            {statistics.total_jobs.toLocaleString()}+ peluang karir terbaik dari perusahaan terpercaya
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 sm:mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
                        >
                            <Link href={route('register')}>
                                <Button
                                    size="lg"
                                    className="group relative overflow-hidden bg-white px-8 py-4 font-semibold text-blue-900 shadow-xl transition-all duration-300 hover:bg-blue-50 hover:shadow-2xl"
                                >
                                    <span className="relative z-10 flex items-center">
                                        Mulai Sekarang Gratis
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Button>
                            </Link>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
                            >
                                Jelajahi Lowongan
                                <Search className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-3 gap-4 sm:gap-8 border-t border-white/20 pt-6 sm:pt-8"
                        >
                            <div className="text-center">
                                <div className="mb-1 text-xl sm:text-2xl md:text-3xl font-bold text-white">{statistics.total_jobs.toLocaleString()}+</div>
                                <div className="text-xs sm:text-sm text-blue-200">Lowongan Aktif</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-xl sm:text-2xl md:text-3xl font-bold text-white">{statistics.total_companies.toLocaleString()}+</div>
                                <div className="text-xs sm:text-sm text-blue-200">Perusahaan Partner</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-xl sm:text-2xl md:text-3xl font-bold text-white">95%</div>
                                <div className="text-xs sm:text-sm text-blue-200">Tingkat Kepuasan</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Floating elements */}
                    <div className="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-white/5 backdrop-blur-sm"></div>
                    <div className="absolute right-10 bottom-20 h-16 w-16 animate-bounce rounded-full bg-blue-300/10 backdrop-blur-sm"></div>
                    <div className="absolute top-1/2 left-1/4 h-3 w-3 animate-ping rounded-full bg-blue-200/20"></div>
                </section>

                {/* Modern Footer */}
                <ModernFooter siteName={siteName} siteDescription={siteDescription} statistics={statistics} settings={settings} />
            </div>
        </>
    );
}
