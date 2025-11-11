import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import type { Statistics } from '@/pages/welcome/types';

interface CallToActionSectionProps {
    statistics: Statistics;
}

const CallToActionSection = ({ statistics }: CallToActionSectionProps) => (
    <section className="relative overflow-hidden py-20">
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
                className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
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
                className="mb-8 flex flex-col items-center justify-center gap-4 sm:mb-12 sm:flex-row"
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
                <div className="w-full sm:w-auto">
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 sm:w-auto"
                    >
                        Jelajahi Lowongan
                        <Search className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-6 border-t border-white/20 pt-6 sm:grid-cols-3 sm:gap-8 sm:pt-8"
            >
                <div className="text-center">
                    <div className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">{statistics.total_jobs.toLocaleString()}+</div>
                    <div className="text-xs text-blue-200 sm:text-sm">Lowongan Aktif</div>
                </div>
                <div className="text-center">
                    <div className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                        {statistics.total_companies.toLocaleString()}+
                    </div>
                    <div className="text-xs text-blue-200 sm:text-sm">Perusahaan Partner</div>
                </div>
                <div className="text-center">
                    <div className="mb-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">95%</div>
                    <div className="text-xs text-blue-200 sm:text-sm">Tingkat Kepuasan</div>
                </div>
            </motion.div>
        </div>

        <div className="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute right-10 bottom-20 h-16 w-16 animate-bounce rounded-full bg-blue-300/10 backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 h-3 w-3 animate-ping rounded-full bg-blue-200/20"></div>
    </section>
);

export default CallToActionSection;
