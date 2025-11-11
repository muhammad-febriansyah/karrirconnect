import { resolveAssetUrl } from '@/lib/utils';
import type { Company, Statistics } from '@/pages/welcome/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building, CheckCircle, Crown, MapPin, Shield } from 'lucide-react';

interface TrustedCompaniesSectionProps {
    statistics: Statistics;
    topCompanies: Company[];
}

const TrustedCompaniesSection = ({ statistics, topCompanies }: TrustedCompaniesSectionProps) => {
    if (topCompanies.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white py-16 sm:py-20 lg:py-24" id="companies">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMzQ3RkEiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djJ6bTAtNHYyem0wLTR2MnptMC00djJ6bTAtNHYyem0wLTR2MnptMC00djJ6bTAtNHYyem0wLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center sm:mb-16"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-2 backdrop-blur-sm"
                    >
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Dipercaya Ribuan Perusahaan</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-4 text-3xl leading-snug font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
                    >
                        Dipercaya oleh{' '}
                        <span className="bg-gradient-to-r from-[#2347FA] to-blue-600 bg-clip-text text-transparent">
                            {statistics.total_companies.toLocaleString()}+
                        </span>
                        <br className="hidden sm:block" />
                        <span className="block text-2xl font-semibold text-gray-700 sm:inline sm:text-4xl lg:text-5xl"> Perusahaan Terkemuka</span>
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg"
                    >
                        Dari startup inovatif hingga korporasi terkemuka, perusahaan pilihan Indonesia menemukan talenta terbaik di KarirConnect
                    </motion.p>
                </motion.div>

                {/* Companies Grid - Modern card layout */}
                <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    {topCompanies.map((company, index) => {
                        const logoUrl = company.logo ? resolveAssetUrl(company.logo) : null;
                        const initial = company.name.charAt(0).toUpperCase();
                        const sizeLabel = company.size || 'Perusahaan berkembang';

                        return (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <Link href={`/companies/${company.id}`}>
                                    <div className="group relative flex h-full flex-col rounded-[28px] border border-slate-100 bg-white/95 p-5 shadow-[0_18px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_26px_40px_rgba(35,71,250,0.15)]">
                                        <div className="flex items-start justify-between">
                                            <div className="relative">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2347FA] to-blue-600 text-lg font-semibold text-white shadow-inner sm:h-16 sm:w-16">
                                                    {logoUrl ? (
                                                        <img src={logoUrl} alt={company.name} className="h-10 w-10 object-contain" />
                                                    ) : (
                                                        <span>{initial}</span>
                                                    )}
                                                </div>
                                                {company.is_verified && (
                                                    <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-sm ring-2 ring-white">
                                                        <div className="rounded-full bg-emerald-500 p-0.5">
                                                            <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {index < 3 && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 shadow-sm">
                                                    <Crown className="h-3.5 w-3.5" />
                                                    Mitra pilihan
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-1">
                                            <p className="line-clamp-1 text-base font-semibold text-slate-900">{company.name}</p>
                                            {company.industry && <p className="text-sm text-slate-500">{company.industry}</p>}
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin className="h-3.5 w-3.5 text-[#2347FA]" />
                                                <span className="truncate">{company.location}</span>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                                                <Briefcase className="h-3.5 w-3.5 text-[#2347FA]" />
                                                {company.active_jobs_count ?? 0} lowongan aktif
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                                                <Building className="h-3.5 w-3.5 text-[#2347FA]" />
                                                {company.total_job_posts ?? 0} total posting
                                            </span>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-400">
                                            <span>{sizeLabel}</span>
                                            <ArrowRight className="h-4 w-4 text-[#2347FA] opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrustedCompaniesSection;
