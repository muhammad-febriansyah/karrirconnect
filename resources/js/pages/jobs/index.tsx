import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TypingAnimation } from '@/components/ui/typing-animation';
import MainLayout from '@/layouts/main-layout';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    Briefcase,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    Filter,
    MapPin,
    Search,
    Star,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Company {
    id: number;
    name: string;
    logo: string | null;
    location: string;
    is_verified: boolean;
    industry?: string;
    size?: string;
    active_jobs_count?: number;
    total_job_posts?: number;
}

interface Statistics {
    total_jobs: number;
    total_companies: number;
    total_applications: number;
    success_stories: number;
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
    is_saved?: boolean;
}

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
            return type ? type.replace(/_/g, ' ') : 'Tidak ditentukan';
    }
};

const getWorkArrangementLabel = (arrangement?: string) => {
    switch (arrangement) {
        case 'remote':
            return 'Remote';
        case 'hybrid':
            return 'Hybrid';
        case 'on_site':
            return 'On-site';
        default:
            return arrangement || null;
    }
};

const getCompanyLogoUrl = (logo: string | null) => {
    if (!logo) return null;
    return logo.startsWith('http') ? logo : `/storage/${logo}`;
};

const getPlainText = (html?: string | null) => {
    if (!html) return '';
    return html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
};

interface JobsIndexProps {
    jobs: {
        data: JobListing[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: JobCategory[];
    filters: {
        search?: string;
        location?: string;
        category?: string;
        employment_type?: string;
        work_arrangement?: string;
    };
    totalJobs: number;
    featuredJobs: JobListing[];
}

// Looping typing animation component
function LoopingTyping() {
    const texts = ['Cari posisi impian', 'Cari kata kunci', 'Cari perusahaan'];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % texts.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <TypingAnimation
            key={currentIndex}
            className="text-base text-gray-400"
            duration={100}
        >
            {texts[currentIndex]}
        </TypingAnimation>
    );
}

export default function JobsIndex({ jobs, categories, filters, totalJobs, featuredJobs }: JobsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [locationQuery, setLocationQuery] = useState(filters.location || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState(filters.employment_type || '');
    const [selectedWorkArrangement, setSelectedWorkArrangement] = useState(filters.work_arrangement || '');
    const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
    const [savingJobs, setSavingJobs] = useState<Set<number>>(new Set());

    // Initialize savedJobs state from backend data
    useEffect(() => {
        const initialSavedJobs = new Set<number>();

        // Check jobs data
        jobs.data.forEach((job) => {
            if (job.is_saved) {
                initialSavedJobs.add(job.id);
            }
        });

        // Check featured jobs data
        featuredJobs.forEach((job) => {
            if (job.is_saved) {
                initialSavedJobs.add(job.id);
            }
        });

        setSavedJobs(initialSavedJobs);
    }, [jobs, featuredJobs]);

    const formatSalary = (min: number | null, max: number | null, currency: string, negotiable: boolean) => {
        if (negotiable) return 'Negotiable';
        if (!min && !max) return 'Competitive';

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

    const handleSearch = () => {
        router.get('/jobs', {
            search: searchQuery,
            location: locationQuery,
            category: selectedCategory,
            employment_type: selectedEmploymentType,
            work_arrangement: selectedWorkArrangement,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocationQuery('');
        setSelectedCategory('');
        setSelectedEmploymentType('');
        setSelectedWorkArrangement('');
        router.get('/jobs');
    };

    const handleSaveJob = async (jobId: number, jobSlug: string) => {
        try {
            setSavingJobs((prev) => new Set(prev).add(jobId));

            const response = await axios.post(
                `/api/v1/jobs/${jobSlug}/save`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    withCredentials: true,
                },
            );

            if (response.data.saved) {
                setSavedJobs((prev) => new Set(prev).add(jobId));
            } else {
                setSavedJobs((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(jobId);
                    return newSet;
                });
            }
        } catch (error) {
            console.error('Error saving job:', error);
            // You might want to show a toast notification here
        } finally {
            setSavingJobs((prev) => {
                const newSet = new Set(prev);
                newSet.delete(jobId);
                return newSet;
            });
        }
    };

    const getFilterQueryString = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('search', searchQuery);
        if (locationQuery) params.set('location', locationQuery);
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedEmploymentType) params.set('employment_type', selectedEmploymentType);
        if (selectedWorkArrangement) params.set('work_arrangement', selectedWorkArrangement);
        const queryString = params.toString();
        return queryString ? `&${queryString}` : '';
    };

    const renderPaginationNumbers = () => {
        const current = jobs.current_page;
        const last = jobs.last_page;
        const numbers = [];

        if (last <= 7) {
            for (let i = 1; i <= last; i++) {
                numbers.push(i);
            }
        } else {
            if (current <= 4) {
                for (let i = 1; i <= 5; i++) {
                    numbers.push(i);
                }
                numbers.push('...');
                numbers.push(last);
            } else if (current >= last - 3) {
                numbers.push(1);
                numbers.push('...');
                for (let i = last - 4; i <= last; i++) {
                    numbers.push(i);
                }
            } else {
                numbers.push(1);
                numbers.push('...');
                for (let i = current - 1; i <= current + 1; i++) {
                    numbers.push(i);
                }
                numbers.push('...');
                numbers.push(last);
            }
        }

        return numbers.map((number, index) => {
            if (number === '...') {
                return (
                    <span key={index} className="px-3 py-2 text-sm text-gray-400">
                        ...
                    </span>
                );
            }

            return (
                <Link
                    key={number}
                    href={`/jobs?page=${number}${getFilterQueryString()}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        number === current
                            ? 'bg-[#2347FA] text-white shadow-md'
                            : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                    {number}
                </Link>
            );
        });
    };

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [jobs.current_page]);

    return (
        <MainLayout currentPage="jobs" title="Cari Lowongan Kerja" className="bg-gray-50">
            <div className="min-h-screen">
                {/* Hero Search Section */}
                <section className="relative overflow-hidden bg-white pt-32 pb-16 lg:pt-40 lg:pb-20">
                    {/* Flickering Grid Background */}
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

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-8 inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-3"
                            >
                                <Briefcase className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-700">
                                    <NumberTicker value={totalJobs} className="font-semibold" delay={0.2} />+ Lowongan Tersedia
                                </span>
                            </motion.div>

                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl"
                            >
                                Temukan <span className="text-blue-600">Pekerjaan Impian</span>
                                <br />
                                Anda Disini
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
                            >
                                Eksplorasi{' '}
                                <span className="font-semibold text-gray-900">
                                    <NumberTicker value={totalJobs} className="font-semibold text-gray-900" delay={0.4} />+
                                </span>{' '}
                                lowongan kerja dari perusahaan terpercaya. Mulai karir impian Anda hari ini.
                            </motion.p>
                        </div>

                        {/* Advanced Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                <div className="relative lg:col-span-2">
                                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder=""
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-12 border-gray-200 pl-12 text-lg text-gray-900 placeholder-gray-400 focus:border-[#2347FA] focus:ring-[#2347FA]"
                                    />
                                    {!searchQuery && (
                                        <div className="pointer-events-none absolute top-1/2 left-12 -translate-y-1/2">
                                            <LoopingTyping />
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        placeholder="Lokasi"
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        className="h-12 border-gray-200 pl-12 text-lg text-gray-900 placeholder-gray-400 focus:border-[#2347FA] focus:ring-[#2347FA]"
                                    />
                                </div>
                                <Select
                                    value={selectedCategory || 'all'}
                                    onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger className="h-12 border-gray-200 text-base text-gray-900 focus:border-[#2347FA] focus:ring-[#2347FA]">
                                        <SelectValue placeholder="Kategori" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.slug}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleSearch} className="h-12 bg-[#2347FA] text-lg font-semibold text-white hover:bg-[#3b56fc]">
                                    <Search className="mr-2 h-5 w-5" />
                                    Cari
                                </Button>
                            </div>

                            {/* Additional Filters */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Select
                                    value={selectedEmploymentType || 'all'}
                                    onValueChange={(value) => setSelectedEmploymentType(value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger className="w-[180px] text-gray-900">
                                        <SelectValue placeholder="Tipe Pekerjaan" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        <SelectItem value="full_time">Full Time</SelectItem>
                                        <SelectItem value="part_time">Part Time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="freelance">Freelance</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedWorkArrangement || 'all'}
                                    onValueChange={(value) => setSelectedWorkArrangement(value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger className="w-[180px] text-gray-900">
                                        <SelectValue placeholder="Pengaturan Kerja" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="on_site">On-site</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>

                                {(searchQuery || locationQuery || selectedCategory || selectedEmploymentType || selectedWorkArrangement) && (
                                    <Button variant="outline" onClick={clearFilters} className="border-gray-300">
                                        Reset Filter
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Enhanced Featured Jobs */}
                {featuredJobs.length > 0 && (
                    <section className="bg-gradient-to-br from-white to-yellow-50/30 py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mb-12 text-center"
                            >
                                <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-yellow-200 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2">
                                    <Star className="h-4 w-4 fill-current text-yellow-600" />
                                    <span className="text-sm font-semibold text-yellow-700">Featured Jobs</span>
                                </div>
                                <h2 className="mb-2 text-3xl font-bold text-gray-900">Lowongan Unggulan</h2>
                                <p className="text-gray-600">Peluang karir eksklusif dari perusahaan top pilihan kami</p>
                            </motion.div>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {featuredJobs.slice(0, 4).map((job, index) => {
                                    const companyLogo = getCompanyLogoUrl(job.company.logo);
                                    const employmentLabel = getEmploymentTypeLabel(job.employment_type);
                                    const arrangementLabel = getWorkArrangementLabel(job.work_arrangement);

                                    return (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 + index * 0.1 }}
                                        >
                                            <Card className="group overflow-hidden border-yellow-200/50 bg-gradient-to-br from-yellow-50/50 to-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                                                {/* Featured badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <div className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                        <Star className="mr-1 h-3 w-3 fill-current" />
                                                        Unggulan
                                                    </div>
                                                </div>

                                                <CardContent className="relative p-8">
                                                    <div className="flex items-start space-x-6">
                                                        <div className="relative">
                                                            <Avatar className="h-16 w-16 flex-shrink-0 ring-2 ring-yellow-100 transition-all duration-300 group-hover:ring-[#2347FA]/20">
                                                                {companyLogo ? (
                                                                    <AvatarImage
                                                                        src={companyLogo}
                                                                        alt={job.company.name}
                                                                        className="object-contain p-2"
                                                                    />
                                                                ) : (
                                                                    <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-xl font-bold text-white">
                                                                        {job.company.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            {job.company.is_verified && (
                                                                <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-lg ring-2 ring-white">
                                                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <Link href={`/jobs/${job.slug}`}>
                                                                <h3 className="mb-2 line-clamp-2 cursor-pointer text-xl font-bold text-gray-900 transition-colors hover:text-[#2347FA]">
                                                                    {job.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="mb-3 font-semibold text-gray-600">{job.company.name}</p>

                                                            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                                <span className="flex items-center rounded-full bg-gray-100 px-3 py-1">
                                                                    <MapPin className="mr-2 h-4 w-4" />
                                                                    {job.location}
                                                                </span>
                                                                <span className="flex items-center rounded-full bg-blue-100 px-3 py-1">
                                                                    <Briefcase className="mr-2 h-4 w-4" />
                                                                    {employmentLabel}
                                                                </span>
                                                                <span className="flex items-center rounded-full bg-green-100 px-3 py-1">
                                                                    <Calendar className="mr-2 h-4 w-4" />
                                                                    {formatTimeAgo(job.created_at)}
                                                                </span>
                                                            </div>

                                                            {/* Work arrangement badge */}
                                                            {arrangementLabel ? (
                                                                <Badge variant="outline" className="mb-3 border-green-200 bg-green-50 text-green-700">
                                                                    {arrangementLabel}
                                                                </Badge>
                                                            ) : null}

                                                            <div className="mb-4 flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <DollarSign className="mr-1 h-5 w-5 text-[#2347FA]" />
                                                                    <span className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-2xl font-bold text-transparent">
                                                                        {formatSalary(
                                                                            job.salary_min,
                                                                            job.salary_max,
                                                                            job.salary_currency,
                                                                            job.salary_negotiable,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="text-right text-sm text-gray-500">
                                                                    <div className="mb-1 flex items-center">
                                                                        <Users className="mr-1 h-4 w-4" />
                                                                        <NumberTicker
                                                                            value={job.applications_count}
                                                                            className="font-medium"
                                                                            delay={0.3 + index * 0.1}
                                                                        />{' '}
                                                                        pelamar
                                                                    </div>
                                                                    <div>{job.remaining_positions} posisi tersisa</div>
                                                                </div>
                                                            </div>

                                                            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                                                <Button
                                                                    onClick={() => handleSaveJob(job.id, job.slug)}
                                                                    disabled={savingJobs.has(job.id)}
                                                                    variant={savedJobs.has(job.id) ? 'default' : 'outline'}
                                                                    size="sm"
                                                                    className={`w-full rounded-full px-4 transition-all duration-300 sm:w-auto ${
                                                                        savedJobs.has(job.id)
                                                                            ? 'bg-[#2347FA] text-white hover:bg-[#1d3dfa]'
                                                                            : 'border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA]'
                                                                    }`}
                                                                >
                                                                    {savingJobs.has(job.id) ? (
                                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                    ) : savedJobs.has(job.id) ? (
                                                                        <BookmarkCheck className="h-4 w-4" />
                                                                    ) : (
                                                                        <Bookmark className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <Link href={`/jobs/${job.slug}`} className="w-full sm:flex-1">
                                                                    <Button className="w-full rounded-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-md transition-all duration-300 hover:from-[#1a3af0] hover:to-[#2d47f5] hover:shadow-lg sm:w-auto">
                                                                        Lamar Sekarang
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Enhanced Job Results - Glints Style with Sidebar */}
                <section className="bg-gray-50 py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mb-6">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900">Semua Lowongan Kerja</h2>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-900">
                                    <NumberTicker value={jobs.total} className="font-semibold text-gray-900" delay={0.2} />
                                </span>{' '}
                                lowongan ditemukan
                            </p>
                        </motion.div>

                        {/* Layout with Sidebar */}
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                            {/* Sidebar Filters */}
                            <aside className="w-full lg:w-80 lg:flex-shrink-0">
                                <div className="sticky top-24 rounded-xl border border-gray-200 bg-white shadow-sm">
                                    {/* Fixed Header */}
                                    <div className="border-b border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-gray-900">Filter</h3>
                                            {(selectedCategory || selectedEmploymentType || selectedWorkArrangement) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearFilters}
                                                    className="text-[#2347FA] hover:text-[#1d3dfa]"
                                                >
                                                    Reset
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="filter-sidebar-scroll max-h-[calc(100vh-200px)] space-y-6 overflow-y-auto p-6">
                                        {/* Job Categories */}
                                        <div className="border-b border-gray-200 pb-6">
                                            <h4 className="mb-4 text-sm font-semibold text-gray-900">Kategori Pekerjaan</h4>
                                            <div className="space-y-2">
                                                <label className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
                                                    <input
                                                        type="radio"
                                                        name="category"
                                                        checked={!selectedCategory}
                                                        onChange={() => {
                                                            setSelectedCategory('');
                                                            router.get('/jobs', {
                                                                search: searchQuery,
                                                                location: locationQuery,
                                                                employment_type: selectedEmploymentType,
                                                                work_arrangement: selectedWorkArrangement,
                                                            });
                                                        }}
                                                        className="h-4 w-4 border-gray-300 text-[#2347FA] focus:ring-[#2347FA]"
                                                    />
                                                    <span className="text-sm text-gray-700">Semua Kategori</span>
                                                </label>
                                                {categories.slice(0, 8).map((category) => (
                                                    <label
                                                        key={category.id}
                                                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="category"
                                                            checked={selectedCategory === category.slug}
                                                            onChange={() => {
                                                                setSelectedCategory(category.slug);
                                                                router.get('/jobs', {
                                                                    search: searchQuery,
                                                                    location: locationQuery,
                                                                    category: category.slug,
                                                                    employment_type: selectedEmploymentType,
                                                                    work_arrangement: selectedWorkArrangement,
                                                                });
                                                            }}
                                                            className="h-4 w-4 border-gray-300 text-[#2347FA] focus:ring-[#2347FA]"
                                                        />
                                                        <span className="text-sm text-gray-700">{category.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Employment Type */}
                                        <div className="border-b border-gray-200 pb-6">
                                            <h4 className="mb-4 text-sm font-semibold text-gray-900">Tipe Pekerjaan</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'full_time', label: 'Full Time' },
                                                    { value: 'part_time', label: 'Part Time' },
                                                    { value: 'contract', label: 'Kontrak' },
                                                    { value: 'internship', label: 'Magang' },
                                                    { value: 'freelance', label: 'Freelance' },
                                                ].map((type) => (
                                                    <label
                                                        key={type.value}
                                                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedEmploymentType === type.value}
                                                            onChange={(e) => {
                                                                const newValue = e.target.checked ? type.value : '';
                                                                setSelectedEmploymentType(newValue);
                                                                router.get('/jobs', {
                                                                    search: searchQuery,
                                                                    location: locationQuery,
                                                                    category: selectedCategory,
                                                                    employment_type: newValue,
                                                                    work_arrangement: selectedWorkArrangement,
                                                                });
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300 text-[#2347FA] focus:ring-[#2347FA]"
                                                        />
                                                        <span className="text-sm text-gray-700">{type.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Work Arrangement */}
                                        <div>
                                            <h4 className="mb-4 text-sm font-semibold text-gray-900">Kebijakan Kerja</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'on_site', label: 'Kerja di Kantor' },
                                                    { value: 'remote', label: 'Kerja Remote' },
                                                    { value: 'hybrid', label: 'Kerja Hybrid' },
                                                ].map((arrangement) => (
                                                    <label
                                                        key={arrangement.value}
                                                        className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedWorkArrangement === arrangement.value}
                                                            onChange={(e) => {
                                                                const newValue = e.target.checked ? arrangement.value : '';
                                                                setSelectedWorkArrangement(newValue);
                                                                router.get('/jobs', {
                                                                    search: searchQuery,
                                                                    location: locationQuery,
                                                                    category: selectedCategory,
                                                                    employment_type: selectedEmploymentType,
                                                                    work_arrangement: newValue,
                                                                });
                                                            }}
                                                            className="h-4 w-4 rounded border-gray-300 text-[#2347FA] focus:ring-[#2347FA]"
                                                        />
                                                        <span className="text-sm text-gray-700">{arrangement.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>

                            {/* Job Results Grid */}
                            <div className="flex-1">
                                {jobs.data.length > 0 ? (
                                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                                        {jobs.data.map((job, index) => {
                                            const companyLogo = getCompanyLogoUrl(job.company.logo);
                                            const employmentLabel = getEmploymentTypeLabel(job.employment_type);
                                            const arrangementLabel = getWorkArrangementLabel(job.work_arrangement);
                                            const isUrgent = job.remaining_positions > 0 && job.remaining_positions <= 3;
                                            const plainDescription = getPlainText(job.description);

                                            return (
                                                <motion.div
                                                    key={job.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 1.4 + index * 0.05 }}
                                                >
                                                    <Card className="group relative h-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                                        <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2347FA] via-indigo-500 to-[#2347FA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                                        <CardContent className="flex h-full flex-col p-5">
                                                            {/* Company Logo & Title */}
                                                            <div className="mb-4 flex items-start gap-4">
                                                                <div className="relative flex-shrink-0">
                                                                    <Avatar className="h-12 w-12 ring-2 ring-slate-100 transition-all duration-300 group-hover:ring-[#2347FA]/20">
                                                                        {companyLogo ? (
                                                                            <AvatarImage src={companyLogo} alt={job.company.name} className="object-contain p-2" />
                                                                        ) : (
                                                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-indigo-600 text-lg font-semibold text-white">
                                                                                {job.company.name.charAt(0)}
                                                                            </AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                    {job.company.is_verified && (
                                                                        <div className="absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-md ring-2 ring-white">
                                                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0 flex-1">
                                                                    <Link href={`/jobs/${job.slug}`}>
                                                                        <h3 className="mb-1 line-clamp-2 text-base font-bold text-slate-900 transition-colors hover:text-[#2347FA]">
                                                                            {job.title}
                                                                        </h3>
                                                                    </Link>
                                                                    <p className="text-sm font-medium text-slate-600">{job.company.name}</p>
                                                                </div>
                                                            </div>

                                                            {/* Badges */}
                                                            <div className="mb-3 flex flex-wrap gap-2">
                                                                {job.featured && (
                                                                    <Badge className="flex items-center gap-1 border-0 bg-amber-100 text-amber-700">
                                                                        <Star className="h-3 w-3 fill-current" />
                                                                        Unggulan
                                                                    </Badge>
                                                                )}
                                                                {isUrgent && (
                                                                    <Badge className="border-0 bg-rose-100 text-rose-700">Segera Dibutuhkan</Badge>
                                                                )}
                                                            </div>

                                                            {/* Location & Employment Type */}
                                                            <div className="mb-3 space-y-2">
                                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                                    <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                                                                    <span className="truncate">{job.location}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2 text-xs">
                                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                                        <Briefcase className="mr-1 h-3 w-3" />
                                                                        {employmentLabel}
                                                                    </Badge>
                                                                    {arrangementLabel && (
                                                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">
                                                                            {arrangementLabel}
                                                                        </Badge>
                                                                    )}
                                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                                                        {job.category.name}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            {/* Description */}
                                                            <p className="mb-4 line-clamp-2 text-sm text-slate-600">{plainDescription}</p>

                                                            {/* Salary & Stats */}
                                                            <div className="mb-4 mt-auto space-y-3 rounded-lg border border-blue-100 bg-blue-50/30 p-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-medium text-slate-500">Estimasi Gaji</span>
                                                                    <div className="text-lg font-bold text-[#2347FA]">
                                                                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Users className="h-3.5 w-3.5" />
                                                                        <NumberTicker value={job.applications_count} delay={0.4 + index * 0.04} /> pelamar
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3.5 w-3.5" />
                                                                        {formatTimeAgo(job.created_at)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={() => handleSaveJob(job.id, job.slug)}
                                                                    disabled={savingJobs.has(job.id)}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className={`transition-all ${
                                                                        savedJobs.has(job.id)
                                                                            ? 'border-[#2347FA] bg-[#2347FA] text-white hover:bg-[#1d3dfa]'
                                                                            : 'border-slate-300 hover:border-[#2347FA] hover:text-[#2347FA]'
                                                                    }`}
                                                                >
                                                                    {savingJobs.has(job.id) ? (
                                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                    ) : savedJobs.has(job.id) ? (
                                                                        <BookmarkCheck className="h-4 w-4" />
                                                                    ) : (
                                                                        <Bookmark className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <Link href={`/jobs/${job.slug}`} className="flex-1">
                                                                    <Button className="w-full bg-gradient-to-r from-[#2347FA] to-indigo-600 text-white hover:from-[#1d3dfa] hover:to-indigo-700">
                                                                        Lamar Sekarang
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4 }}
                                        className="py-16 text-center"
                                    >
                                        <div className="mx-auto max-w-md">
                                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                                <Search className="h-10 w-10 text-gray-400" />
                                            </div>
                                            <h3 className="mb-3 text-2xl font-bold text-gray-900">Tidak ada lowongan ditemukan</h3>
                                            <p className="mb-8 leading-relaxed text-gray-600">
                                                Coba ubah kata kunci pencarian atau filter Anda untuk menemukan peluang karir yang tepat
                                            </p>
                                            <Button
                                                onClick={clearFilters}
                                                variant="outline"
                                                className="rounded-xl border-[#2347FA] px-6 text-[#2347FA] hover:bg-[#2347FA] hover:text-white"
                                            >
                                                <Filter className="mr-2 h-4 w-4" />
                                                Reset Pencarian
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Enhanced Pagination */}
                                {jobs.last_page > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.6 }}
                                        className="mt-12 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0"
                                    >
                                        {/* Page Info */}
                                        <div className="text-sm text-gray-600">
                                            Menampilkan halaman <span className="font-semibold text-[#2347FA]">{jobs.current_page}</span> dari{' '}
                                            <span className="font-semibold text-gray-900">{jobs.last_page}</span> halaman
                                        </div>

                                        {/* Pagination Controls */}
                                        <div className="flex items-center space-x-1">
                                            {/* Previous Button */}
                                            {jobs.current_page > 1 && (
                                                <Link
                                                    href={`/jobs?page=${jobs.current_page - 1}${getFilterQueryString()}`}
                                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                    className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700"
                                                >
                                                    <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
                                                    Sebelumnya
                                                </Link>
                                            )}

                                            {/* Page Numbers */}
                                            <div className="flex items-center space-x-1">{renderPaginationNumbers()}</div>

                                            {/* Next Button */}
                                            {jobs.current_page < jobs.last_page && (
                                                <Link
                                                    href={`/jobs?page=${jobs.current_page + 1}${getFilterQueryString()}`}
                                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                    className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700"
                                                >
                                                    Selanjutnya
                                                    <ChevronRight className="ml-1 h-4 w-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
