import { resolveAssetUrl } from '@/lib/utils';
import type { Company, Statistics } from '@/pages/welcome/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Building, CheckCircle, Crown, MapPin } from 'lucide-react';

interface TrustedCompaniesSectionProps {
    statistics: Statistics;
    topCompanies: Company[];
}

const TrustedCompaniesSection = ({ statistics, topCompanies }: TrustedCompaniesSectionProps) => {
    if (topCompanies.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-gray-50/20 py-8 sm:py-10" id="companies">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section - More Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5">
                            <Crown className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-xs font-semibold text-amber-700">Mitra Pilihan</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                            Perusahaan <span className="text-[#2347FA]">Terpercaya</span>
                        </h2>
                    </div>
                    <Link href="/companies" className="text-sm font-medium text-[#2347FA] hover:underline">
                        Lihat Semua
                        <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                    </Link>
                </motion.div>

                {/* Companies Grid - More Compact for Sticky Section */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {topCompanies.map((company, index) => {
                        const logoUrl = company.logo ? resolveAssetUrl(company.logo) : null;
                        const initial = company.name.charAt(0).toUpperCase();

                        return (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.03, duration: 0.3 }}
                            >
                                <Link href={`/companies/${company.id}`}>
                                    <div className="group relative flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                                        {/* Featured Badge for Top 3 */}
                                        {index < 3 && (
                                            <div className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 p-1.5 shadow-md">
                                                <Crown className="h-3 w-3 text-white" />
                                            </div>
                                        )}

                                        {/* Company Logo */}
                                        <div className="relative mb-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2347FA] to-blue-600 text-sm font-semibold text-white shadow-sm">
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt={company.name} className="h-8 w-8 object-contain" />
                                                ) : (
                                                    <span>{initial}</span>
                                                )}
                                            </div>
                                            {company.is_verified && (
                                                <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-0.5 shadow-sm ring-2 ring-white">
                                                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Company Name */}
                                        <p className="mb-2 line-clamp-1 text-center text-sm font-semibold text-slate-900">{company.name}</p>

                                        {/* Location */}
                                        <div className="mb-2 flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin className="h-3 w-3 flex-shrink-0 text-[#2347FA]" />
                                            <span className="truncate">{company.location}</span>
                                        </div>

                                        {/* Active Jobs Count */}
                                        <div className="w-full rounded-lg bg-blue-50 px-2 py-1.5 text-center">
                                            <div className="text-xs font-semibold text-[#2347FA]">
                                                {company.active_jobs_count ?? 0} Lowongan
                                            </div>
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
