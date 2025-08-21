import { FlickeringGrid } from '@/components/magicui/flickering-grid';
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
import { ArrowRight, Award, Briefcase, Building, CheckCircle, Globe, Heart, MapPin, Quote, Search, Target, Users } from 'lucide-react';

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
    candidate_name: string;
    job_title: string;
    company_name: string;
    hired_at: string;
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

                {/* Active Employers */}
                <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20" id="companies">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-4 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
                            >
                                <Briefcase className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Perusahaan Partner</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="mb-4 text-3xl font-bold text-gray-900"
                            >
                                Dipercaya Perusahaan Terkemuka
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto max-w-2xl text-gray-600"
                            >
                                Lebih dari {statistics.total_companies.toLocaleString()}+ perusahaan mempercayai platform kami
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                            {topCompanies.map((company, index) => (
                                <motion.div
                                    key={company.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative mb-4">
                                                <div className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-3 shadow-sm">
                                                    <Avatar className="h-full w-full">
                                                        {company.logo ? (
                                                            <AvatarImage src={company.logo} alt={company.name} className="object-contain p-1" />
                                                        ) : (
                                                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-lg font-bold text-white">
                                                                {company.name.charAt(0)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                </div>
                                                {company.is_verified && (
                                                    <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-sm ring-2 ring-white">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full space-y-2">
                                                <h3 className="line-clamp-2 text-sm leading-tight font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                                    {company.name}
                                                </h3>
                                                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                                    <Briefcase className="h-3 w-3" />
                                                    <span>{company.active_jobs_count} lowongan aktif</span>
                                                </div>
                                                <div className="line-clamp-1 text-xs text-gray-400">{company.location}</div>
                                            </div>
                                        </div>

                                        {/* Hover indicator */}
                                        <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transform rounded-b-2xl bg-gradient-to-r from-blue-600 to-blue-700 transition-transform duration-300 group-hover:scale-x-100"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 text-center"
                        >
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                Lihat Semua Perusahaan
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
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

                {/* Latest Jobs */}
                <section className="bg-gray-50 py-16" id="jobs">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">Lowongan Terbaru</h2>
                                <p className="mt-2 text-gray-600">Peluang karir terbaik menunggu Anda</p>
                            </div>
                            <Button variant="outline" className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white">
                                Lihat Semua
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            {featuredJobs.map((job, index) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-sm transition-all duration-300 hover:shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <Avatar className="h-12 w-12 flex-shrink-0">
                                                    {job.company.logo ? (
                                                        <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                    ) : (
                                                        <AvatarFallback className="bg-[#2347FA] text-white">
                                                            {job.company.name.charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="cursor-pointer text-lg font-semibold text-gray-900 transition-colors hover:text-[#2347FA]">
                                                                {job.title}
                                                            </h3>
                                                            <p className="font-medium text-gray-600">{job.company.name}</p>
                                                        </div>
                                                        {job.featured && (
                                                            <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700">Featured</Badge>
                                                        )}
                                                    </div>

                                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            <MapPin className="mr-1 h-4 w-4" />
                                                            {job.location}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Briefcase className="mr-1 h-4 w-4" />
                                                            {job.employment_type === 'full_time'
                                                                ? 'Full Time'
                                                                : job.employment_type === 'part_time'
                                                                  ? 'Part Time'
                                                                  : job.employment_type === 'contract'
                                                                    ? 'Contract'
                                                                    : job.employment_type}
                                                        </span>
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between">
                                                        <span className="text-lg font-bold text-[#2347FA]">
                                                            {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">{job.applications_count} pelamar</span>
                                                    </div>

                                                    <div className="mt-4">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {job.category.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                {successStories.length > 0 && (
                    <section className="py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">Success Stories</h2>
                                <p className="mx-auto max-w-2xl text-gray-600">
                                    Bergabunglah dengan ribuan profesional yang telah menemukan karir impian mereka
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {successStories.slice(0, 6).map((story, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
                                            <CardContent className="p-6">
                                                <div className="mb-4 flex items-center">
                                                    <Quote className="h-8 w-8 text-[#2347FA] opacity-60" />
                                                </div>
                                                <p className="mb-4 text-gray-700 italic">
                                                    "KarirConnect membantu saya mendapatkan posisi {story.job_title} di {story.company_name}. Proses
                                                    yang mudah dan efisien!"
                                                </p>
                                                <div className="flex items-center">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-[#2347FA] text-white">
                                                            {story.candidate_name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-3">
                                                        <p className="font-semibold text-gray-900">{story.candidate_name}</p>
                                                        <p className="text-sm text-gray-600">{story.job_title}</p>
                                                        <p className="text-xs text-gray-500">{story.company_name}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
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
