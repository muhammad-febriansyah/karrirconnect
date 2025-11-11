import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Search, MapPin, Building2, Users, Star, ExternalLink, ChevronRight, Briefcase, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/layouts/main-layout';
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
    description: string;
    logo: string | null;
    website: string;
    industry: string;
    size: string;
    location: string;
    is_verified: boolean;
    is_active: boolean;
    active_jobs_count: number;
    total_job_posts: number;
}

interface CompaniesIndexProps {
    companies: {
        data: Company[];
        current_page: number;
        last_page: number;
        total: number;
    };
    industries: string[];
    companySizes: string[];
    filters: {
        search?: string;
        location?: string;
        industry?: string;
        size?: string;
    };
    totalCompanies: number;
    featuredCompanies: Company[];
}

const getCompanyLogoUrl = (logo: string | null) => {
    if (!logo) return null;
    return logo.startsWith('http') ? logo : `/storage/${logo}`;
};

const getPlainText = (value?: string | null) => {
    if (!value) return '';
    return value
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
};

export default function CompaniesIndex({
    companies,
    industries,
    companySizes,
    filters,
    totalCompanies,
    featuredCompanies
}: CompaniesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [locationQuery, setLocationQuery] = useState(filters.location || '');
    const [selectedIndustry, setSelectedIndustry] = useState(filters.industry || '');
    const [selectedSize, setSelectedSize] = useState(filters.size || '');

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [companies.current_page]);

    const handleSearch = () => {
        router.get('/companies', {
            search: searchQuery,
            location: locationQuery,
            industry: selectedIndustry,
            size: selectedSize,
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocationQuery('');
        setSelectedIndustry('');
        setSelectedSize('');
        router.get('/companies');
    };

    const formatCompanySize = (size: string) => {
        const sizeMap: { [key: string]: string } = {
            'startup': '1-10 karyawan',
            'small': '11-50 karyawan',
            'medium': '51-200 karyawan',
            'large': '201-1000 karyawan',
            'enterprise': '1000+ karyawan'
        };
        return sizeMap[size] || size;
    };

    return (
        <MainLayout currentPage="companies" title="Perusahaan" className="bg-gray-50">
            <div className="min-h-screen">
                {/* Hero Search Section */}
                <section className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
                    {/* Flickering Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <FlickeringGrid 
                            className="h-full w-full"
                            squareSize={4}
                            gridGap={6}
                            color="rgb(99, 102, 241)"
                            maxOpacity={0.05}
                            flickerChance={0.08}
                        />
                    </div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            {/* Badge */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-full px-6 py-3 mb-8 shadow-sm"
                            >
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                <span className="text-indigo-700 font-semibold text-sm"><NumberTicker value={totalCompanies} className="font-semibold" delay={0.2} />+ Perusahaan Terpercaya</span>
                            </motion.div>
                            
                            {/* Main Heading */}
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
                            >
                                Temukan <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Perusahaan Impian</span><br className="hidden sm:block" />
                                <span className="sm:hidden"> </span>Anda Disini
                            </motion.h1>
                            
                            {/* Description */}
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-base sm:text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4"
                            >
                                Eksplorasi <span className="font-semibold text-gray-900"><NumberTicker value={totalCompanies} className="font-semibold text-gray-900" delay={0.4} />+</span> perusahaan terpercaya dan berkualitas. Bergabunglah dengan tempat kerja terbaik untuk karir impian Anda.
                            </motion.p>
                        </div>

                        {/* Search Form */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 max-w-7xl mx-auto border border-gray-100 backdrop-blur-sm"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative sm:col-span-2">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Nama perusahaan atau kata kunci"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-12 h-12 text-base sm:text-lg text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#2347FA] focus:ring-2 focus:ring-[#2347FA]/20 transition-all duration-200"
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Lokasi"
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="pl-12 h-12 text-base sm:text-lg text-gray-900 placeholder-gray-400 border-gray-200 focus:border-[#2347FA] focus:ring-2 focus:ring-[#2347FA]/20 transition-all duration-200"
                                    />
                                </div>
                                <Button 
                                    onClick={handleSearch}
                                    className="h-12 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    <Search className="mr-2 h-5 w-5" />
                                    Cari
                                </Button>
                            </div>
                            
                            {/* Additional Filters */}
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Select value={selectedIndustry || "all"} onValueChange={(value) => setSelectedIndustry(value === "all" ? "" : value)}>
                                    <SelectTrigger className="w-full sm:w-[200px] text-gray-900 border-gray-200 focus:border-[#2347FA]">
                                        <SelectValue placeholder="Pilih Industri" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Industri</SelectItem>
                                        {industries.map((industry) => (
                                            <SelectItem key={industry} value={industry}>
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                <Select value={selectedSize || "all"} onValueChange={(value) => setSelectedSize(value === "all" ? "" : value)}>
                                    <SelectTrigger className="w-full sm:w-[200px] text-gray-900 border-gray-200 focus:border-[#2347FA]">
                                        <SelectValue placeholder="Ukuran Perusahaan" className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Ukuran</SelectItem>
                                        {companySizes.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {formatCompanySize(size)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {(searchQuery || locationQuery || selectedIndustry || selectedSize) && (
                                    <Button variant="outline" onClick={clearFilters} className="border-gray-300 hover:border-gray-400 transition-colors">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Reset Filter
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Featured Companies */}
                {featuredCompanies.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-white to-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center mb-4">
                                    <Star className="h-8 w-8 text-yellow-500 mr-3" />
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Perusahaan Unggulan</h2>
                                </div>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Perusahaan terpercaya dengan reputasi terbaik dan banyak lowongan berkualitas
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                                {featuredCompanies.slice(0, 6).map((company, index) => {
                                    const logoUrl = getCompanyLogoUrl(company.logo);
                                    const plainDescription = getPlainText(company.description);

                                    return (
                                    <motion.div
                                        key={company.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <Card className="group relative h-full overflow-hidden border border-amber-200/70 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                                            <CardContent className="flex h-full flex-col p-4 sm:p-6">
                                                <div className="flex flex-1 flex-col gap-4 sm:gap-5">
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <div className="relative flex-shrink-0">
                                                            <Avatar className="h-12 w-12 ring-2 ring-amber-100 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                                                                {logoUrl ? (
                                                                    <AvatarImage src={logoUrl} alt={company.name} className="object-contain" />
                                                                ) : (
                                                                    <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-lg font-semibold text-white sm:text-xl">
                                                                        {company.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            {company.is_verified && (
                                                                <div className="absolute -right-0.5 -bottom-0.5 rounded-full bg-white p-0.5 shadow-md ring-2 ring-white sm:-right-1 sm:-bottom-1 sm:p-1">
                                                                    <CheckCircle className="h-3 w-3 text-emerald-500 sm:h-4 sm:w-4" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                                                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                                <h3 className="break-words text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-[#2347FA] sm:text-lg">
                                                                    {company.name}
                                                                </h3>
                                                                <Badge className="flex flex-shrink-0 items-center gap-1 border-0 bg-gradient-to-r from-amber-100 to-orange-100 text-xs text-amber-700">
                                                                    <Star className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" />
                                                                    Unggulan
                                                                </Badge>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                                                                <Badge variant="secondary" className="flex items-center gap-1 border-0 bg-slate-100 text-slate-700">
                                                                    <Briefcase className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-3.5 sm:w-3.5" />
                                                                    <span className="truncate max-w-[100px] sm:max-w-[150px]" title={company.industry}>
                                                                        {company.industry}
                                                                    </span>
                                                                </Badge>
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:px-3 sm:py-1">
                                                                    <MapPin className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-3.5 sm:w-3.5" />
                                                                    <span className="truncate max-w-[100px] sm:max-w-[120px]" title={company.location}>
                                                                        {company.location}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2">
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:px-3 sm:py-1">
                                                                    <Users className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-3.5 sm:w-3.5" />
                                                                    <span className="truncate max-w-[150px]" title={formatCompanySize(company.size)}>
                                                                        {formatCompanySize(company.size)}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 sm:line-clamp-3 sm:text-sm">
                                                                {plainDescription || 'Belum ada deskripsi perusahaan.'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-auto flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3 sm:gap-4 sm:p-4">
                                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-slate-500">Lowongan Aktif</span>
                                                                <span className="text-base font-semibold text-[#2347FA] sm:text-lg">
                                                                    <NumberTicker value={company.active_jobs_count} delay={0.2 + index * 0.05} />
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-slate-500">Total Lowongan</span>
                                                                <span className="text-base font-semibold text-[#2347FA] sm:text-lg">
                                                                    <NumberTicker value={company.total_job_posts} delay={0.25 + index * 0.05} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 sm:flex-row">
                                                            {company.website ? (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    asChild
                                                                    className="w-full border-amber-200 text-amber-700 hover:border-amber-300 hover:text-amber-800"
                                                                >
                                                                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                                        <ExternalLink className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                        <span className="text-xs sm:text-sm">Website</span>
                                                                    </a>
                                                                </Button>
                                                            ) : null}
                                                            <Link href={`/companies/${company.id}`} className="w-full">
                                                                <Button className="w-full rounded-full bg-[#2347FA] text-xs text-white shadow-md transition-colors duration-300 hover:bg-[#1d3dfa] sm:text-sm">
                                                                    Lihat Detail
                                                                    <ChevronRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

                {/* Company Results */}
                <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-6 py-3 mb-6 shadow-sm"
                            >
                                <Building2 className="w-5 h-5 text-[#2347FA]" />
                                <span className="text-gray-700 font-semibold text-sm">Direktori Perusahaan</span>
                            </motion.div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                            >
                                Semua Perusahaan
                            </motion.h2>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg text-gray-600 max-w-2xl mx-auto"
                            >
                                Jelajahi <span className="font-semibold text-[#2347FA]"><NumberTicker value={companies.data.length} className="font-semibold text-[#2347FA]" delay={0.1} /></span> dari <span className="font-semibold text-[#2347FA]"><NumberTicker value={companies.total} className="font-semibold text-[#2347FA]" delay={0.2} /></span> perusahaan terpilih untuk menemukan tempat kerja yang tepat bagi Anda
                            </motion.p>
                        </div>

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                    <span>
                                        <span className="font-semibold text-gray-900">
                                            <NumberTicker value={companies.data.length} className="font-semibold text-gray-900" delay={0.1} />
                                        </span>{' '}
                                        perusahaan tersedia
                                    </span>
                                </div>
                                {(searchQuery || locationQuery || selectedIndustry || selectedSize) && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-[#2347FA]/5 px-3 py-1 text-xs font-semibold text-[#2347FA]">
                                        <Filter className="h-3.5 w-3.5" />
                                        Filter aktif
                                    </span>
                                )}
                            </div>

                            <div className="text-sm text-gray-500 sm:text-right">
                                Menampilkan halaman{' '}
                                <span className="font-semibold text-gray-900">{companies.current_page}</span> dari{' '}
                                <span className="font-semibold text-gray-900">{companies.last_page}</span>
                            </div>
                        </motion.div>

                        {companies.data.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3"
                            >
                                {companies.data.map((company, index) => {
                                    const logoUrl = getCompanyLogoUrl(company.logo);
                                    const plainDescription = getPlainText(company.description);
                                    const safeDescription = plainDescription || 'Belum ada deskripsi perusahaan.';

                                    return (
                                        <motion.div
                                            key={company.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: 0.5 + index * 0.05,
                                                duration: 0.3,
                                            }}
                                            className="group"
                                        >
                                            <Card className="relative h-full overflow-hidden border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#2347FA]/30 hover:shadow-2xl">
                                                {/* Gradient accent line */}
                                                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2347FA] via-indigo-500 to-[#2347FA] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                                <CardContent className="flex h-full flex-col p-4 sm:p-6">
                                                    <div className="flex flex-1 flex-col gap-4 sm:gap-5">
                                                        {/* Header Section */}
                                                        <div className="flex items-start gap-3 sm:gap-4">
                                                            <div className="relative flex-shrink-0">
                                                                <Avatar className="h-12 w-12 ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-4 group-hover:ring-[#2347FA]/20 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                                                                    {logoUrl ? (
                                                                        <AvatarImage src={logoUrl} alt={company.name} className="object-contain p-1 sm:p-2" />
                                                                    ) : (
                                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-indigo-600 text-lg font-semibold text-white sm:text-xl">
                                                                            {company.name.charAt(0)}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                {company.is_verified && (
                                                                    <div className="absolute -right-0.5 -bottom-0.5 rounded-full bg-white p-0.5 shadow-md ring-2 ring-white sm:-right-1 sm:-bottom-1 sm:p-1">
                                                                        <CheckCircle className="h-3 w-3 text-emerald-500 sm:h-4 sm:w-4" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0 flex-1 space-y-2">
                                                                <h3 className="break-words text-base font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#2347FA] sm:text-lg">
                                                                    {company.name}
                                                                </h3>

                                                                <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                                                                    <Badge variant="secondary" className="flex items-center gap-1 border-0 bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100">
                                                                        <Briefcase className="h-3 w-3 flex-shrink-0 text-blue-600 sm:h-3.5 sm:w-3.5" />
                                                                        <span className="max-w-[100px] truncate sm:max-w-[150px]" title={company.industry}>
                                                                            {company.industry}
                                                                        </span>
                                                                    </Badge>
                                                                    <span className="inline-flex max-w-[120px] items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 transition-colors group-hover:bg-slate-200 sm:max-w-[150px] sm:px-3 sm:py-1">
                                                                        <MapPin className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-3.5 sm:w-3.5" />
                                                                        <span className="truncate" title={company.location}>
                                                                            {company.location}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2">
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 transition-colors group-hover:bg-slate-200 sm:px-3 sm:py-1">
                                                                        <Users className="h-3 w-3 flex-shrink-0 text-slate-500 sm:h-3.5 sm:w-3.5" />
                                                                        <span className="max-w-[150px] truncate" title={formatCompanySize(company.size)}>
                                                                            {formatCompanySize(company.size)}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                                            {safeDescription}
                                                        </p>

                                                        {/* Stats & Actions Section */}
                                                        <div className="mt-auto flex flex-col gap-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-3 transition-colors group-hover:border-blue-200 sm:gap-4 sm:p-4">
                                                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-medium text-slate-500">Lowongan Aktif</span>
                                                                    <span className="text-lg font-bold text-[#2347FA] sm:text-2xl">
                                                                        <NumberTicker value={company.active_jobs_count} delay={0.25 + index * 0.05} />
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-medium text-slate-500">Total Lowongan</span>
                                                                    <span className="text-lg font-bold text-slate-700 sm:text-2xl">
                                                                        <NumberTicker value={company.total_job_posts} delay={0.3 + index * 0.05} />
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                                {company.website && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        asChild
                                                                        className="w-full border-blue-200 text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                                                                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                                    >
                                                                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                                            <ExternalLink className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                            <span className="text-xs sm:text-sm">Website</span>
                                                                        </a>
                                                                    </Button>
                                                                )}
                                                                <Link href={`/companies/${company.id}`} className="w-full">
                                                                    <Button className="w-full rounded-lg bg-gradient-to-r from-[#2347FA] to-indigo-600 text-xs text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-[#1d3dfa] hover:to-indigo-700 hover:shadow-lg sm:text-sm">
                                                                        Lihat Detail
                                                                        <ChevronRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                            </motion.div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="max-w-md mx-auto">
                                    <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                        <Building2 className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        Tidak ada perusahaan ditemukan
                                    </h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        Coba ubah kata kunci pencarian atau filter Anda untuk menemukan perusahaan yang sesuai
                                    </p>
                                    <Button 
                                        onClick={clearFilters} 
                                        className="bg-[#2347FA] hover:bg-[#1e40e0] text-white px-8 py-3"
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        Reset Pencarian
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {companies.last_page > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-1 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                                    {companies.current_page > 1 && (
                                        <Link
                                            href={`/companies?page=${companies.current_page - 1}`}
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2347FA] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                             Previous
                                        </Link>
                                    )}

                                    {Array.from({ length: Math.min(5, companies.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Link
                                                key={page}
                                                href={`/companies?page=${page}`}
                                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                                    page === companies.current_page
                                                        ? 'text-white bg-[#2347FA] shadow-sm'
                                                        : 'text-gray-600 hover:text-[#2347FA] hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        );
                                    })}

                                    {companies.current_page < companies.last_page && (
                                        <Link
                                            href={`/companies?page=${companies.current_page + 1}`}
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2347FA] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            Next →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
