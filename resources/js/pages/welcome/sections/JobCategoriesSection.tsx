import { Button } from '@/components/ui/button';
import type { JobCategory } from '@/pages/welcome/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase } from 'lucide-react';

interface JobCategoriesSectionProps {
    jobCategories: JobCategory[];
}

const JobCategoriesSection = ({ jobCategories }: JobCategoriesSectionProps) => {
    if (jobCategories.length === 0) {
        return null;
    }

    return (
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
                            <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-100 bg-white/95 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-[0_26px_50px_rgba(35,71,250,0.12)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-transparent to-indigo-50/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="relative z-10 flex h-full flex-col space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e0e7ff] to-[#c7d2fe] text-3xl text-blue-600 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                                                {category.icon ? (
                                                    <img src={`/storage/${category.icon}`} alt={category.name} className="h-9 w-9 object-contain" />
                                                ) : (
                                                    <Briefcase className="h-8 w-8 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs tracking-wide text-slate-400 uppercase">Kategori</p>
                                                <h3 className="text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{category.description}</p>

                                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                            Tersedia sekarang
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            Tren karir tinggi
                                        </span>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-4">
                                        <div className="text-sm font-medium text-slate-500">Lihat peluang</div>
                                        <div className="flex items-center text-blue-600 transition-all duration-300 group-hover:translate-x-1">
                                            <span className="text-sm font-semibold">Telusuri kategori</span>
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-indigo-200 bg-white px-8 py-3 font-semibold text-indigo-600 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
                    >
                        <Link href="/jobs">
                            Lihat Semua Kategori
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default JobCategoriesSection;
