import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NumberTicker } from '@/components/magicui/number-ticker';
import {
    ArrowRight,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Flame,
    MapPin,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import type { JobListing, Statistics } from '@/pages/welcome/types';

interface FeaturedJobsSectionProps {
    featuredJobs: JobListing[];
    statistics: Statistics;
}

const formatSalary = (min: number | null, max: number | null, currency: string, negotiable: boolean) => {
    if (negotiable) return 'Negotiable';
    if (!min && !max) return 'Competitive';

    const currencyLabel = !currency || currency.toUpperCase() === 'IDR' ? 'Rp' : currency.toUpperCase();

    const formatValue = (amount: number) => {
        if (currencyLabel === 'Rp') {
            if (amount >= 1_000_000) {
                return `${currencyLabel} ${Math.floor(amount / 1_000_000)} Jt`;
            }
            if (amount >= 1_000) {
                return `${currencyLabel} ${Math.floor(amount / 1_000)} Rb`;
            }
            return `${currencyLabel} ${amount.toLocaleString('id-ID')}`;
        }

        return `${currencyLabel} ${amount.toLocaleString('id-ID')}`;
    };

    if (min && max && min !== max) {
        return `${formatValue(min)} - ${formatValue(max)}`;
    }

    return formatValue(min || max || 0);
};

const getEmploymentTypeLabel = (type?: string) => {
    switch (type) {
        case 'full_time':
            return 'Full Time';
        case 'part_time':
            return 'Part Time';
        case 'contract':
            return 'Kontrak';
        case 'internship':
            return 'Magang';
        case 'freelance':
            return 'Freelance';
        default:
            return type ? type.replace(/_/g, ' ') : null;
    }
};

const getWorkArrangementLabel = (arrangement?: string) => {
    if (!arrangement) return null;
    const normalized = arrangement.toLowerCase();
    switch (normalized) {
        case 'remote':
            return 'Remote';
        case 'hybrid':
            return 'Hybrid';
        case 'on_site':
        case 'onsite':
            return 'On-site';
        default:
            return arrangement.replace(/_/g, ' ');
    }
};

const getCompanyLogoUrl = (logo: string | null) => {
    if (!logo) return null;
    return logo.startsWith('http') ? logo : `/storage/${logo}`;
};

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hari ini';
    if (diffInDays === 1) return '1 hari lalu';
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return `${Math.floor(diffInDays / 30)} bulan lalu`;
};

const FeaturedJobsSection = ({ featuredJobs, statistics }: FeaturedJobsSectionProps) => {
    if (featuredJobs.length === 0) {
        return null;
    }

    return (
        <section className="relative py-20" id="jobs">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjM0N0ZBIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                        className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
                    >
                        <div className="w-full sm:w-auto">
                            <Button
                                asChild
                                className="w-full rounded-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] px-6 py-2 text-white shadow-lg transition-all duration-300 hover:from-[#1a3af0] hover:to-[#2d47f5] hover:shadow-xl"
                            >
                                <Link href="/jobs">
                                    Lihat Semua Lowongan
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredJobs.map((job, index) => {
                        const companyLogo = getCompanyLogoUrl(job.company.logo);
                        const employmentLabel = getEmploymentTypeLabel(job.employment_type);
                        const arrangementLabel = getWorkArrangementLabel(job.work_arrangement);
                        const isUrgent = job.remaining_positions > 0 && job.remaining_positions <= 3;
                        const slotsLabel = job.remaining_positions > 0 ? `${job.remaining_positions} slot tersisa` : 'Kuota terpenuhi';
                        const slotsClasses =
                            job.remaining_positions > 0
                                ? isUrgent
                                    ? 'border border-rose-100 bg-rose-50 text-rose-600'
                                    : 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                                : 'border border-slate-200 bg-slate-100 text-slate-600';

                        return (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 * (index + 1) }}
                                className="h-full"
                            >
                                <Card className="group relative h-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2347FA] via-indigo-500 to-[#2347FA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    <CardContent className="flex h-full flex-col p-6">
                                        <div className="mb-4 flex items-start gap-4">
                                            <div className="relative">
                                                <Avatar className="h-14 w-14 flex-shrink-0 bg-slate-50 ring-2 ring-slate-100">
                                                    {companyLogo ? (
                                                        <AvatarImage src={companyLogo} alt={job.company.name} className="object-contain p-1.5" />
                                                    ) : (
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-indigo-500 text-lg font-semibold text-white">
                                                            {job.company.name.charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                {job.featured && (
                                                    <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-lg ring-2 ring-white">
                                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#2347FA]">
                                                    {job.featured && <span className="rounded-full bg-blue-50 px-2 py-0.5">Featured</span>}
                                                    {isUrgent && (
                                                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-600">Butuh cepat</span>
                                                    )}
                                                </div>
                                                <Link href={`/jobs/${job.slug}`}>
                                                    <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors hover:text-[#2347FA]">
                                                        {job.title}
                                                    </h3>
                                                </Link>
                                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                    <span className="font-semibold text-slate-800">{job.company.name}</span>
                                                    <span className="hidden text-slate-400 sm:inline">•</span>
                                                    {(job.location || job.company.location) && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-[#2347FA]" />
                                                            {job.location || job.company.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                                            {employmentLabel && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                                                    <Briefcase className="h-3.5 w-3.5 text-[#2347FA]" />
                                                    {employmentLabel}
                                                </span>
                                            )}
                                            {arrangementLabel && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-emerald-700">
                                                    <Sparkles className="h-3.5 w-3.5" />
                                                    {arrangementLabel}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-blue-700">
                                                {job.category.name}
                                            </span>
                                        </div>

                                            <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex items-center">
                                                        <DollarSign className="mr-1.5 h-5 w-5 text-[#2347FA]" />
                                                        <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-2xl font-bold text-transparent">
                                                        {formatSalary(
                                                            job.salary_min,
                                                            job.salary_max,
                                                            job.salary_currency,
                                                            job.salary_negotiable,
                                                        )}
                                                    </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[13px] font-semibold text-slate-700 shadow-sm">
                                                            <Users className="h-3.5 w-3.5 text-[#2347FA]" />
                                                            <NumberTicker
                                                                value={job.applications_count}
                                                                className="text-base font-bold text-[#2347FA]"
                                                                delay={0.3 + index * 0.1}
                                                            />
                                                            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">pelamar</span>
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${slotsClasses}`}>
                                                            <Flame className="h-3.5 w-3.5" />
                                                            {slotsLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            <div className="flex items-center justify-between rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                                    {job.positions_available} posisi dibuka
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5 text-orange-500" />
                                                    {formatTimeAgo(job.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-orange-500" />
                                                Postingan {formatTimeAgo(job.created_at)}
                                            </div>
                                            {job.application_deadline && (
                                                <div className="flex items-center gap-1 text-red-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    Deadline {new Date(job.application_deadline).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                asChild
                                                className="flex-1 bg-gradient-to-r from-[#2347FA] to-indigo-600 text-white shadow-md hover:from-[#1d3dfa] hover:to-indigo-700"
                                            >
                                                <Link href={`/jobs/${job.slug}`} className="flex items-center justify-center">
                                                    Lihat Detail
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-auto border-[#2347FA]/40 text-[#2347FA] hover:bg-[#2347FA] hover:text-white"
                                                asChild
                                            >
                                                <Link href="/jobs">Lowongan Lain</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 sm:mt-12"
                >
                    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 rounded-2xl border border-gray-200/50 bg-white/80 px-4 py-4 shadow-lg backdrop-blur-sm sm:flex-row sm:justify-center sm:gap-4 sm:px-6">
                        <div className="flex items-center justify-center gap-2 text-center text-sm text-gray-600 sm:text-left">
                            <TrendingUp className="h-4 w-4 flex-shrink-0 text-green-500" />
                            <span className="text-xs sm:text-sm">Tersedia {statistics.total_jobs.toLocaleString()}+ lowongan lainnya</span>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full rounded-full border-[#2347FA]/20 text-[#2347FA] hover:bg-[#2347FA] hover:text-white sm:w-auto"
                        >
                            <Link href="/jobs" className="flex items-center justify-center">
                                Jelajahi Semua
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedJobsSection;
