import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { 
    Search, 
    MapPin, 
    Building2, 
    Users,
    Star,
    ExternalLink,
    ChevronRight,
    ArrowRight,
    Briefcase,
    CheckCircle,
    Filter,
    Grid3X3,
    List
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        <>
            <Head title="Perusahaan" />
            
            <div className="min-h-screen bg-gray-50">
                {/* Modern Navbar */}
                <ModernNavbar currentPage="companies" />

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

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredCompanies.slice(0, 6).map((company, index) => (
                                    <motion.div
                                        key={company.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50 shadow-lg">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col space-y-4">
                                                    {/* Header with logo and badge */}
                                                    <div className="flex items-start justify-between">
                                                        <div className="relative">
                                                            <Avatar className="w-16 h-16 shadow-md ring-4 ring-white">
                                                                {company.logo ? (
                                                                    <AvatarImage src={company.logo} alt={company.name} />
                                                                ) : (
                                                                    <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white text-xl font-bold">
                                                                        {company.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            {company.is_verified && (
                                                                <CheckCircle className="absolute -top-1 -right-1 w-6 h-6 text-blue-500 bg-white rounded-full" />
                                                            )}
                                                        </div>
                                                        <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 font-semibold">
                                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                                            Unggulan
                                                        </Badge>
                                                    </div>
                                                    
                                                    {/* Company info */}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2347FA] transition-colors mb-1">
                                                            {company.name}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm font-medium">{company.industry}</p>
                                                    </div>
                                                    
                                                    {/* Location and size */}
                                                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            {company.location}
                                                        </span>
                                                        <span className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                                            <Users className="w-4 h-4 mr-1" />
                                                            {formatCompanySize(company.size)}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Description */}
                                                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                                                        {company.description}
                                                    </p>
                                                    
                                                    {/* Footer with jobs count and button */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                        <div>
                                                            <span className="text-xl font-bold text-[#2347FA]">
                                                                <NumberTicker value={company.active_jobs_count} className="text-xl font-bold text-[#2347FA]" delay={0.3 + index * 0.1} />
                                                            </span>
                                                            <span className="text-sm text-gray-500 ml-1">
                                                                lowongan aktif
                                                            </span>
                                                        </div>
                                                        <Link
                                                            href={`/companies/${company.id}`}
                                                            className="inline-flex"
                                                        >
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white transition-all duration-200"
                                                            >
                                                                Lihat Detail
                                                                <ArrowRight className="w-4 h-4 ml-2" />
                                                            </Button>
                                                        </Link>
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

                        {/* Controls */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-900"><NumberTicker value={companies.data.length} className="font-semibold text-gray-900" delay={0.1} /></span> perusahaan tersedia
                                    </span>
                                </div>
                                {(searchQuery || locationQuery || selectedIndustry || selectedSize) && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Filter className="w-4 h-4" />
                                        <span>Filter aktif</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 hidden sm:block">Tampilan:</span>
                                <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1 border border-gray-200 shadow-inner">
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-lg transition-all duration-300 font-medium ${
                                            viewMode === 'grid' 
                                                ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg transform scale-105' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                        }`}
                                    >
                                        <Grid3X3 className="w-4 h-4 mr-2" />
                                        Grid
                                    </Button>
                                    <Button 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={`rounded-lg transition-all duration-300 font-medium ${
                                            viewMode === 'list' 
                                                ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white shadow-lg transform scale-105' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                        }`}
                                    >
                                        <List className="w-4 h-4 mr-2" />
                                        List
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {companies.data.length > 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className={viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
                            >
                                {companies.data.map((company, index) => (
                                    <motion.div
                                        key={company.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            delay: 0.5 + (index * 0.05),
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }}
                                        className="group"
                                    >
                                        <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 bg-white shadow-lg overflow-hidden">
                                            <CardContent className={`${viewMode === 'grid' ? 'p-6' : 'p-6'}`}>
                                                {viewMode === 'grid' ? (
                                                    // Enhanced Grid View
                                                    <div className="flex flex-col space-y-5">
                                                        {/* Header with enhanced styling */}
                                                        <div className="flex items-start justify-between">
                                                            <div className="relative">
                                                                <div className="relative">
                                                                    <Avatar className="w-18 h-18 shadow-xl ring-4 ring-white border-2 border-gray-100">
                                                                        {company.logo ? (
                                                                            <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                                                                        ) : (
                                                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] via-[#3b56fc] to-[#5a6cfd] text-white text-xl font-bold">
                                                                                {company.name.charAt(0)}
                                                                            </AvatarFallback>
                                                                        )}
                                                                    </Avatar>
                                                                    {company.is_verified && (
                                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {company.is_verified && (
                                                                <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm">
                                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                                    Terverifikasi
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Company Info with better spacing */}
                                                        <div className="text-center space-y-2">
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2347FA] transition-colors duration-300 leading-tight">
                                                                {company.name}
                                                            </h3>
                                                            <div className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-3 py-1 border border-gray-200">
                                                                <Briefcase className="w-3 h-3 mr-1 text-gray-500" />
                                                                <span className="text-gray-700 text-sm font-medium">{company.industry}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Enhanced Metadata */}
                                                        <div className="flex justify-center gap-6 text-sm">
                                                            <div className="flex items-center space-x-1 text-gray-600">
                                                                <MapPin className="w-4 h-4 text-[#2347FA]" />
                                                                <span className="font-medium">{company.location}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1 text-gray-600">
                                                                <Users className="w-4 h-4 text-[#2347FA]" />
                                                                <span className="font-medium">{formatCompanySize(company.size)}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Enhanced Description */}
                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                                            <p className="text-gray-700 text-sm text-center line-clamp-3 leading-relaxed">
                                                                {company.description}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Enhanced Footer */}
                                                        <div className="pt-5 border-t border-gray-100">
                                                            <div className="text-center mb-5">
                                                                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#2347FA]/10 to-[#3b56fc]/10 rounded-xl px-4 py-2 border border-[#2347FA]/20">
                                                                    <Briefcase className="w-4 h-4 text-[#2347FA]" />
                                                                    <span className="text-2xl font-bold text-[#2347FA]">
                                                                        <NumberTicker value={company.active_jobs_count} className="text-2xl font-bold text-[#2347FA]" delay={0.3 + index * 0.1} />
                                                                    </span>
                                                                    <span className="text-sm text-gray-600 font-medium">
                                                                        lowongan aktif
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                {company.website && (
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        className="flex-1 border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA] transition-all duration-300" 
                                                                        asChild
                                                                    >
                                                                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                                            <ExternalLink className="w-4 h-4 mr-1" />
                                                                            Website
                                                                        </a>
                                                                    </Button>
                                                                )}
                                                                <Link href={`/companies/${company.id}`} className="flex-1">
                                                                    <Button 
                                                                        size="sm" 
                                                                        className="w-full bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg transform transition-all duration-300 hover:scale-105"
                                                                    >
                                                                        Lihat Detail
                                                                        <ArrowRight className="w-4 h-4 ml-1" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Enhanced List View
                                                    <div className="flex items-start space-x-6">
                                                        <div className="relative flex-shrink-0">
                                                            <Avatar className="w-20 h-20 shadow-xl ring-4 ring-white border-2 border-gray-100">
                                                                {company.logo ? (
                                                                    <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                                                                ) : (
                                                                    <AvatarFallback className="bg-gradient-to-br from-[#2347FA] via-[#3b56fc] to-[#5a6cfd] text-white text-xl font-bold">
                                                                        {company.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            {company.is_verified && (
                                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2347FA] transition-colors duration-300">
                                                                            {company.name}
                                                                        </h3>
                                                                        {company.is_verified && (
                                                                            <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm">
                                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                                Terverifikasi
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-3 py-1 border border-gray-200">
                                                                        <Briefcase className="w-3 h-3 mr-1 text-gray-500" />
                                                                        <span className="text-gray-700 text-sm font-medium">{company.industry}</span>
                                                                    </div>
                                                                    
                                                                    <div className="flex items-center gap-6 text-sm">
                                                                        <div className="flex items-center space-x-1 text-gray-600">
                                                                            <MapPin className="w-4 h-4 text-[#2347FA]" />
                                                                            <span className="font-medium">{company.location}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1 text-gray-600">
                                                                            <Users className="w-4 h-4 text-[#2347FA]" />
                                                                            <span className="font-medium">{formatCompanySize(company.size)}</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 max-w-2xl">
                                                                        <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                                                                            {company.description}
                                                                        </p>
                                                                    </div>
                                                                    
                                                                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#2347FA]/10 to-[#3b56fc]/10 rounded-lg px-3 py-2 border border-[#2347FA]/20">
                                                                        <Briefcase className="w-4 h-4 text-[#2347FA]" />
                                                                        <span className="text-lg font-bold text-[#2347FA]">
                                                                            <NumberTicker value={company.active_jobs_count} className="text-lg font-bold text-[#2347FA]" delay={0.3 + index * 0.1} />
                                                                        </span>
                                                                        <span className="text-sm text-gray-600 font-medium">
                                                                            lowongan aktif
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex flex-col gap-3 ml-6">
                                                                    {company.website && (
                                                                        <Button 
                                                                            variant="outline" 
                                                                            size="sm" 
                                                                            className="border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA] transition-all duration-300 min-w-[120px]" 
                                                                            asChild
                                                                        >
                                                                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                                                Website
                                                                            </a>
                                                                        </Button>
                                                                    )}
                                                                    <Link href={`/companies/${company.id}`}>
                                                                        <Button 
                                                                            size="sm" 
                                                                            className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg transform transition-all duration-300 hover:scale-105 min-w-[120px]"
                                                                        >
                                                                            Lihat Detail
                                                                            <ArrowRight className="w-4 h-4 ml-1" />
                                                                        </Button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
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
                                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2347FA] hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            ← Previous
                                        </Link>
                                    )}
                                    
                                    {Array.from({ length: Math.min(5, companies.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Link
                                                key={page}
                                                href={`/companies?page=${page}`}
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

                {/* Modern Footer */}
                <ModernFooter />
            </div>
        </>
    );
}