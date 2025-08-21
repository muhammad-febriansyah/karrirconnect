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
    Users
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
                return `${Math.floor(amount / 1000000)}M`;
            }
            return `${Math.floor(amount / 1000)}K`;
        };

        if (min && max && min !== max) {
            return `${currency} ${format(min)} - ${format(max)}`;
        }
        return `${currency} ${format(min || max || 0)}`;
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
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                {/* Featured Jobs */}
                {featuredJobs.length > 0 && (
                    <section className="py-12 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Lowongan Unggulan</h2>
                                    <p className="text-gray-600 mt-1">Peluang karir terbaik pilihan kami</p>
                                </div>
                                <Star className="h-6 w-6 text-yellow-500" />
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                {featuredJobs.slice(0, 4).map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="hover:shadow-lg transition-all duration-300 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    <Avatar className="w-12 h-12 flex-shrink-0">
                                                        {job.company.logo ? (
                                                            <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                        ) : (
                                                            <AvatarFallback className="bg-[#2347FA] text-white">
                                                                {job.company.name.charAt(0)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <Link href={`/jobs/${job.id}`}>
                                                                    <h3 className="text-lg font-semibold text-gray-900 hover:text-[#2347FA] cursor-pointer transition-colors">
                                                                        {job.title}
                                                                    </h3>
                                                                </Link>
                                                                <p className="text-gray-600 font-medium">{job.company.name}</p>
                                                            </div>
                                                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                                                <Star className="w-3 h-3 mr-1" />
                                                                Unggulan
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {job.location}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Briefcase className="w-4 h-4 mr-1" />
                                                                {job.employment_type === 'full_time' ? 'Full Time' : 
                                                                 job.employment_type === 'part_time' ? 'Part Time' :
                                                                 job.employment_type === 'contract' ? 'Contract' : job.employment_type}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {formatTimeAgo(job.created_at)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className="text-lg font-bold text-[#2347FA]">
                                                                {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                            </span>
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-sm text-gray-500 flex items-center">
                                                                    <Users className="w-4 h-4 mr-1" />
                                                                    <NumberTicker value={job.applications_count} className="" delay={0.3 + index * 0.1} /> pelamar
                                                                </span>
                                                                <Link href={`/jobs/${job.id}`}>
                                                                    <Button variant="outline" size="sm" className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white">
                                                                        Lihat Detail
                                                                        <ChevronRight className="w-4 h-4 ml-1" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
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

                {/* Job Results */}
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Semua Lowongan Kerja
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Menampilkan <NumberTicker value={jobs.data.length} className="font-semibold" delay={0.1} /> dari <NumberTicker value={jobs.total} className="font-semibold" delay={0.2} /> lowongan
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="sm">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </div>

                        {jobs.data.length > 0 ? (
                            <div className="space-y-6">
                                {jobs.data.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="hover:shadow-lg transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-4">
                                                    <Avatar className="w-12 h-12 flex-shrink-0">
                                                        {job.company.logo ? (
                                                            <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                        ) : (
                                                            <AvatarFallback className="bg-[#2347FA] text-white">
                                                                {job.company.name.charAt(0)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <Link href={`/jobs/${job.id}`}>
                                                                    <h3 className="text-lg font-semibold text-gray-900 hover:text-[#2347FA] cursor-pointer transition-colors">
                                                                        {job.title}
                                                                    </h3>
                                                                </Link>
                                                                <p className="text-gray-600 font-medium">{job.company.name}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                {job.featured && (
                                                                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                                                        <Star className="w-3 h-3 mr-1" />
                                                                        Unggulan
                                                                    </Badge>
                                                                )}
                                                                <Link href={`/jobs/${job.id}`}>
                                                                    <Button variant="outline" size="sm">
                                                                        Lihat Detail
                                                                        <ArrowRight className="w-4 h-4 ml-2" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <MapPin className="w-4 h-4 mr-1" />
                                                                {job.location}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Briefcase className="w-4 h-4 mr-1" />
                                                                {job.employment_type === 'full_time' ? 'Full Time' : 
                                                                 job.employment_type === 'part_time' ? 'Part Time' :
                                                                 job.employment_type === 'contract' ? 'Contract' : job.employment_type}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {formatTimeAgo(job.created_at)}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{job.category.name}</span>
                                                        </div>
                                                        
                                                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                                                            {job.description}
                                                        </p>
                                                        
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className="text-lg font-bold text-[#2347FA]">
                                                                {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                            </span>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                <span className="flex items-center">
                                                                    <Users className="w-4 h-4 mr-1" />
                                                                    <NumberTicker value={job.applications_count} className="" delay={0.3 + index * 0.1} /> pelamar
                                                                </span>
                                                                <span>•</span>
                                                                <span>{job.remaining_positions} posisi tersisa</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Tidak ada lowongan ditemukan
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Coba ubah kata kunci pencarian atau filter Anda
                                    </p>
                                    <Button onClick={clearFilters} variant="outline">
                                        Reset Pencarian
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {jobs.last_page > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex items-center space-x-2">
                                    {jobs.current_page > 1 && (
                                        <Link
                                            href={`/jobs?page=${jobs.current_page - 1}`}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    
                                    {Array.from({ length: Math.min(5, jobs.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Link
                                                key={page}
                                                href={`/jobs?page=${page}`}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                    page === jobs.current_page
                                                        ? 'text-white bg-[#2347FA] border border-[#2347FA]'
                                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}
                                    
                                    {jobs.current_page < jobs.last_page && (
                                        <Link
                                            href={`/jobs?page=${jobs.current_page + 1}`}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            </div>
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