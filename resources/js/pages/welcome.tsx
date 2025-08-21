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
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Briefcase, Building, CheckCircle, Clock, Crown, Flame, Globe, Heart, MapPin, Search, Shield, Sparkles, Star, Target, TrendingUp, Users, Zap } from 'lucide-react';

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
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { settings, statistics, featuredJobs, topCompanies, jobCategories, latestNews, successStories, aboutUs } = usePage<HomePageProps>().props;

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
                                className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl"
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
                                className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
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
                                className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
                            >
                                <div className="grid items-center gap-4 md:grid-cols-5">
                                    {/* Job Search Input */}
                                    <div className="relative md:col-span-2">
                                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Cari posisi atau perusahaan"
                                            className="h-12 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Location Input */}
                                    <div className="relative md:col-span-2">
                                        <MapPin className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                        <Input
                                            placeholder="Kota atau wilayah"
                                            className="h-12 rounded-lg border-gray-300 pl-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Search Button */}
                                    <div className="md:col-span-1">
                                        <Button className="h-12 w-full rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700">
                                            <Search className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">Cari</span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8"
                            >
                                <div className="text-center">
                                    <div className="mb-2 text-3xl font-bold text-blue-600">
                                        <NumberTicker value={statistics.total_jobs} className="text-3xl font-bold text-blue-600" delay={0.2} />+
                                    </div>
                                    <div className="text-gray-600">Lowongan Kerja</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-3xl font-bold text-blue-600">
                                        <NumberTicker value={statistics.total_companies} className="text-3xl font-bold text-blue-600" delay={0.4} />+
                                    </div>
                                    <div className="text-gray-600">Perusahaan</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-3xl font-bold text-blue-600">
                                        <NumberTicker value={statistics.total_candidates} className="text-3xl font-bold text-blue-600" delay={0.6} />+
                                    </div>
                                    <div className="text-gray-600">Pengguna</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Trusted Companies - Enhanced */}
                <section className="relative py-24 overflow-hidden" id="companies">
                    {/* Background with sophisticated pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSIjMjM0N0ZBIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] opacity-30"></div>
                    
                    {/* Floating elements */}
                    <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#2347FA]/10 to-[#3b56fc]/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Enhanced Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-20 text-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-6 inline-flex items-center space-x-2 rounded-full border border-[#2347FA]/20 bg-gradient-to-r from-[#2347FA]/5 to-blue-50/50 px-5 py-3 backdrop-blur-sm"
                            >
                                <Crown className="h-5 w-5 text-[#2347FA]" />
                                <span className="text-sm font-semibold text-[#2347FA]">Trusted Partners</span>
                                <Shield className="h-5 w-5 text-green-600" />
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl"
                            >
                                Dipercaya <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">Perusahaan</span>
                                <br />
                                <span className="text-gray-700">Terkemuka</span>
                            </motion.h2>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mx-auto max-w-3xl text-xl text-gray-600 leading-relaxed"
                            >
                                Lebih dari <span className="font-bold text-[#2347FA]">{statistics.total_companies.toLocaleString()}+</span> perusahaan dari berbagai industri mempercayai KarirConnect sebagai platform rekrutmen utama mereka
                            </motion.p>

                            {/* Trust indicators */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600"
                            >
                                <div className="flex items-center space-x-2">
                                    <Award className="h-5 w-5 text-yellow-500" />
                                    <span>Fortune 500 Companies</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Building className="h-5 w-5 text-[#2347FA]" />
                                    <span>Startup Unicorn</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    <span>BUMN & Government</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Globe className="h-5 w-5 text-purple-500" />
                                    <span>Multinational Corps</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Enhanced Company Cards */}
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {topCompanies.map((company, index) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                        delay: index * 0.1,
                                        duration: 0.5,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    className="group cursor-pointer"
                                >
                                    <Link href={`/companies/${company.id}`}>
                                        <div className="relative h-full rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[#2347FA]/10 hover:-translate-y-3 hover:scale-105">
                                            {/* Decorative elements */}
                                            <div className="absolute top-0 left-0 h-1 w-full rounded-t-3xl bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#2347FA]/5 to-[#3b56fc]/5 transition-all duration-500 group-hover:scale-150 group-hover:opacity-50"></div>
                                            
                                            {/* Premium badge for top companies */}
                                            {index < 3 && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <div className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                                        <Crown className="mr-1 h-3 w-3" />
                                                        Top
                                                    </div>
                                                </div>
                                            )}

                                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                                {/* Enhanced Company Logo */}
                                                <div className="relative">
                                                    <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 shadow-md ring-2 ring-gray-100 group-hover:ring-[#2347FA]/30 transition-all duration-300">
                                                        <Avatar className="h-full w-full">
                                                            {company.logo ? (
                                                                <AvatarImage 
                                                                    src={company.logo} 
                                                                    alt={company.name} 
                                                                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300" 
                                                                />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-bold text-xl">
                                                                    {company.name.charAt(0)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                    </div>
                                                    
                                                    {/* Verification badge */}
                                                    {company.is_verified && (
                                                        <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1.5 shadow-lg ring-2 ring-white">
                                                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                                                        </div>
                                                    )}

                                                    {/* Pulse animation for active companies */}
                                                    {company.active_jobs_count > 0 && (
                                                        <div className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-green-400">
                                                            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping"></div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Company Information */}
                                                <div className="w-full space-y-3">
                                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#2347FA] transition-colors duration-300">
                                                        {company.name}
                                                    </h3>
                                                    
                                                    {/* Stats row */}
                                                    <div className="flex items-center justify-center gap-4 text-xs">
                                                        <div className="flex items-center gap-1 text-green-600 font-medium">
                                                            <Briefcase className="h-3 w-3" />
                                                            <span>{company.active_jobs_count}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="truncate max-w-[60px]">{company.location}</span>
                                                        </div>
                                                    </div>

                                                    {/* Industry badge */}
                                                    {company.industry && (
                                                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                            {company.industry}
                                                        </Badge>
                                                    )}

                                                    {/* Company size */}
                                                    {company.size && (
                                                        <div className="text-xs text-gray-500">
                                                            {company.size} karyawan
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hover effect overlay */}
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2347FA]/5 to-[#3b56fc]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Enhanced CTA Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-16 text-center"
                        >
                            <div className="inline-flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-8 py-6 shadow-xl">
                                <div className="flex items-center space-x-3">
                                    <div className="flex -space-x-2">
                                        {/* Sample company avatars */}
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white"></div>
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 border-2 border-white"></div>
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-2 border-white"></div>
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                            +{statistics.total_companies - 3}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">Bergabung dengan perusahaan terkemuka lainnya</p>
                                        <p className="text-xs">Temukan talenta terbaik untuk tim Anda</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <Button asChild variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6">
                                        <Link href="/companies">
                                            Jelajahi Semua
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button asChild className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Link href="/employer/register">
                                            Daftar Sekarang
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
                            <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {aboutUs.values.map((value, index) => {
                                    const getIcon = (iconName: string) => {
                                        switch (iconName) {
                                            case 'heart':
                                                return <Heart className="h-8 w-8 text-blue-600" />;
                                            case 'users':
                                                return <Users className="h-8 w-8 text-blue-600" />;
                                            case 'target':
                                                return <Target className="h-8 w-8 text-blue-600" />;
                                            case 'globe':
                                                return <Globe className="h-8 w-8 text-blue-600" />;
                                            default:
                                                return <Building className="h-8 w-8 text-blue-600" />;
                                        }
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
                                                    {getIcon(value.icon)}
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
                            <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                                {aboutUs.stats.map((stat, index) => {
                                    const getStatIcon = (iconName: string) => {
                                        switch (iconName) {
                                            case 'building':
                                                return <Building className="h-6 w-6 text-blue-600" />;
                                            case 'users':
                                                return <Users className="h-6 w-6 text-blue-600" />;
                                            case 'briefcase':
                                                return <Briefcase className="h-6 w-6 text-blue-600" />;
                                            case 'award':
                                                return <Award className="h-6 w-6 text-blue-600" />;
                                            default:
                                                return <Building className="h-6 w-6 text-blue-600" />;
                                        }
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
                                            <div className="mb-4 flex items-center justify-center">{getStatIcon(stat.icon)}</div>
                                            <div className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl">{stat.number}</div>
                                            <div className="text-lg font-semibold text-gray-900">{stat.label}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Mission & Vision */}
                            <div className="grid gap-8 lg:grid-cols-2">
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

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                className="mx-auto max-w-2xl text-lg text-gray-600 leading-relaxed"
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
                                <Button asChild className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href="/jobs">
                                        Lihat Semua Lowongan
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Enhanced Job Cards Grid */}
                        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                            {featuredJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="group relative h-full cursor-pointer overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-[#2347FA]/10 hover:scale-105 hover:-translate-y-2">
                                        {/* Decorative elements */}
                                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

                                        <CardContent className="relative z-10 p-6">
                                            {/* Company Info */}
                                            <div className="mb-4 flex items-center space-x-4">
                                                <div className="relative">
                                                    <Avatar className="h-14 w-14 ring-2 ring-gray-100 group-hover:ring-[#2347FA]/20 transition-all duration-300">
                                                        {job.company.logo ? (
                                                            <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                        ) : (
                                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-semibold text-lg">
                                                                {job.company.name.charAt(0)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    </div>
                                                </div>
                                                
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-500">{job.company.name}</p>
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <MapPin className="mr-1 h-3 w-3" />
                                                        <span className="truncate">{job.company.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Job Title */}
                                            <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#2347FA] transition-colors duration-300">
                                                {job.title}
                                            </h3>

                                            {/* Job Details */}
                                            <div className="mb-4 space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-gray-500">
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-500">
                                                        <Briefcase className="mr-2 h-4 w-4" />
                                                        <span>
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
                                                        <Users className="mr-2 h-4 w-4" />
                                                        <span>{job.applications_count} pelamar</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-500">
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        <span>{new Date(job.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Salary */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">
                                                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                        {job.category.name}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Work Arrangement */}
                                            {job.work_arrangement && (
                                                <div className="mb-4">
                                                    <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                                                        {job.work_arrangement === 'remote' ? 'Remote' : 
                                                         job.work_arrangement === 'hybrid' ? 'Hybrid' : 
                                                         job.work_arrangement === 'onsite' ? 'On-site' : job.work_arrangement}
                                                    </Badge>
                                                </div>
                                            )}

                                            {/* Apply Button */}
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <Button asChild className="w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                                                    <Link href={`/jobs/${job.id}`}>
                                                        <span>Lamar Sekarang</span>
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>

                                            {/* Urgency indicator */}
                                            {job.application_deadline && new Date(job.application_deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
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
                            <div className="inline-flex items-center space-x-4 rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-6 py-4 shadow-lg">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span>Tersedia {statistics.total_jobs.toLocaleString()}+ lowongan lainnya</span>
                                </div>
                                <Button asChild variant="outline" className="border-[#2347FA]/20 text-[#2347FA] hover:bg-[#2347FA] hover:text-white rounded-full">
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
                    <section className="relative py-20 overflow-hidden">
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
                                    <Star className="h-4 w-4 text-[#2347FA] fill-current" />
                                    <span className="text-sm font-medium text-[#2347FA]">Success Stories</span>
                                    <Star className="h-4 w-4 text-[#2347FA] fill-current" />
                                </motion.div>

                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl"
                                >
                                    Kisah Sukses <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">Nyata</span>
                                </motion.h2>
                                
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="mx-auto max-w-3xl text-lg text-gray-600 leading-relaxed"
                                >
                                    Bergabunglah dengan ribuan profesional yang telah mentransformasi karir mereka dan meraih impian bersama KarirConnect
                                </motion.p>

                                {/* Statistics */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-8 flex justify-center items-center space-x-8 text-sm text-gray-600"
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
                                            className="group relative w-80 cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#2347FA]/10 hover:scale-105 hover:bg-white hover:-translate-y-1"
                                        >
                                            {/* Decorative element */}
                                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            <div className="flex flex-row items-start gap-3 mb-4">
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 group-hover:ring-[#2347FA]/20 transition-all duration-300">
                                                        {story.avatar_url ? (
                                                            <AvatarImage src={story.avatar_url} alt={story.name} />
                                                        ) : null}
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-semibold">
                                                            {story.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <figcaption className="text-sm font-semibold text-gray-900 truncate">
                                                        {story.name}
                                                    </figcaption>
                                                    <p className="text-xs text-[#2347FA] font-medium truncate">
                                                        {story.position}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate flex items-center mt-0.5">
                                                        <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        {story.company}
                                                    </p>
                                                </div>
                                                
                                                {story.salary_increase_percentage && (
                                                    <div className="flex flex-col items-end">
                                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs px-2 py-1">
                                                            +{story.salary_increase_percentage}%
                                                        </Badge>
                                                        <span className="text-xs text-green-600 font-medium mt-1">gaji naik</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <blockquote className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4 italic">
                                                "{story.story}"
                                            </blockquote>
                                            
                                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    {story.location && (
                                                        <div className="flex items-center">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            <span>{story.location}</span>
                                                        </div>
                                                    )}
                                                    {story.experience_years && (
                                                        <div className="flex items-center">
                                                            <Briefcase className="h-3 w-3 mr-1" />
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
                                
                                <Marquee reverse pauseOnHover className="[--duration:25s] [--gap:1.5rem] mt-6">
                                    {successStories.slice().reverse().map((story) => (
                                        <div
                                            key={`reverse-${story.id}`}
                                            className="group relative w-80 cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#2347FA]/10 hover:scale-105 hover:bg-white hover:-translate-y-1"
                                        >
                                            {/* Decorative element */}
                                            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            <div className="flex flex-row items-start gap-3 mb-4">
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 group-hover:ring-[#2347FA]/20 transition-all duration-300">
                                                        {story.avatar_url ? (
                                                            <AvatarImage src={story.avatar_url} alt={story.name} />
                                                        ) : null}
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-semibold">
                                                            {story.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <figcaption className="text-sm font-semibold text-gray-900 truncate">
                                                        {story.name}
                                                    </figcaption>
                                                    <p className="text-xs text-[#2347FA] font-medium truncate">
                                                        {story.position}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate flex items-center mt-0.5">
                                                        <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        {story.company}
                                                    </p>
                                                </div>
                                                
                                                {story.salary_increase_percentage && (
                                                    <div className="flex flex-col items-end">
                                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs px-2 py-1">
                                                            +{story.salary_increase_percentage}%
                                                        </Badge>
                                                        <span className="text-xs text-green-600 font-medium mt-1">gaji naik</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <blockquote className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4 italic">
                                                "{story.story}"
                                            </blockquote>
                                            
                                            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    {story.location && (
                                                        <div className="flex items-center">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            <span>{story.location}</span>
                                                        </div>
                                                    )}
                                                    {story.experience_years && (
                                                        <div className="flex items-center">
                                                            <Briefcase className="h-3 w-3 mr-1" />
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
                                <Button asChild size="lg" className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
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
                            className="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
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
                            className="grid grid-cols-3 gap-8 border-t border-white/20 pt-8"
                        >
                            <div className="text-center">
                                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">{statistics.total_jobs.toLocaleString()}+</div>
                                <div className="text-sm text-blue-200">Lowongan Aktif</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">{statistics.total_companies.toLocaleString()}+</div>
                                <div className="text-sm text-blue-200">Perusahaan Partner</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-1 text-2xl font-bold text-white md:text-3xl">95%</div>
                                <div className="text-sm text-blue-200">Tingkat Kepuasan</div>
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
