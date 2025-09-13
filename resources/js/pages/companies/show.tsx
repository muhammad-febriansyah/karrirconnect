import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { 
    Building2, 
    MapPin, 
    Users, 
    Globe,
    CheckCircle,
    ArrowLeft,
    Briefcase,
    Calendar,
    Clock,
    ExternalLink,
    Mail,
    Phone,
    Award,
    Star,
    TrendingUp,
    Target,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface JobListing {
    id: number;
    slug: string;
    title: string;
    type: string;
    location: string;
    salary_min: number | null;
    salary_max: number | null;
    experience_level: string;
    created_at: string;
    application_deadline: string | null;
    category: {
        id: number;
        name: string;
    } | null;
}

interface Company {
    id: number;
    name: string;
    description: string;
    logo: string | null;
    website: string;
    email: string | null;
    phone: string | null;
    industry: string;
    size: string;
    location: string;
    is_verified: boolean;
    is_active: boolean;
    job_listings: JobListing[];
}

interface CompanyShowProps {
    company: Company;
}

export default function CompanyShow({ company }: CompanyShowProps) {
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

    const formatSalary = (min: number | null, max: number | null) => {
        if (!min && !max) return 'Gaji tidak disebutkan';
        if (min && max) return `Rp ${min.toLocaleString()} - Rp ${max.toLocaleString()}`;
        if (min) return `Mulai dari Rp ${min.toLocaleString()}`;
        if (max) return `Hingga Rp ${max.toLocaleString()}`;
        return 'Gaji tidak disebutkan';
    };

    const formatExperienceLevel = (level: string) => {
        const levelMap: { [key: string]: string } = {
            'entry': 'Entry Level',
            'mid': 'Mid Level',
            'senior': 'Senior Level',
            'lead': 'Lead/Manager',
            'director': 'Director'
        };
        return levelMap[level] || level;
    };

    const formatJobType = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'full-time': 'Full Time',
            'part-time': 'Part Time',
            'contract': 'Kontrak',
            'internship': 'Magang',
            'freelance': 'Freelance'
        };
        return typeMap[type] || type;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 hari yang lalu';
        if (diffDays < 30) return `${diffDays} hari yang lalu`;
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return months === 1 ? '1 bulan yang lalu' : `${months} bulan yang lalu`;
        }
        const years = Math.floor(diffDays / 365);
        return years === 1 ? '1 tahun yang lalu' : `${years} tahun yang lalu`;
    };

    return (
        <>
            <Head title={`${company.name} - Detail Perusahaan`} />
            
            <div className="min-h-screen bg-gray-50">
                <ModernNavbar currentPage="companies" />

                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-16 overflow-hidden">
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
                        {/* Back Button */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <Link 
                                href="/companies"
                                className="inline-flex items-center text-gray-600 hover:text-[#2347FA] transition-colors group"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Kembali ke Daftar Perusahaan
                            </Link>
                        </motion.div>

                        {/* Company Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                                {/* Company Logo */}
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-32 h-32 shadow-2xl ring-8 ring-white border-4 border-gray-100">
                                        {company.logo ? (
                                            <AvatarImage src={company.logo} alt={company.name} className="object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] via-[#3b56fc] to-[#5a6cfd] text-white text-4xl font-bold">
                                                {company.name.charAt(0)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    {company.is_verified && (
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Company Info */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <div className="flex items-center gap-4 mb-3">
                                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                                                {company.name}
                                            </h1>
                                            {company.is_verified && (
                                                <Badge className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm px-3 py-1">
                                                    <Shield className="w-4 h-4 mr-1" />
                                                    Terverifikasi
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-4">
                                            <Badge className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 px-3 py-1">
                                                <Briefcase className="w-4 h-4 mr-1" />
                                                {company.industry}
                                            </Badge>
                                        </div>

                                        <p className="text-gray-700 text-lg leading-relaxed line-clamp-3">
                                            {company.description}
                                        </p>
                                    </div>

                                    {/* Company Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-5 h-5 text-[#2347FA]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Lokasi</p>
                                                    <p className="font-semibold text-gray-900">{company.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <Users className="w-5 h-5 text-[#2347FA]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Ukuran</p>
                                                    <p className="font-semibold text-gray-900">{formatCompanySize(company.size)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <Briefcase className="w-5 h-5 text-[#2347FA]" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Lowongan</p>
                                                    <p className="font-semibold text-gray-900">{company.job_listings.length} aktif</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4">
                                        {company.website && (
                                            <Button 
                                                variant="outline" 
                                                className="border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA] transition-all duration-300" 
                                                asChild
                                            >
                                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    Kunjungi Website
                                                    <ExternalLink className="w-3 h-3 ml-2" />
                                                </a>
                                            </Button>
                                        )}
                                        
                                        {company.email && (
                                            <Button 
                                                variant="outline"
                                                className="border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA] transition-all duration-300"
                                                asChild
                                            >
                                                <a href={`mailto:${company.email}`}>
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    Kirim Email
                                                </a>
                                            </Button>
                                        )}
                                        
                                        {company.phone && (
                                            <Button 
                                                variant="outline"
                                                className="border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA] transition-all duration-300"
                                                asChild
                                            >
                                                <a href={`tel:${company.phone}`}>
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    Hubungi
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Job Listings Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="text-center mb-12">
                                <div className="flex items-center justify-center mb-4">
                                    <Briefcase className="h-8 w-8 text-[#2347FA] mr-3" />
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        Lowongan Pekerjaan Tersedia
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-lg">
                                    {company.job_listings.length > 0 
                                        ? `${company.job_listings.length} lowongan pekerjaan aktif dari ${company.name}`
                                        : `Saat ini ${company.name} tidak memiliki lowongan yang aktif`
                                    }
                                </p>
                            </div>

                            {company.job_listings.length > 0 ? (
                                <div className="grid gap-6">
                                    {company.job_listings.map((job, index) => (
                                        <motion.div
                                            key={job.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                                        >
                                            <Card className="hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 border-0 shadow-lg">
                                                <CardContent className="p-8">
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#2347FA] transition-colors">
                                                                        {job.title}
                                                                    </h3>
                                                                    <div className="flex flex-wrap gap-3 mb-4">
                                                                        <Badge className="bg-gradient-to-r from-[#2347FA]/10 to-[#3b56fc]/10 text-[#2347FA] border-[#2347FA]/20">
                                                                            {formatJobType(job.type)}
                                                                        </Badge>
                                                                        <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200">
                                                                            {formatExperienceLevel(job.experience_level)}
                                                                        </Badge>
                                                                        {job.category && (
                                                                            <Badge className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200">
                                                                                {job.category.name}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                                <div className="flex items-center space-x-2">
                                                                    <MapPin className="w-4 h-4 text-[#2347FA]" />
                                                                    <span>{job.location}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <TrendingUp className="w-4 h-4 text-[#2347FA]" />
                                                                    <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Clock className="w-4 h-4 text-[#2347FA]" />
                                                                    <span>{getDaysAgo(job.created_at)}</span>
                                                                </div>
                                                            </div>

                                                            {job.application_deadline && (
                                                                <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                                                                    <Target className="w-4 h-4" />
                                                                    <span>Batas lamaran: {formatDate(job.application_deadline)}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row gap-3">
                                                            <Link href={`/jobs/${job.slug}`}>
                                                                <Button 
                                                                    className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg transform transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                                                                >
                                                                    Lihat Detail
                                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="max-w-md mx-auto">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-gray-200">
                                            <Briefcase className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            Belum Ada Lowongan Tersedia
                                        </h3>
                                        <p className="text-gray-600 mb-8 leading-relaxed">
                                            Saat ini {company.name} tidak memiliki lowongan pekerjaan yang aktif. 
                                            Silakan cek kembali nanti atau jelajahi perusahaan lain.
                                        </p>
                                        <Link href="/companies">
                                            <Button className="bg-[#2347FA] hover:bg-[#1e40e0] text-white px-8 py-3">
                                                <Building2 className="mr-2 h-4 w-4" />
                                                Jelajahi Perusahaan Lain
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>

                <ModernFooter />
            </div>
        </>
    );
}