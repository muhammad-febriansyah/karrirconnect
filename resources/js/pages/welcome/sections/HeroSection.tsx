import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypingAnimation } from '@/components/ui/typing-animation';
import type { Settings, Statistics } from '@/pages/welcome/types';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, MapPin, Search, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
    settings?: Settings;
    statistics: Statistics;
    siteName: string;
}

const HeroSection = ({ settings, statistics, siteName }: HeroSectionProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.append('search', searchQuery.trim());
        }
        if (locationQuery.trim()) {
            params.append('location', locationQuery.trim());
        }

        const queryString = params.toString();
        const url = queryString ? `/jobs?${queryString}` : '/jobs';
        router.visit(url);
    };

    function LoopingTyping() {
        const texts = ['Cari pekerjaan ', 'Cari perusahaan'];

        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % texts.length);
            }, 3000);

            return () => clearInterval(interval);
        }, []);

        return (
            <TypingAnimation
                key={currentIndex} // Ini penting biar re-render tiap ganti text
                className="text-sm text-gray-400 sm:text-base"
                duration={100}
            >
                {texts[currentIndex]}
            </TypingAnimation>
        );
    }

    return (
        <section className="relative overflow-hidden bg-white pt-32 pb-12 lg:pt-40 lg:pb-16">
            <div className="absolute inset-0 z-0">
                <FlickeringGrid className="h-full w-full" squareSize={4} gridGap={6} color="rgb(59, 130, 246)" maxOpacity={0.1} flickerChance={0.1} />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="order-2 text-center lg:order-1 lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
                        >
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-medium text-blue-700">Platform Karir Terpercaya</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto mb-4 text-3xl leading-tight font-bold text-balance sm:text-4xl lg:mx-0 lg:max-w-4xl lg:text-4xl"
                        >
                            {settings?.hero_title ? (
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text whitespace-pre-line text-transparent">
                                    {settings.hero_title}
                                </span>
                            ) : (
                                <>
                                    <span className="text-gray-900">Temukan Karir </span>
                                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Impian
                                    </span>
                                    <br />
                                    <span className="text-gray-900">Anda di {siteName}</span>
                                </>
                            )}
                        </motion.h1>

                        {/* <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg"
                        >
                            {settings?.hero_subtitle || (
                                <>
                                    {siteDescription}. Bergabunglah dengan lebih dari{' '}
                                    <span className="font-semibold text-gray-900">{statistics.total_candidates.toLocaleString()}+</span> talenta dan{' '}
                                    <span className="font-semibold text-gray-900">{statistics.total_companies.toLocaleString()}+</span> perusahaan
                                    terpercaya.
                                </>
                            )}
                        </motion.p> */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
                        >
                            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:gap-4 md:grid md:grid-cols-5 md:items-center">
                                <div className="relative md:col-span-2">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder=""
                                        className="h-10 rounded-lg border-gray-300 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:h-12 sm:pl-12 sm:text-base"
                                    />
                                    {!searchQuery && (
                                        <div className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 sm:left-12">
                                            <LoopingTyping />
                                        </div>
                                    )}
                                </div>

                                <div className="relative md:col-span-2">
                                    <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                                    <Input
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        placeholder="Kota atau wilayah"
                                        className="h-10 rounded-lg border-gray-300 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:h-12 sm:pl-12 sm:text-base"
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <Button
                                        type="submit"
                                        className="h-10 w-full rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 sm:h-12 sm:text-base"
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        <span>Cari</span>
                                    </Button>
                                </div>
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="mb-8 flex flex-col items-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="/register"
                                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto"
                            >
                                <span className="relative z-10 flex items-center">
                                    Daftar Gratis
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            </Link>
                            <Link
                                href="/lowongan"
                                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-3.5 font-semibold text-gray-700 transition-all duration-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 sm:w-auto"
                            >
                                Lihat Semua Lowongan
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.75 }}
                            className="mb-8"
                        >
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">Dipercaya oleh</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-blue-600">{statistics.total_companies.toLocaleString()}+</span>
                                    <span>perusahaan ternama di Indonesia</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
                        >
                            <div className="text-center lg:text-left">
                                <div className="mb-1 text-2xl font-bold text-blue-600 sm:text-3xl lg:text-4xl">
                                    <NumberTicker
                                        value={statistics.total_jobs}
                                        className="text-2xl font-bold text-blue-600 sm:text-3xl lg:text-4xl"
                                        delay={0.2}
                                    />
                                    +
                                </div>
                                <div className="text-xs text-gray-600 sm:text-sm">Lowongan Kerja</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="mb-1 text-2xl font-bold text-blue-600 sm:text-3xl lg:text-4xl">
                                    <NumberTicker
                                        value={statistics.total_companies}
                                        className="text-2xl font-bold text-blue-600 sm:text-3xl lg:text-4xl"
                                        delay={0.4}
                                    />
                                    +
                                </div>
                                <div className="text-xs text-gray-600 sm:text-sm">Perusahaan</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="mb-1 text-2xl font-bold text-blue-600 sm:text-3xl lg:text-4xl">
                                    <NumberTicker
                                        value={statistics.total_candidates}
                                        className="text-2xl font-bold text-blue-600 sm:text-3xl lg:text-4xl"
                                        delay={0.6}
                                    />
                                    +
                                </div>
                                <div className="text-xs text-gray-600 sm:text-sm">Pengguna</div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="order-1 lg:order-2"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-50 opacity-40 blur-2xl"></div>
                            <div className="relative overflow-hidden">
                                {settings?.hero_image ? (
                                    <img
                                        src={settings.hero_image}
                                        alt={`${siteName} Platform`}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600">
                                        <div className="text-center text-white">
                                            <Briefcase className="mx-auto mb-4 h-16 w-16" />
                                            <h3 className="text-2xl font-bold">{siteName}</h3>
                                            <p className="mt-2 text-blue-100">Platform Karir Terpercaya</p>
                                        </div>
                                    </div>
                                )}
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div> */}
                            </div>

                            {/* <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-900/5 lg:block"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                        <Trophy className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Platform Terpercaya</div>
                                        <div className="text-xs text-gray-500">Sejak 2025</div>
                                    </div>
                                </div>
                            </motion.div> */}

                            {/* <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                                className="absolute -top-6 -right-6 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-900/5 lg:block"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                        <Users className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-gray-900">{statistics.total_candidates.toLocaleString()}+</div>
                                        <div className="text-xs text-gray-500">Pengguna Aktif</div>
                                    </div>
                                </div>
                            </motion.div> */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
