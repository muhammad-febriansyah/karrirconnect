import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import {
    Bookmark,
    BookmarkCheck,
    Search,
    MapPin,
    Building2,
    Filter,
    Clock,
    ArrowRight,
    Briefcase,
    Star,
    Users,
    CheckCircle,
    TrendingUp,
    Calendar,
    DollarSign,
    Trash2,
    Heart,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import axios from 'axios';

interface Company {
    id: number;
    name: string;
    logo: string | null;
    location: string;
    is_verified: boolean;
}

interface JobCategory {
    id: number;
    name: string;
    slug: string;
}

interface JobListing {
    id: number;
    slug: string;
    title: string;
    company: Company;
    category: JobCategory;
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
    description: string;
    saved_at: string;
}

interface SavedJobsProps {
    savedJobs: {
        data: JobListing[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function SavedJobs({ savedJobs }: SavedJobsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('saved_at');
    const [unsavingJobs, setUnsavingJobs] = useState<Set<number>>(new Set());

    const formatSalary = (min: number | null, max: number | null, currency: string, negotiable: boolean) => {
        if (negotiable) return "Negotiable";
        if (!min && !max) return "Competitive";

        const format = (amount: number) => {
            if (amount >= 1000000) {
                return `Rp ${Math.floor(amount / 1000000)} Jt`;
            }
            if (amount >= 1000) {
                return `Rp ${Math.floor(amount / 1000)} Rb`;
            }
            return `Rp ${amount}`;
        };

        if (min && max && min !== max) {
            return `${format(min)} - ${format(max)}`;
        }
        return `${format(min || max || 0)}`;
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

    const handleUnsaveJob = async (jobId: number, jobSlug: string) => {
        try {
            setUnsavingJobs(prev => new Set(prev).add(jobId));

            await axios.post(`/api/v1/jobs/${jobSlug}/save`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                withCredentials: true
            });

            // Refresh the page or remove from the list
            window.location.reload();
        } catch (error) {
            console.error('Error unsaving job:', error);
        } finally {
            setUnsavingJobs(prev => {
                const newSet = new Set(prev);
                newSet.delete(jobId);
                return newSet;
            });
        }
    };

    const filteredJobs = savedJobs.data.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Lowongan Tersimpan" />

            <div className="min-h-screen bg-gray-50">
                <ModernNavbar currentPage="saved-jobs" />

                {/* Hero Section */}
                <section className="relative bg-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
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

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8"
                            >
                                <Heart className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="text-blue-700 font-semibold text-sm"><NumberTicker value={savedJobs.total} className="font-semibold" delay={0.2} /> Lowongan Tersimpan</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                Lowongan <span className="text-blue-600">Tersimpan</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                            >
                                Kelola dan tinjau kembali semua lowongan kerja yang telah Anda simpan untuk melamar nanti.
                            </motion.p>
                        </div>

                        {/* Search and Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto border border-gray-200"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Cari dalam lowongan tersimpan..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 text-lg text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#2347FA] focus:ring-[#2347FA]"
                                    />
                                </div>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full sm:w-[200px] h-12 text-base text-gray-900 border-gray-200 focus:border-[#2347FA] focus:ring-[#2347FA]">
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="saved_at">Terbaru Disimpan</SelectItem>
                                        <SelectItem value="created_at">Terbaru Diposting</SelectItem>
                                        <SelectItem value="title">Nama Lowongan</SelectItem>
                                        <SelectItem value="company">Nama Perusahaan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Saved Jobs List */}
                <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center justify-between mb-12"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Lowongan Tersimpan
                                </h2>
                                <p className="text-gray-600">
                                    Menampilkan <span className="font-bold text-[#2347FA]">{filteredJobs.length}</span> dari <span className="font-bold text-gray-900">{savedJobs.total}</span> lowongan tersimpan
                                </p>
                            </div>
                        </motion.div>

                        {filteredJobs.length > 0 ? (
                            <div className="space-y-6">
                                {filteredJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 + index * 0.05 }}
                                    >
                                        <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:-translate-y-1 overflow-hidden">
                                            <div className="h-1 w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <CardContent className="p-8">
                                                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                                    <div className="relative">
                                                        <Avatar className="w-16 h-16 flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-[#2347FA]/20 transition-all duration-300">
                                                            {job.company.logo ? (
                                                                <AvatarImage src={job.company.logo} alt={job.company.name} className="object-contain p-2" />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white text-xl font-bold">
                                                                    {job.company.name.charAt(0)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        {job.company.is_verified && (
                                                            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-lg ring-2 ring-white">
                                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                <Link href={`/jobs/${job.slug}`}>
                                                                    <h3 className="text-xl font-bold text-gray-900 hover:text-[#2347FA] cursor-pointer transition-colors line-clamp-2">
                                                                        {job.title}
                                                                    </h3>
                                                                </Link>
                                                                <p className="text-gray-600 font-semibold mt-1">{job.company.name}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-3 ml-4">
                                                                {job.featured && (
                                                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-sm">
                                                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                                                        Unggulan
                                                                    </Badge>
                                                                )}
                                                                <Button
                                                                    onClick={() => handleUnsaveJob(job.id, job.slug)}
                                                                    disabled={unsavingJobs.has(job.id)}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                                                >
                                                                    {unsavingJobs.has(job.id) ? (
                                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                                                            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                                                <span className="text-gray-700">{job.location}</span>
                                                            </span>
                                                            <span className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                                                                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                                                                <span className="text-blue-700">
                                                                    {job.employment_type === 'full_time' ? 'Full Time' :
                                                                     job.employment_type === 'part_time' ? 'Part Time' :
                                                                     job.employment_type === 'contract' ? 'Contract' :
                                                                     job.employment_type === 'internship' ? 'Internship' : job.employment_type}
                                                                </span>
                                                            </span>
                                                            <span className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                                                                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                                                                <span className="text-green-700">{formatTimeAgo(job.created_at)}</span>
                                                            </span>
                                                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                                                                {job.category.name}
                                                            </Badge>
                                                            {job.work_arrangement && (
                                                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                                                    {job.work_arrangement === 'remote' ? 'Remote' :
                                                                     job.work_arrangement === 'hybrid' ? 'Hybrid' :
                                                                     job.work_arrangement === 'on_site' ? 'On-site' : job.work_arrangement}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                                            {job.description}
                                                        </p>

                                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                            <span className="flex items-center">
                                                                <Bookmark className="w-4 h-4 mr-1 text-blue-600" />
                                                                Disimpan {formatTimeAgo(job.saved_at)}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                                            <div className="flex items-center space-x-2">
                                                                <DollarSign className="w-5 h-5 text-[#2347FA]" />
                                                                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">
                                                                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                                                                <div className="text-sm text-gray-500">
                                                                    <div className="flex items-center mb-1">
                                                                        <Users className="w-4 h-4 mr-1" />
                                                                        {job.applications_count} pelamar
                                                                    </div>
                                                                    <div>{job.remaining_positions} posisi tersisa</div>
                                                                </div>

                                                                <Link href={`/jobs/${job.slug}`} className="w-full sm:w-auto">
                                                                    <Button className="w-full sm:w-auto bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300">
                                                                        Lihat Detail
                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>

                                                        {/* Urgency indicator */}
                                                        {job.application_deadline && new Date(job.application_deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                                                            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                                                                <div className="flex items-center text-orange-700 text-sm">
                                                                    <Clock className="w-4 h-4 mr-2" />
                                                                    <span className="font-medium">Deadline: {new Date(job.application_deadline).toLocaleDateString('id-ID')}</span>
                                                                    <span className="ml-2 text-xs bg-orange-200 px-2 py-1 rounded-full">Segera Berakhir!</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="text-center py-16"
                            >
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Bookmark className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {searchQuery ? 'Tidak ada lowongan yang cocok' : 'Belum ada lowongan tersimpan'}
                                    </h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        {searchQuery
                                            ? 'Coba ubah kata kunci pencarian untuk menemukan lowongan yang Anda cari'
                                            : 'Mulai jelajahi lowongan kerja dan simpan yang menarik untuk Anda'}
                                    </p>
                                    <Link href="/jobs">
                                        <Button className="bg-[#2347FA] hover:bg-[#1e40e0] text-white px-6">
                                            <Search className="w-4 h-4 mr-2" />
                                            Cari Lowongan
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                <ModernFooter />
            </div>
        </>
    );
}