import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Marquee } from '@/components/magicui/marquee';
import {
    ArrowRight,
    Award,
    Briefcase,
    Building,
    CheckCircle,
    Heart,
    MapPin,
    Star,
    TrendingUp,
} from 'lucide-react';
import type { Statistics, SuccessStory } from '@/pages/welcome/types';

interface SuccessStoriesSectionProps {
    successStories: SuccessStory[];
    statistics: Statistics;
}

const renderCard = (story: SuccessStory, keyValue: string) => (
    <div
        key={keyValue}
        className="group relative w-64 cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-[#2347FA]/10 sm:w-72 md:w-80"
    >
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

        <div className="mb-3 flex flex-row items-start gap-2.5 sm:mb-4 sm:gap-3">
            <div className="relative flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-[#2347FA]/20 sm:h-12 sm:w-12">
                    {story.avatar_url ? <AvatarImage src={story.avatar_url} alt={story.name} /> : null}
                    <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-xs font-semibold text-white sm:text-sm">
                        {story.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-green-500 sm:h-4 sm:w-4">
                    <CheckCircle className="h-2 w-2 text-white sm:h-2.5 sm:w-2.5" />
                </div>
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
                <figcaption className="truncate text-xs font-semibold text-gray-900 sm:text-sm">{story.name}</figcaption>
                <p className="truncate text-xs font-medium text-[#2347FA]">{story.position}</p>
                <p className="mt-0.5 flex items-center truncate text-xs text-gray-500">
                    <Building className="mr-1 h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                    <span className="truncate">{story.company}</span>
                </p>
            </div>

            {story.salary_increase_percentage && (
                <div className="flex flex-shrink-0 flex-col items-end">
                    <Badge className="border-0 bg-gradient-to-r from-green-500 to-emerald-500 px-1.5 py-0.5 text-xs text-white sm:px-2 sm:py-1">
                        +{story.salary_increase_percentage}%
                    </Badge>
                    <span className="mt-0.5 whitespace-nowrap text-xs font-medium text-green-600 sm:mt-1">gaji naik</span>
                </div>
            )}
        </div>

        <blockquote className="mb-3 line-clamp-3 text-xs leading-relaxed italic text-gray-700 sm:mb-4 sm:text-sm">
            "{story.story}"
        </blockquote>

        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 text-xs text-gray-500 sm:pt-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3">
                {story.location && (
                    <div className="flex min-w-0 items-center">
                        <MapPin className="mr-1 h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                        <span className="truncate text-xs">{story.location}</span>
                    </div>
                )}
                {story.experience_years && (
                    <div className="flex items-center whitespace-nowrap">
                        <Briefcase className="mr-1 h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                        <span className="text-xs">{story.experience_years} th</span>
                    </div>
                )}
            </div>
            <div className="flex flex-shrink-0 gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 sm:h-3 sm:w-3" />
                ))}
            </div>
        </div>
    </div>
);

const SuccessStoriesSection = ({ successStories, statistics }: SuccessStoriesSectionProps) => {
    if (successStories.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden py-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMzQ3RkEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

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
                        className="mb-3 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl"
                    >
                        Kisah Sukses <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">Nyata</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto max-w-3xl px-4 text-base leading-relaxed text-gray-600 sm:px-0 sm:text-lg"
                    >
                        Bergabunglah dengan ribuan profesional yang telah mentransformasi karir mereka dan meraih impian bersama KarirConnect
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 flex flex-col items-center justify-center gap-3 text-xs text-gray-600 sm:mt-8 sm:flex-row sm:gap-6 sm:text-sm md:gap-8"
                    >
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <TrendingUp className="h-3.5 w-3.5 flex-shrink-0 text-green-500 sm:h-4 sm:w-4" />
                            <span className="whitespace-nowrap">Rata-rata kenaikan gaji 85%</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Award className="h-3.5 w-3.5 flex-shrink-0 text-[#2347FA] sm:h-4 sm:w-4" />
                            <span className="whitespace-nowrap">1000+ sukses placement</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Heart className="h-3.5 w-3.5 flex-shrink-0 text-red-500 sm:h-4 sm:w-4" />
                            <span className="whitespace-nowrap">98% kepuasan pengguna</span>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl border border-blue-50 bg-white/60 p-3 sm:rounded-3xl sm:p-4"
                >
                    <div className="relative">
                        <Marquee pauseOnHover className="[--duration:25s] [--gap:0.75rem] sm:[--gap:1rem] md:[--gap:1.25rem]">
                            {successStories.map((story) => renderCard(story, story.id.toString()))}
                        </Marquee>
                        <Marquee reverse pauseOnHover className="mt-4 [--duration:25s] [--gap:0.75rem] sm:mt-6 sm:[--gap:1rem] md:[--gap:1.25rem]">
                            {successStories
                                .slice()
                                .reverse()
                                .map((story) => renderCard(story, `reverse-${story.id}`))}
                        </Marquee>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-20 md:w-24"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-20 md:w-24"></div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 text-center sm:mt-12"
                >
                    <Button
                        asChild
                        size="lg"
                        className="h-11 w-full rounded-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] px-6 text-sm text-white shadow-lg transition-all duration-300 hover:from-[#1a3af0] hover:to-[#2d47f5] hover:shadow-xl sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                    >
                        <Link href="/jobs" className="flex items-center justify-center">
                            Mulai Perjalanan Karir Anda
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <p className="mt-3 px-4 text-xs text-gray-500 sm:text-sm">
                        Bergabunglah dengan {statistics.total_candidates.toLocaleString()}+ profesional lainnya
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default SuccessStoriesSection;
