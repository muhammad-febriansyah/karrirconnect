import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { resolveAssetUrl } from '@/lib/utils';
// import ModernFooter from '@/components/modern-footer';
// import ModernNavbar from '@/components/modern-navbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, Clock, Eye, MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';
import MainLayout from '@/layouts/main-layout';

interface BlogPost {
    id: number;
    slug?: string;
    title: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar?: string | null;
        avatar_url?: string | null;
    };
    category?: string | null;
    tags?: string[] | null;
    featured_image?: string | null;
    published_at?: string | null;
    created_at?: string | null;
    reading_time?: number | null;
    views_count?: number | null;
    comments_count?: number | null;
    is_featured?: boolean;
}

interface BlogIndexProps {
    posts: {
        data: BlogPost[];
        current_page: number;
        last_page: number;
        total: number;
    };
    featuredPosts: BlogPost[] | null;
    categories: string[] | null;
    popularTags: string[] | null;
    filters: {
        search?: string;
        category?: string;
        tag?: string;
    };
}

export default function BlogIndex({ posts, filters }: BlogIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const accentGlowClasses = [
        'from-[#2347FA]/35 via-blue-500/20 to-cyan-400/25',
        'from-rose-500/35 via-pink-400/20 to-orange-400/25',
        'from-emerald-400/35 via-teal-400/20 to-sky-400/25',
    ];
    const accentBorderClasses = [
        'hover:border-[#2347FA]/40',
        'hover:border-rose-400/40',
        'hover:border-emerald-400/40',
    ];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);

        router.get('/blog', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());

        router.get('/blog', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: false,
        });
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) {
            return 'Tanggal menyusul';
        }
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatReadingTime = (minutes?: number | null) => {
        if (!minutes || Number.isNaN(minutes)) {
            return '5 min read';
        }
        return `${minutes} min read`;
    };

    return (
        <MainLayout currentPage="blog">
            <Head title="Blog - Tips Karir & Insight Industri" />
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-40 lg:pb-20">
                    {/* Flickering Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(139, 69, 19)"
                            maxOpacity={0.08}
                            flickerChance={0.1}
                        />
                    </div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3"
                            >
                                <BookOpen className="h-4 w-4 text-[#2347FA]" />
                                <span className="text-sm font-semibold text-[#2347FA]">Tips & Insight Karir Terbaru</span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl"
                            >
                                <span className="text-[#2347FA]">Blog</span> KarirConnect
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
                            >
                                Tips karir, insight industri, dan panduan pengembangan profesional untuk kesuksesan Anda
                            </motion.p>
                        </div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
                        >
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Cari artikel, tips karir..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="h-12 border-gray-300 pl-12 text-gray-900 placeholder-gray-400 focus:border-[#2347FA] focus:ring-[#2347FA]"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    className="h-12 bg-gradient-to-r from-[#2347FA] to-blue-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#1e40e0] hover:to-[#2347FA] hover:shadow-xl"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Modern Blog Posts Grid */}
                <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="mb-16 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-6 inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-sm"
                            >
                                <BookOpen className="h-5 w-5 text-[#2347FA]" />
                                <span className="text-sm font-semibold text-gray-700">Artikel Terbaru</span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl"
                            >
                                Eksplorasi{' '}
                                <span className="bg-gradient-to-r from-[#2347FA] to-blue-600 bg-clip-text text-transparent">Konten Inspiratif</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mx-auto max-w-2xl text-lg text-gray-600"
                            >
                                Temukan <span className="font-semibold text-[#2347FA]"><NumberTicker value={posts.data.length} className="font-semibold text-[#2347FA]" delay={0.1} /></span> dari{' '}
                                <span className="font-semibold text-[#2347FA]"><NumberTicker value={posts.total} className="font-semibold text-[#2347FA]" delay={0.2} /></span> artikel berkualitas untuk mengembangkan karir Anda
                            </motion.p>
                        </div>

                        {/* Blog Posts Grid */}
                        {posts.data.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {posts.data.map((post, index) => {
                                    const accentIndex = index % accentGlowClasses.length;
                                    const postSlug = post.slug ?? post.id;
                                    const displayDate = post.published_at ?? post.created_at;
                                    const limitedTags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 3) : [];
                                    const authorAvatar = resolveAssetUrl(post.author?.avatar_url ?? post.author?.avatar);
                                    const authorInitial = post.author?.name?.charAt(0)?.toUpperCase() ?? '?';
                                    const viewCount = post.views_count ?? 0;
                                    const commentCount = post.comments_count ?? 0;

                                    return (
                                        <motion.article
                                            key={post.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: 0.3 + index * 0.05,
                                                duration: 0.3,
                                                ease: 'easeOut',
                                            }}
                                            className="group h-full cursor-pointer"
                                        >
                                            <Card
                                                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_65px_rgba(35,71,250,0.18)] ${accentBorderClasses[accentIndex]}`}
                                            >
                                                <div
                                                    aria-hidden
                                                    className={`pointer-events-none absolute -inset-px -z-10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${accentGlowClasses[accentIndex]}`}
                                                />

                                                {post.featured_image ? (
                                                    <div className="relative overflow-hidden rounded-t-2xl">
                                                        <div className="aspect-[16/10] overflow-hidden">
                                                            <img
                                                                src={`/storage/${post.featured_image}`}
                                                                alt={post.title}
                                                                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                                                                onError={(e) => {
                                                                    const parent = e.currentTarget.closest('.aspect-\[16\/10\]') as HTMLElement;
                                                                    if (parent) parent.style.display = 'none';
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                        </div>

                                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                            {post.is_featured && (
                                                                <Badge className="rounded-full border-0 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                                    <span className="flex items-center gap-1">Featured</span>
                                                                </Badge>
                                                            )}
                                                            {post.category && (
                                                                <Badge className="rounded-full border-0 bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 shadow-md backdrop-blur-md">
                                                                    {post.category}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="absolute right-4 bottom-4">
                                                            <div className="flex items-center rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-xl backdrop-blur-md">
                                                                <Clock className="mr-1.5 h-3.5 w-3.5 text-[#2347FA]" />
                                                                {formatReadingTime(post.reading_time)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative overflow-hidden rounded-t-2xl">
                                                        <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#2347FA]/10 via-blue-100 to-indigo-100">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-[#2347FA]/5 to-blue-500/5" />
                                                            <BookOpen className="relative z-10 h-16 w-16 text-[#2347FA]/60" />
                                                        </div>
                                                    </div>
                                                )}

                                                <CardContent className="relative z-10 flex flex-1 flex-col p-7">
                                                    <div className="flex flex-1 flex-col">
                                                        <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-gray-600">
                                                            {post.category && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#2347FA]/10 px-3 py-1 text-[#2347FA]">
                                                                    <BookOpen className="h-3.5 w-3.5" />
                                                                    {post.category}
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600">
                                                                <Clock className="h-3.5 w-3.5 text-[#2347FA]" />
                                                                {formatReadingTime(post.reading_time)}
                                                            </span>
                                                            {displayDate && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600">
                                                                    <Calendar className="h-3.5 w-3.5 text-[#2347FA]" />
                                                                    {formatDate(displayDate)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <h3 className="mb-3 line-clamp-2 text-2xl leading-tight font-semibold text-gray-900 transition-colors duration-300 group-hover:text-[#2347FA]">
                                                            {post.title}
                                                        </h3>

                                                        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>

                                                        {!!limitedTags.length && (
                                                            <div className="mb-4 flex flex-wrap gap-2">
                                                                {limitedTags.map((tag) => (
                                                                    <Badge
                                                                        key={tag}
                                                                        variant="outline"
                                                                        className="rounded-full border-[#2347FA]/20 px-3 py-1 text-xs text-[#2347FA]"
                                                                    >
                                                                        #{tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-auto space-y-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-11 w-11 shadow-sm ring-2 ring-white/70">
                                                                <AvatarImage src={authorAvatar} alt={post.author.name} />
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-blue-600 text-sm font-semibold text-white">
                                                                    {authorInitial}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                                                                <p className="text-xs text-gray-500">Penulis KarirConnect</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                                                                <div className="flex items-center rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5">
                                                                    <Eye className="mr-1.5 h-3.5 w-3.5 text-[#2347FA]" />
                                                                    <span className="font-semibold">
                                                                        <NumberTicker value={viewCount} className="font-semibold" delay={0.3 + index * 0.1} /> views
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5">
                                                                    <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-[#2347FA]" />
                                                                    <span>{commentCount} diskusi</span>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                asChild
                                                                size="sm"
                                                                className="group/cta rounded-full bg-gradient-to-r from-[#2347FA] to-blue-600 px-5 py-2 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-[#1e40e0] hover:to-[#2347FA] hover:shadow-blue-500/50"
                                                            >
                                                                <Link href={`/blog/${postSlug}`} className="inline-flex items-center gap-2">
                                                                    Baca Artikel
                                                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.article>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="mx-auto max-w-md">
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
                                        <BookOpen className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">Tidak ada artikel ditemukan</h3>
                                    <p className="mb-8 leading-relaxed text-gray-600">
                                        Coba ubah kata kunci pencarian Anda untuk menemukan artikel yang sesuai
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Premium Pagination - Debug: Always show if posts exist */}
                        {posts && posts.data && posts.data.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mt-20 flex flex-col items-center space-y-6"
                            >
                                {/* Page Info */}
                                <div className="text-center">
                                    <p className="mb-2 text-sm text-gray-600">
                                        Halaman <span className="font-bold text-[#2347FA]">{posts.current_page || 1}</span> dari{' '}
                                        <span className="font-bold text-[#2347FA]">{posts.last_page || 1}</span>
                                    </p>
                                    <div className="mx-auto h-1.5 w-full max-w-xs rounded-full bg-gray-200">
                                        <div
                                            className="h-1.5 rounded-full bg-gradient-to-r from-[#2347FA] to-blue-600 transition-all duration-500"
                                            style={{ width: `${((posts.current_page || 1) / (posts.last_page || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-center space-x-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl backdrop-blur-sm">
                                    {/* Previous Button */}
                                    {(posts.current_page || 1) > 1 ? (
                                        <Button
                                            onClick={() => handlePageChange((posts.current_page || 1) - 1)}
                                            variant="ghost"
                                            className="transform rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-[#2347FA] hover:to-blue-600 hover:text-white"
                                        >
                                            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                                            Previous
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            disabled
                                            className="cursor-not-allowed rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400"
                                        >
                                            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                                            Previous
                                        </Button>
                                    )}

                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {(() => {
                                            const totalPages = posts.last_page || 1;
                                            const currentPage = posts.current_page || 1;
                                            const pages = [];

                                            // Show pages around current page (max 6 total)
                                            const maxPages = 6;
                                            let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
                                            const endPage = Math.min(totalPages, startPage + maxPages - 1);

                                            // Adjust start page if we're near the end
                                            if (endPage - startPage + 1 < maxPages) {
                                                startPage = Math.max(1, endPage - maxPages + 1);
                                            }

                                            // Show first page and ellipsis if needed
                                            if (startPage > 1) {
                                                pages.push(
                                                    <Button
                                                        key={1}
                                                        onClick={() => handlePageChange(1)}
                                                        variant="ghost"
                                                        className="h-10 w-10 transform rounded-xl text-sm font-bold text-gray-600 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-[#2347FA] hover:to-blue-600 hover:text-white"
                                                    >
                                                        1
                                                    </Button>,
                                                );
                                                if (startPage > 2) {
                                                    pages.push(
                                                        <span key="ellipsis1" className="px-2 py-2 font-bold text-gray-400">
                                                            ...
                                                        </span>,
                                                    );
                                                }
                                            }

                                            // Show pages in range
                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(
                                                    <Button
                                                        key={i}
                                                        onClick={() => handlePageChange(i)}
                                                        variant="ghost"
                                                        className={`h-10 w-10 transform rounded-xl text-sm font-bold transition-all duration-300 hover:scale-110 ${
                                                            i === currentPage
                                                                ? 'bg-gradient-to-r from-[#2347FA] to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#2347FA] hover:to-blue-600 hover:text-white'
                                                        }`}
                                                    >
                                                        {i}
                                                    </Button>,
                                                );
                                            }

                                            // Show last page and ellipsis if needed
                                            if (endPage < totalPages) {
                                                if (endPage < totalPages - 1) {
                                                    pages.push(
                                                        <span key="ellipsis2" className="px-2 py-2 font-bold text-gray-400">
                                                            ...
                                                        </span>,
                                                    );
                                                }
                                                pages.push(
                                                    <Button
                                                        key={totalPages}
                                                        onClick={() => handlePageChange(totalPages)}
                                                        variant="ghost"
                                                        className="h-10 w-10 transform rounded-xl text-sm font-bold text-gray-600 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-[#2347FA] hover:to-blue-600 hover:text-white"
                                                    >
                                                        {totalPages}
                                                    </Button>,
                                                );
                                            }

                                            return pages;
                                        })()}
                                    </div>

                                    {/* Next Button */}
                                    {(posts.current_page || 1) < (posts.last_page || 1) ? (
                                        <Button
                                            onClick={() => handlePageChange((posts.current_page || 1) + 1)}
                                            variant="ghost"
                                            className="transform rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-[#2347FA] hover:to-blue-600 hover:text-white"
                                        >
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            disabled
                                            className="cursor-not-allowed rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400"
                                        >
                                            Next
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Quick Jump */}
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <span>Lompat ke halaman:</span>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            max={posts.last_page || 1}
                                            defaultValue={posts.current_page || 1}
                                            className="h-8 w-16 rounded-lg border-gray-300 text-center text-xs focus:border-[#2347FA] focus:ring-[#2347FA]"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const target = e.target as HTMLInputElement;
                                                    const page = parseInt(target.value);
                                                    if (page >= 1 && page <= (posts.last_page || 1)) {
                                                        handlePageChange(page);
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 rounded-lg border-gray-300 px-3 text-xs hover:border-[#2347FA] hover:text-[#2347FA]"
                                            onClick={(e) => {
                                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                const page = parseInt(input.value);
                                                if (page >= 1 && page <= (posts.last_page || 1)) {
                                                    handlePageChange(page);
                                                }
                                            }}
                                        >
                                            Go
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Modern Footer */}
            </MainLayout>
    );
}
