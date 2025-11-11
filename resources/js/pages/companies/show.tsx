import { FlickeringGrid } from '@/components/magicui/flickering-grid';
// import ModernFooter from '@/components/modern-footer';
// import ModernNavbar from '@/components/modern-navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Briefcase, Building2, Calendar, CheckCircle, ChevronRight, Clock, Globe, Mail, MapPin, Phone, Shield, Users } from 'lucide-react';
import React from 'react';
import type { SharedData } from '@/types';
import MainLayout from '@/layouts/main-layout';

interface JobListing {
    id: number;
    slug: string;
    title: string;
    type: string;
    location: string;
    salary_min: number | null;
    salary_max: number | null;
    experience_level: string;
    created_at: string;
    application_deadline: string | null;
    category: {
        id: number;
        name: string;
    } | null;
}

interface Company {
    id: number;
    name: string;
    description: string;
    logo: string | null;
    website: string;
    email: string | null;
    phone: string | null;
    industry: string;
    size: string;
    location: string;
    is_verified: boolean;
    is_active: boolean;
    job_listings: JobListing[];
}

interface CompanyShowProps {
    company: Company;
}

export default function CompanyShow({ company }: CompanyShowProps) {
    const { settings, statistics } = usePage<SharedData>().props;
    const [currentPage, setCurrentPage] = React.useState(1);
    const jobsPerPage = 6;
    const formatCompanySize = (size: string) => {
        const sizeMap: { [key: string]: string } = {
            startup: '1-10 karyawan',
            small: '11-50 karyawan',
            medium: '51-200 karyawan',
            large: '201-1000 karyawan',
            enterprise: '1000+ karyawan',
        };

        // Handle direct numeric ranges
        if (sizeMap[size]) {
            return sizeMap[size];
        }

        // Handle numeric ranges like "2-5", "10-20", etc.
        if (size.includes('-')) {
            return `${size} karyawan`;
        }

        // Handle single numbers
        if (/^\d+$/.test(size)) {
            const num = parseInt(size);
            if (num === 1) return '1 karyawan';
            return `${size} karyawan`;
        }

        return size;
    };

    const formatSalary = (min: number | null, max: number | null) => {
        if (!min && !max) return 'Gaji tidak disebutkan';
        const formatValue = (amount: number) => {
            if (amount >= 1_000_000) {
                const value = amount / 1_000_000;
                const formatted = Number.isInteger(value) ? value : parseFloat(value.toFixed(1));
                return `Rp ${formatted} Jt`;
            }
            if (amount >= 1_000) {
                const value = amount / 1_000;
                const formatted = Number.isInteger(value) ? value : parseFloat(value.toFixed(1));
                return `Rp ${formatted} Rb`;
            }
            return `Rp ${amount.toLocaleString('id-ID')}`;
        };

        if (min && max) {
            if (min === max) return formatValue(min);
            return `${formatValue(min)} - ${formatValue(max)}`;
        }
        if (min) return `Mulai dari ${formatValue(min)}`;
        if (max) return `Hingga ${formatValue(max)}`;
        return 'Gaji tidak disebutkan';
    };

    const formatExperienceLevel = (level: string) => {
        const levelMap: { [key: string]: string } = {
            entry: 'Entry Level',
            mid: 'Mid Level',
            senior: 'Senior Level',
            lead: 'Lead/Manager',
            director: 'Director',
        };
        return levelMap[level] || level;
    };

    const formatJobType = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            contract: 'Kontrak',
            internship: 'Magang',
            freelance: 'Freelance',
        };
        return typeMap[type] || type;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const heroStats = [
        {
            label: 'Lowongan aktif',
            value: `${company.job_listings.length} posisi`,
            caption: 'Sedang dibuka',
            icon: Briefcase,
            accent: 'bg-[#2E4DF7]/10 text-[#2E4DF7]',
        },
        {
            label: 'Ukuran tim',
            value: formatCompanySize(company.size),
            caption: 'Jumlah karyawan',
            icon: Users,
            accent: 'bg-[#2E4DF7]/10 text-[#2E4DF7]',
        },
        {
            label: 'Status',
            value: company.is_verified ? 'Terverifikasi' : 'Belum verifikasi',
            caption: company.is_verified ? 'Perusahaan terpercaya' : 'Menunggu verifikasi',
            icon: Shield,
            accent: 'bg-[#2E4DF7]/10 text-[#2E4DF7]',
        },
    ];

    const getDaysAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 hari yang lalu';
        if (diffDays < 30) return `${diffDays} hari yang lalu`;
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return months === 1 ? '1 bulan yang lalu' : `${months} bulan yang lalu`;
        }
        const years = Math.floor(diffDays / 365);
        return years === 1 ? '1 tahun yang lalu' : `${years} tahun yang lalu`;
    };

    // Pagination logic
    const totalPages = Math.ceil(company.job_listings.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const currentJobs = company.job_listings.slice(startIndex, startIndex + jobsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to job listings section
        const jobsSection = document.getElementById('job-listings-section');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <MainLayout currentPage="companies">
            <Head title={`${company.name} - Detail Perusahaan`} />

                {/* Hero Section */}
                <section className="relative bg-slate-50/90 py-24">
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(59, 130, 246)"
                            maxOpacity={0.035}
                            flickerChance={0.05}
                        />
                    </div>
                    <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
                    <div className="absolute bottom-0 left-[-6rem] h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-10">
                            <Link
                                href="/companies"
                                className="group inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-[#2E4DF7]"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Kembali ke Daftar Perusahaan
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_30px_70px_rgba(15,23,42,0.07)] backdrop-blur sm:rounded-3xl sm:p-6 lg:rounded-[28px] lg:p-8"
                        >
                            <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr] lg:gap-10">
                                <div className="flex flex-col gap-6 lg:gap-8">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                                        <div className="relative flex-shrink-0">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E4DF7] to-[#203BE5] text-xl font-semibold text-white shadow-lg sm:h-20 sm:w-20 sm:text-2xl">
                                                {company.logo ? (
                                                    <Avatar className="h-16 w-16 rounded-2xl bg-white shadow-inner sm:h-20 sm:w-20">
                                                        <AvatarImage src={company.logo} alt={company.name} className="object-contain p-2 sm:p-3" />
                                                        <AvatarFallback className="rounded-2xl bg-[#2E4DF7] text-xl font-bold text-white sm:text-2xl">
                                                            {company.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    company.name.charAt(0)
                                                )}
                                            </div>
                                            {company.is_verified ? (
                                                <span className="absolute -right-1.5 -bottom-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-white sm:-right-2 sm:-bottom-2 sm:h-8 sm:w-8">
                                                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                <Badge className="border-[#2E4DF7]/20 bg-[#2E4DF7]/10 text-xs text-[#2E4DF7]">
                                                    <Building2 className="mr-1 h-3 w-3" />
                                                    <span className="truncate max-w-[150px] sm:max-w-none">{company.industry || 'Industri belum tersedia'}</span>
                                                </Badge>
                                                <Badge variant="secondary" className="border-slate-200 bg-slate-100 text-xs text-slate-600">
                                                    <Users className="mr-1 h-3 w-3" />
                                                    <span className="truncate max-w-[120px] sm:max-w-none">{formatCompanySize(company.size)}</span>
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 sm:space-y-3">
                                                <h1 className="break-words text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">{company.name}</h1>
                                                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                                                    {company.description && company.description.trim().length > 0
                                                        ? company.description
                                                        : 'Perusahaan ini belum menambahkan deskripsi lengkap, namun Anda dapat menjelajahi informasi kontak dan lowongan yang tersedia.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                                        {heroStats.map(({ label, value, caption, icon: Icon, accent }) => (
                                            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:p-4">
                                                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${accent}`}>
                                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </div>
                                                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mt-4">{label}</p>
                                                <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">{value}</p>
                                                <p className="text-xs text-slate-500 sm:text-sm">{caption}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                                        <Link href="#job-listings-section" className="w-full sm:w-auto">
                                            <Button className="w-full rounded-full bg-gradient-to-r from-[#2E4DF7] to-[#203BE5] px-6 text-sm text-white shadow-md hover:from-[#203BE5] hover:to-[#1A32C7] sm:w-auto sm:text-base">
                                                Lihat Lowongan
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {company.website && (
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="w-full rounded-full border-slate-200 px-6 text-sm text-slate-600 hover:border-[#2E4DF7] hover:text-[#2E4DF7] sm:w-auto sm:text-base"
                                            >
                                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="mr-2 h-4 w-4" />
                                                    Kunjungi Website
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:rounded-[24px] lg:p-8">
                                    {/* Blue blur effects */}
                                    <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl" />
                                    <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />

                                    <div className="relative z-10 space-y-6">
                                        <div>
                                            <p className="text-xs tracking-[0.3em] text-[#2E4DF7]/60 uppercase">Kontak</p>
                                            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Terhubung dengan {company.name}</h2>
                                            <p className="mt-4 text-sm text-slate-600">
                                                Gunakan saluran berikut untuk berdiskusi langsung dengan tim HR atau perwakilan perusahaan.
                                            </p>
                                        </div>

                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 backdrop-blur-sm">
                                                <MapPin className="mt-1 h-4 w-4 text-[#2E4DF7]" />
                                                <div>
                                                    <p className="text-xs tracking-wide text-slate-500 uppercase">Alamat</p>
                                                    <p className="font-medium text-slate-900">{company.location}</p>
                                                </div>
                                            </div>
                                            {company.email && (
                                                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 backdrop-blur-sm">
                                                    <Mail className="mt-1 h-4 w-4 text-[#2E4DF7]" />
                                                    <div>
                                                        <p className="text-xs tracking-wide text-slate-500 uppercase">Email</p>
                                                        <a href={`mailto:${company.email}`} className="font-medium text-slate-900 hover:text-[#2E4DF7] hover:underline">
                                                            {company.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            {company.phone && (
                                                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 backdrop-blur-sm">
                                                    <Phone className="mt-1 h-4 w-4 text-[#2E4DF7]" />
                                                    <div>
                                                        <p className="text-xs tracking-wide text-slate-500 uppercase">Telepon</p>
                                                        <a href={`tel:${company.phone}`} className="font-medium text-slate-900 hover:text-[#2E4DF7] hover:underline">
                                                            {company.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {company.website && (
                                                <Button asChild className="w-full rounded-full bg-gradient-to-r from-[#2E4DF7] to-[#203BE5] text-white hover:from-[#203BE5] hover:to-[#1A32C7]">
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                        <Globe className="mr-2 h-4 w-4" />
                                                        Buka Website
                                                    </a>
                                                </Button>
                                            )}
                                            {company.email && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full rounded-full border-slate-200 bg-white text-slate-700 hover:border-[#2E4DF7] hover:text-[#2E4DF7]"
                                                >
                                                    <a href={`mailto:${company.email}`}>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Kirim Email
                                                    </a>
                                                </Button>
                                            )}
                                            {company.phone && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full rounded-full border-slate-200 bg-white text-slate-700 hover:border-[#2E4DF7] hover:text-[#2E4DF7]"
                                                >
                                                    <a href={`tel:${company.phone}`}>
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Hubungi via Telepon
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Company Overview */}
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[1.7fr,1fr]">
                            <Card className="rounded-3xl border border-slate-100 shadow-sm">
                                <CardHeader className="space-y-3">
                                    <CardTitle className="text-xl font-semibold text-slate-900">Tentang Perusahaan</CardTitle>
                                    <p className="text-sm text-slate-500">Profil singkat yang membantu kandidat mengenal perusahaan.</p>
                                </CardHeader>
                                <CardContent>
                                    {company.description && company.description.trim().length > 0 ? (
                                        <p className="text-base leading-relaxed text-slate-700">{company.description}</p>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                                                <Building2 className="h-7 w-7 text-slate-300" />
                                            </div>
                                            <p className="mt-4 text-sm text-slate-500">Deskripsi perusahaan belum tersedia.</p>
                                            <p className="text-xs text-slate-400">Informasi akan diperbarui ketika perusahaan menambahkannya.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border border-slate-100 shadow-sm">
                                <CardHeader className="space-y-3">
                                    <CardTitle className="text-xl font-semibold text-slate-900">Detail Utama</CardTitle>
                                    <p className="text-sm text-slate-500">Informasi penting bagi pencari kerja.</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm text-slate-600">
                                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <span className="font-medium text-slate-700">Lokasi</span>
                                            <span className="text-right text-slate-500">{company.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <span className="font-medium text-slate-700">Industri</span>
                                            <span className="text-right text-slate-500">{company.industry || 'Tidak disebutkan'}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <span className="font-medium text-slate-700">Ukuran Tim</span>
                                            <span className="text-right text-slate-500">{formatCompanySize(company.size)}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                            <span className="font-medium text-slate-700">Status</span>
                                            <span className="text-right text-slate-500">
                                                {company.is_verified ? 'Terverifikasi' : 'Belum verifikasi'}
                                            </span>
                                        </div>
                                        {company.website && (
                                            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                                                <span className="font-medium text-slate-700">Website</span>
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-right font-medium text-[#2E4DF7] hover:underline"
                                                >
                                                    {company.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Job Listings Section */}
                <section id="job-listings-section" className="bg-slate-50 py-16">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 text-center"
                        >
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#2E4DF7]/20 bg-[#2E4DF7]/10 px-4 py-2 text-sm font-semibold text-[#2E4DF7]">
                                <Briefcase className="h-4 w-4" /> Lowongan yang tersedia
                            </div>
                            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">Peluang Karier di {company.name}</h2>
                            <p className="mt-3 text-base text-slate-600">
                                {company.job_listings.length > 0
                                    ? `${company.job_listings.length} posisi terbuka yang dapat Anda eksplor.`
                                    : `Saat ini ${company.name} belum memiliki lowongan aktif.`}
                            </p>
                        </motion.div>

                        {company.job_listings.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
                            >
                                {currentJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: 0.1 * index }}
                                    >
                                        <Card className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2E4DF7] via-indigo-500 to-[#2E4DF7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            <CardContent className="flex h-full flex-col p-5">
                                                <div className="mb-4 flex items-start gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <Avatar className="h-12 w-12 ring-2 ring-slate-100 transition-all duration-300 group-hover:ring-[#2E4DF7]/20">
                                                            {company.logo ? (
                                                                <AvatarImage src={company.logo} alt={company.name} className="object-contain p-2" />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2E4DF7] to-indigo-600 text-lg font-semibold text-white">
                                                                    {company.name.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        {company.is_verified && (
                                                            <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                                                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <Link href={`/jobs/${job.slug}`}>
                                                            <h3 className="mb-1 line-clamp-2 text-base font-bold text-slate-900 transition-colors hover:text-[#2E4DF7] sm:text-lg">
                                                                {job.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-sm font-medium text-slate-600">{company.name}</p>
                                                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {getDaysAgo(job.created_at)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                    <span className="truncate">{job.location}</span>
                                                </div>

                                                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                                                    {job.category && (
                                                        <Badge className="border-0 bg-blue-50 text-blue-700">{job.category.name}</Badge>
                                                    )}
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                        <Briefcase className="mr-1 h-3 w-3" />
                                                        {formatJobType(job.type)}
                                                    </Badge>
                                                </div>

                                                <div className="mb-5 space-y-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-sm">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-xs font-medium text-slate-500">Kisaran Gaji</p>
                                                            <p className="text-lg font-semibold text-[#2E4DF7]">{formatSalary(job.salary_min, job.salary_max)}</p>
                                                        </div>
                                                        <div className="text-left sm:text-right">
                                                            <p className="text-xs font-medium text-slate-500">Pengalaman</p>
                                                            <p className="text-sm font-medium text-slate-700">{formatExperienceLevel(job.experience_level)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Diposting {formatDate(job.created_at)}
                                                        </span>
                                                        {job.application_deadline && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                Tutup {formatDate(job.application_deadline)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    <Link href={`/jobs/${job.slug}`} className="block">
                                                        <Button className="w-full bg-gradient-to-r from-[#2E4DF7] to-indigo-600 text-white hover:from-[#1d3dfa] hover:to-indigo-700">
                                                            Lamar Sekarang
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm"
                            >
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Briefcase className="h-8 w-8" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-900">Belum ada lowongan aktif</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Silakan kembali lagi nanti atau ikuti perusahaan ini untuk mendapatkan pemberitahuan.
                                </p>
                            </motion.div>
                        )}

                        {totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-12 flex justify-center"
                            >
                                <div className="flex items-center space-x-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="rounded-full px-3 text-slate-600 hover:text-[#2E4DF7] disabled:opacity-40"
                                    >
                                        <ArrowLeft className="mr-1 h-4 w-4" />
                                        Sebelumnya
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className={`rounded-full px-3 ${
                                                    currentPage === page
                                                        ? 'bg-[#2E4DF7] text-white hover:bg-[#243BE5]'
                                                        : 'text-slate-600 hover:text-[#2E4DF7]'
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="rounded-full px-3 text-slate-600 hover:text-[#2E4DF7] disabled:opacity-40"
                                    >
                                        Berikutnya
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>
            </MainLayout>
    );
}
