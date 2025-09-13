import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import ModernFooter from '@/components/modern-footer';
import { 
    Search, 
    MapPin, 
    Building2, 
    Filter,
    SlidersHorizontal,
    Clock,
    ArrowRight,
    Briefcase,
    Star,
    ChevronRight,
    Users,
    CheckCircle,
    TrendingUp,
    Zap,
    Award,
    Calendar,
    DollarSign,
    Globe,
    Shield
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
}

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

export default function JobsIndex({ jobs, categories, filters, totalJobs, featuredJobs }: JobsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [locationQuery, setLocationQuery] = useState(filters.location || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState(filters.employment_type || '');
    const [selectedWorkArrangement, setSelectedWorkArrangement] = useState(filters.work_arrangement || '');

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
                    <span key={index} className="px-3 py-2 text-gray-400 text-sm">
                        ...
                    </span>
                );
            }

            return (
                <Link
                    key={number}
                    href={`/jobs?page=${number}${getFilterQueryString()}`}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        number === current
                            ? 'text-white bg-[#2347FA] shadow-md'
                            : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                    {number}
                </Link>
            );
        });
    };

    return (
        <>
            <Head title="Cari Lowongan Kerja" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="jobs" />

                {/* Hero Search Section */}
                <section className="relative bg-white pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
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
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12">
                            {/* Badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8"
                            >
                                <Briefcase className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-700 font-semibold text-sm"><NumberTicker value={totalJobs} className="font-semibold" delay={0.2} />+ Lowongan Tersedia</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                Temukan <span className="text-blue-600">Pekerjaan Impian</span><br />
                                Anda Disini
                            </motion.h1>
                            
                            {/* Description */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                            >
                                Eksplorasi <span className="font-semibold text-gray-900"><NumberTicker value={totalJobs} className="font-semibold text-gray-900" delay={0.4} />+</span> lowongan kerja dari perusahaan terpercaya. Mulai karir impian Anda hari ini.
                            </motion.p>
                        </div>

                        {/* Advanced Search */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-white rounded-2xl shadow-lg p-6 max-w-7xl mx-auto border border-gray-200"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="relative lg:col-span-2">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Posisi, kata kunci, atau perusahaan"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 text-lg text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#2347FA] focus:ring-[#2347FA]"
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Lokasi"
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        className="pl-12 h-12 text-lg text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#2347FA] focus:ring-[#2347FA]"
                                    />
                                </div>
                                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                                    <SelectTrigger className="h-12 text-base text-gray-900 border-gray-200 focus:border-[#2347FA] focus:ring-[#2347FA]">
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
                                <Button 
                                    onClick={handleSearch}
                                    className="h-12 text-lg font-semibold bg-[#2347FA] hover:bg-[#3b56fc] text-white"
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Cari
                                </Button>
                            </div>
                            
                            {/* Additional Filters */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Select value={selectedEmploymentType || "all"} onValueChange={(value) => setSelectedEmploymentType(value === "all" ? "" : value)}>
                                    <SelectTrigger className="w-[180px] text-gray-900">
                                        <SelectValue placeholder="Tipe Pekerjaan" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        <SelectItem value="full_time">Full Time</SelectItem>
                                        <SelectItem value="part_time">Part Time</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                        <SelectItem value="freelance">Freelance</SelectItem>
                                        <SelectItem value="internship">Magang</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <Select value={selectedWorkArrangement || "all"} onValueChange={(value) => setSelectedWorkArrangement(value === "all" ? "" : value)}>
                                    <SelectTrigger className="w-[180px] text-gray-900">
                                        <SelectValue placeholder="Pengaturan Kerja" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="onsite">Onsite</SelectItem>
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
                    <section className="py-16 bg-gradient-to-br from-white to-yellow-50/30">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="text-center mb-12"
                            >
                                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-full px-4 py-2 mb-4">
                                    <Star className="h-4 w-4 text-yellow-600 fill-current" />
                                    <span className="text-yellow-700 font-semibold text-sm">Featured Jobs</span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Lowongan Unggulan</h2>
                                <p className="text-gray-600">Peluang karir eksklusif dari perusahaan top pilihan kami</p>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {featuredJobs.slice(0, 4).map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.9 + index * 0.1 }}
                                    >
                                        <Card className="group hover:shadow-2xl transition-all duration-500 border-yellow-200/50 bg-gradient-to-br from-yellow-50/50 to-white hover:-translate-y-2 overflow-hidden">
                                            {/* Featured badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                    <Star className="mr-1 h-3 w-3 fill-current" />
                                                    Unggulan
                                                </div>
                                            </div>

                                            <CardContent className="p-8 relative">
                                                <div className="flex items-start space-x-6">
                                                    <div className="relative">
                                                        <Avatar className="w-16 h-16 flex-shrink-0 ring-2 ring-yellow-100 group-hover:ring-[#2347FA]/20 transition-all duration-300">
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
                                                        <Link href={`/jobs/${job.slug}`}>
                                                            <h3 className="text-xl font-bold text-gray-900 hover:text-[#2347FA] cursor-pointer transition-colors mb-2 line-clamp-2">
                                                                {job.title}
                                                            </h3>
                                                        </Link>
                                                        <p className="text-gray-600 font-semibold mb-3">{job.company.name}</p>
                                                        
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                                            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                                                <MapPin className="w-4 h-4 mr-2" />
                                                                {job.location}
                                                            </span>
                                                            <span className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                                                                <Briefcase className="w-4 h-4 mr-2" />
                                                                {job.employment_type === 'full_time' ? 'Full Time' : 
                                                                 job.employment_type === 'part_time' ? 'Part Time' :
                                                                 job.employment_type === 'contract' ? 'Contract' : job.employment_type}
                                                            </span>
                                                            <span className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                {formatTimeAgo(job.created_at)}
                                                            </span>
                                                        </div>

                                                        {/* Work arrangement badge */}
                                                        {job.work_arrangement && (
                                                            <Badge variant="outline" className="mb-3 border-green-200 text-green-700 bg-green-50">
                                                                {job.work_arrangement === 'remote' ? 'Remote' : 
                                                                 job.work_arrangement === 'hybrid' ? 'Hybrid' : 
                                                                 job.work_arrangement === 'onsite' ? 'On-site' : job.work_arrangement}
                                                            </Badge>
                                                        )}
                                                        
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center">
                                                                <DollarSign className="w-5 h-5 text-[#2347FA] mr-1" />
                                                                <span className="text-2xl font-bold bg-gradient-to-r from-[#2347FA] to-[#3b56fc] bg-clip-text text-transparent">
                                                                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                                </span>
                                                            </div>
                                                            <div className="text-right text-sm text-gray-500">
                                                                <div className="flex items-center mb-1">
                                                                    <Users className="w-4 h-4 mr-1" />
                                                                    <NumberTicker value={job.applications_count} className="" delay={0.3 + index * 0.1} /> pelamar
                                                                </div>
                                                                <div>{job.remaining_positions} posisi tersisa</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-3">
                                                            <Link href={`/jobs/${job.slug}`} className="flex-1">
                                                                <Button className="w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                                                    Lamar Sekarang
                                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Enhanced Job Results */}
                <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3 }}
                            className="flex items-center justify-between mb-12"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Semua Lowongan Kerja
                                </h2>
                                <p className="text-gray-600">
                                    Menampilkan <span className="font-bold text-[#2347FA]"><NumberTicker value={jobs.data.length} className="font-bold text-[#2347FA]" delay={0.1} /></span> dari <span className="font-bold text-gray-900"><NumberTicker value={jobs.total} className="font-bold text-gray-900" delay={0.2} /></span> lowongan yang tersedia
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center space-x-4">
                                <Button variant="outline" size="sm" className="border-gray-300 rounded-xl">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filter Lanjutan
                                </Button>
                            </div>
                        </motion.div>

                        {jobs.data.length > 0 ? (
                            <div className="space-y-6">
                                {jobs.data.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4 + index * 0.05 }}
                                    >
                                        <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:-translate-y-1 overflow-hidden">
                                            {/* Top gradient bar */}
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
                                                                     job.employment_type === 'contract' ? 'Contract' : job.employment_type}
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
                                                                     job.work_arrangement === 'onsite' ? 'On-site' : job.work_arrangement}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        
                                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                                            {job.description}
                                                        </p>
                                                        
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
                                                                        <NumberTicker value={job.applications_count} className="" delay={0.3 + index * 0.1} /> pelamar
                                                                    </div>
                                                                    <div>{job.remaining_positions} posisi tersisa</div>
                                                                </div>
                                                                
                                                                <Link href={`/jobs/${job.slug}`} className="w-full sm:w-auto">
                                                                    <Button className="w-full sm:w-auto bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1a3af0] hover:to-[#2d47f5] text-white rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300">
                                                                        Lamar Sekarang
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
                                transition={{ delay: 1.4 }}
                                className="text-center py-16"
                            >
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Tidak ada lowongan ditemukan
                                    </h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        Coba ubah kata kunci pencarian atau filter Anda untuk menemukan peluang karir yang tepat
                                    </p>
                                    <Button onClick={clearFilters} variant="outline" className="rounded-xl border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white px-6">
                                        <Filter className="w-4 h-4 mr-2" />
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
                                className="mt-12 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
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
                                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
                                        >
                                            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                                            Sebelumnya
                                        </Link>
                                    )}
                                    
                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {renderPaginationNumbers()}
                                    </div>
                                    
                                    {/* Next Button */}
                                    {jobs.current_page < jobs.last_page && (
                                        <Link
                                            href={`/jobs?page=${jobs.current_page + 1}${getFilterQueryString()}`}
                                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
                                        >
                                            Selanjutnya
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Modern Footer */}
                <ModernFooter 
                    statistics={{
                        total_jobs: totalJobs,
                        total_companies: 1000,
                        total_candidates: 50000
                    }}
                />
            </div>
        </>
    );
}