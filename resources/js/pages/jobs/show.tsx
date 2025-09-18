import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { NumberTicker } from '@/components/magicui/number-ticker';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Calendar,
    ArrowLeft,
    Building2,
    Eye,
    Users,
    CheckCircle,
    ExternalLink,
    Star,
    Award,
    Target,
    TrendingUp,
    Shield,
    User,
    Home,
    Laptop,
    Globe,
    Bookmark,
    BookmarkCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

interface Company {
    id: number;
    name: string;
    logo: string | null;
    location: string;
    industry: string;
    is_verified: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Skill {
    id: number;
    name: string;
    pivot: {
        required: boolean;
        proficiency_level: string;
    };
}

interface JobListing {
    id: number;
    slug: string;
    title: string;
    description: string;
    requirements: string | null;
    benefits: string | string[] | null;
    employment_type: string;
    work_arrangement: string;
    experience_level: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string;
    salary_negotiable: boolean;
    location: string;
    application_deadline: string | null;
    positions_available: number;
    status: string;
    featured: boolean;
    views_count: number;
    applications_count: number;
    created_at: string;
    company: Company;
    category: Category | null;
    skills: Skill[];
    remaining_positions: number;
    creator?: {
        id: number;
        name: string;
    };
}

interface JobShowProps {
    job: JobListing;
    relatedJobs: JobListing[];
    hasApplied: boolean;
    isSaved?: boolean;
}

export default function JobShow({ job, relatedJobs, hasApplied, isSaved = false }: JobShowProps) {
    const [isJobSaved, setIsJobSaved] = useState(isSaved);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveJob = async () => {
        try {
            setIsSaving(true);

            const response = await axios.post(`/api/v1/jobs/${job.slug}/save`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                withCredentials: true
            });

            setIsJobSaved(response.data.saved);
        } catch (error) {
            console.error('Error saving job:', error);
            // You might want to show a toast notification here
        } finally {
            setIsSaving(false);
        }
    };

    const formatSalary = (min: number | null, max: number | null, currency: string = 'IDR', negotiable: boolean = false) => {
        if (negotiable) return 'Gaji dapat dinegosiasi';
        if (!min && !max) return 'Gaji tidak disebutkan';
        
        const formatNumber = (num: number) => {
            if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}M`;
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
            if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
            return num.toLocaleString();
        };

        const prefix = currency === 'IDR' ? 'Rp ' : `${currency} `;
        
        if (min && max) {
            return `${prefix}${formatNumber(min)} - ${formatNumber(max)}`;
        }
        if (min) return `Mulai dari ${prefix}${formatNumber(min)}`;
        if (max) return `Hingga ${prefix}${formatNumber(max)}`;
        return 'Gaji tidak disebutkan';
    };

    const formatEmploymentType = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'full_time': 'Full Time',
            'part_time': 'Part Time',
            'contract': 'Kontrak',
            'internship': 'Magang',
            'freelance': 'Freelance'
        };
        return typeMap[type] || type;
    };

    const formatWorkArrangement = (arrangement: string) => {
        const arrangementMap: { [key: string]: string } = {
            'on_site': 'On-site',
            'remote': 'Remote',
            'hybrid': 'Hybrid'
        };
        return arrangementMap[arrangement] || arrangement;
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

    const getWorkArrangementIcon = (arrangement: string) => {
        switch (arrangement) {
            case 'remote': return Globe;
            case 'hybrid': return Laptop;
            default: return Building2;
        }
    };

    const formatText = (text: string | null) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => (
            <div key={index} className="mb-2 last:mb-0">
                {line.startsWith('• ') || line.startsWith('- ') ? (
                    <div className="flex items-start space-x-2">
                        <span className="text-[#2347FA] mt-1">•</span>
                        <span>{line.substring(2)}</span>
                    </div>
                ) : (
                    <div>{line}</div>
                )}
            </div>
        ));
    };

    return (
        <>
            <Head title={`${job.title} - ${job.company.name}`} />
            
            <div className="min-h-screen bg-gray-50">
                <ModernNavbar currentPage="jobs" />

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
                                href="/jobs"
                                className="inline-flex items-center text-gray-600 hover:text-[#2347FA] transition-colors group"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                Kembali ke Daftar Lowongan
                            </Link>
                        </motion.div>

                        {/* Job Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4 sm:gap-6 lg:gap-8">
                                {/* Company Logo */}
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shadow-2xl ring-4 sm:ring-6 lg:ring-8 ring-white border-2 sm:border-3 lg:border-4 border-gray-100">
                                        {job.company.logo ? (
                                            <AvatarImage src={job.company.logo} alt={job.company.name} className="object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-gradient-to-br from-[#2347FA] via-[#3b56fc] to-[#5a6cfd] text-white text-2xl font-bold">
                                                {job.company.name.charAt(0)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    {job.company.is_verified && (
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Job Info */}
                                <div className="flex-1 space-y-4 sm:space-y-6">
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                                                {job.title}
                                            </h1>
                                            {job.featured && (
                                                <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 shadow-sm px-3 py-1">
                                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                                    Unggulan
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                                            <Link 
                                                href={`/companies/${job.company.id}`}
                                                className="flex items-center gap-2 hover:text-[#2347FA] transition-colors"
                                            >
                                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                                    {job.company.name}
                                                </h2>
                                                {job.company.is_verified && (
                                                    <Shield className="w-4 h-4 text-blue-500" />
                                                )}
                                            </Link>
                                            {job.category && (
                                                <Badge className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200 px-3 py-1">
                                                    <Briefcase className="w-3 h-3 mr-1" />
                                                    {job.category.name}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                                            <span className="block sm:inline">{job.company.industry}</span>
                                            <span className="hidden sm:inline mx-2">•</span>
                                            <span className="block sm:inline">{job.company.location}</span>
                                        </p>
                                    </div>

                                    {/* Job Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2347FA] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm text-gray-500">Lokasi</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{job.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#2347FA] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm text-gray-500">Tipe</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{formatEmploymentType(job.employment_type)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
                                            <div className="flex items-center space-x-2">
                                                {React.createElement(getWorkArrangementIcon(job.work_arrangement), { 
                                                    className: "w-4 h-4 sm:w-5 sm:h-5 text-[#2347FA] flex-shrink-0" 
                                                })}
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm text-gray-500">Kerja</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{formatWorkArrangement(job.work_arrangement)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200 sm:col-span-2">
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#2347FA] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm text-gray-500">Level Pengalaman</p>
                                                    <p className="font-semibold text-sm sm:text-base text-gray-900">{formatExperienceLevel(job.experience_level)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary & Stats */}
                                    <div className="flex flex-col gap-4 p-3 sm:p-4 bg-gradient-to-r from-[#2347FA]/5 to-[#3b56fc]/5 rounded-xl border border-[#2347FA]/10">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex items-center space-x-2 flex-1">
                                                <TrendingUp className="w-5 h-5 text-[#2347FA] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500">Gaji</p>
                                                    <p className="font-bold text-base sm:text-lg text-[#2347FA] break-words">
                                                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-4 h-4 flex-shrink-0" />
                                                    <span>{job.views_count} views</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="w-4 h-4 flex-shrink-0" />
                                                    <span>{job.applications_count} pelamar</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Diposting</p>
                                                    <p className="font-medium text-gray-700">{getDaysAgo(job.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alert if already applied */}
                                    {hasApplied && (
                                        <Alert className="border-green-200 bg-green-50">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-800 font-medium">
                                                Anda sudah melamar untuk posisi ini. Terima kasih atas minat Anda!
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 sm:px-0">
                                        <Button
                                            onClick={handleSaveJob}
                                            disabled={isSaving}
                                            variant="outline"
                                            size="lg"
                                            className={`w-full sm:w-auto border-2 transition-all duration-300 ${
                                                isJobSaved
                                                    ? 'bg-[#2347FA] text-white border-[#2347FA] hover:bg-[#1e40e0] hover:border-[#1e40e0]'
                                                    : 'border-gray-300 hover:border-[#2347FA] hover:text-[#2347FA]'
                                            }`}
                                        >
                                            {isSaving ? (
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            ) : isJobSaved ? (
                                                <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            ) : (
                                                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            )}
                                            {isJobSaved ? 'Tersimpan' : 'Simpan Lowongan'}
                                        </Button>

                                        {hasApplied ? (
                                            <Button
                                                size="lg"
                                                disabled
                                                className="bg-gray-400 text-white shadow-lg px-6 sm:px-8 w-full sm:w-auto cursor-not-allowed"
                                            >
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                Sudah Melamar
                                            </Button>
                                        ) : (
                                            <Link href={`/jobs/${job.slug}/apply`} className="w-full sm:w-auto">
                                                <Button
                                                    size="lg"
                                                    className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] hover:from-[#1e40e0] hover:to-[#2347FA] text-white shadow-lg transform transition-all duration-300 hover:scale-105 px-6 sm:px-8 w-full sm:w-auto"
                                                >
                                                    <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                                    Lamar Sekarang
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    {/* Application Deadline */}
                                    {job.application_deadline && (
                                        <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-3 border border-amber-200">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">Batas lamaran: {formatDate(job.application_deadline)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Job Details Content */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                                {/* Job Overview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                                                <Target className="w-6 h-6 mr-3 text-[#2347FA]" />
                                                Ringkasan Lowongan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-blue-500 rounded-full p-2">
                                                            <Clock className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-blue-600 font-medium">Tipe Pekerjaan</p>
                                                            <p className="font-bold text-blue-800">{formatEmploymentType(job.employment_type)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-green-500 rounded-full p-2">
                                                            {React.createElement(getWorkArrangementIcon(job.work_arrangement), { 
                                                                className: "w-4 h-4 text-white" 
                                                            })}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-green-600 font-medium">Pengaturan Kerja</p>
                                                            <p className="font-bold text-green-800">{formatWorkArrangement(job.work_arrangement)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-purple-500 rounded-full p-2">
                                                            <User className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-purple-600 font-medium">Level Pengalaman</p>
                                                            <p className="font-bold text-purple-800">{formatExperienceLevel(job.experience_level)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 sm:col-span-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-orange-500 rounded-full p-2">
                                                            <TrendingUp className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-orange-600 font-medium">Range Gaji</p>
                                                            <p className="font-bold text-orange-800 text-lg">
                                                                {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_negotiable)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-red-500 rounded-full p-2">
                                                            <Users className="w-4 h-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-red-600 font-medium">Posisi Tersedia</p>
                                                            <p className="font-bold text-red-800">
                                                                <NumberTicker value={job.positions_available} className="font-bold text-red-800" delay={0.8} /> posisi
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                                {/* Job Description */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                                                <Briefcase className="w-6 h-6 mr-3 text-[#2347FA]" />
                                                Deskripsi Pekerjaan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                                                {job.description?.includes('<') ? (
                                                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                                                ) : (
                                                    formatText(job.description)
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Requirements */}
                                {job.requirements && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                    >
                                        <Card className="shadow-lg border-0">
                                            <CardHeader>
                                                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                                                    <CheckCircle className="w-6 h-6 mr-3 text-[#2347FA]" />
                                                    Persyaratan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                                                    {job.requirements ? (
                                                        job.requirements.includes('<') ? (
                                                            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
                                                        ) : (
                                                            formatText(job.requirements)
                                                        )
                                                    ) : (
                                                        <p className="text-gray-500 italic">Tidak ada persyaratan khusus yang disebutkan.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Benefits */}
                                {job.benefits && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                        <Card className="shadow-lg border-0">
                                            <CardHeader>
                                                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                                                    <Award className="w-6 h-6 mr-3 text-[#2347FA]" />
                                                    Tunjangan & Fasilitas
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                                                    {job.benefits ? (
                                                        typeof job.benefits === 'string' ? (
                                                            formatText(job.benefits)
                                                        ) : Array.isArray(job.benefits) ? (
                                                            <ul className="space-y-3">
                                                                {job.benefits.map((benefit, index) => (
                                                                    <li key={index} className="flex items-start space-x-3">
                                                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                                        <span>{benefit}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            formatText(job.benefits)
                                                        )
                                                    ) : (
                                                        <p className="text-gray-500 italic">Tidak ada informasi benefit yang tersedia.</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Skills */}
                                {job.skills.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                    >
                                        <Card className="shadow-lg border-0">
                                            <CardHeader>
                                                <CardTitle className="flex items-center text-xl font-bold text-gray-900">
                                                    <Target className="w-6 h-6 mr-3 text-[#2347FA]" />
                                                    Keahlian yang Dibutuhkan
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap gap-3">
                                                        {job.skills.map((skill) => (
                                                            <div key={skill.id} className="flex items-center">
                                                                <Badge 
                                                                    className={`px-3 py-2 ${
                                                                        skill.pivot.required 
                                                                            ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200' 
                                                                            : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200'
                                                                    }`}
                                                                >
                                                                    {skill.name}
                                                                    {skill.pivot.required && (
                                                                        <span className="ml-2 text-red-500 font-bold">*</span>
                                                                    )}
                                                                </Badge>
                                                                {skill.pivot.proficiency_level && (
                                                                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                        {skill.pivot.proficiency_level}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {job.skills.some(skill => skill.pivot.required) && (
                                                        <div className="text-sm text-gray-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                                            <span className="text-red-500 font-bold">*</span> Menandakan keahlian yang wajib dimiliki
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4 lg:space-y-6">
                                {/* Company Info */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                                <Building2 className="w-5 h-5 mr-2 text-[#2347FA]" />
                                                Tentang Perusahaan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Link 
                                                href={`/companies/${job.company.id}`}
                                                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors"
                                            >
                                                <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                                                    {job.company.logo ? (
                                                        <AvatarImage src={job.company.logo} alt={job.company.name} />
                                                    ) : (
                                                        <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-bold">
                                                            {job.company.name.charAt(0)}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{job.company.name}</h3>
                                                    <p className="text-sm text-gray-600">{job.company.industry}</p>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                            </Link>
                                            
                                            <Separator />
                                            
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-[#2347FA]" />
                                                {job.company.location}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Job Stats */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                                <TrendingUp className="w-5 h-5 mr-2 text-[#2347FA]" />
                                                Statistik Lowongan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        <NumberTicker value={job.views_count} className="text-2xl font-bold text-blue-600" delay={0.2} />
                                                    </div>
                                                    <div className="text-sm text-blue-700">Views</div>
                                                </div>
                                                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        <NumberTicker value={job.applications_count} className="text-2xl font-bold text-green-600" delay={0.4} />
                                                    </div>
                                                    <div className="text-sm text-green-700">Pelamar</div>
                                                </div>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Posisi tersedia:</span>
                                                    <span className="font-medium text-gray-900">
                                                        <NumberTicker value={job.positions_available} className="font-medium text-gray-900" delay={0.6} />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Sisa posisi:</span>
                                                    <span className="font-medium text-[#2347FA]">
                                                        <NumberTicker value={job.remaining_positions} className="font-medium text-[#2347FA]" delay={0.8} />
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Status:</span>
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        {job.status === 'published' ? 'Aktif' : job.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {/* Job Meta Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.9 }}
                                >
                                    <Card className="shadow-lg border-0">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                                <Shield className="w-5 h-5 mr-2 text-[#2347FA]" />
                                                Informasi Lowongan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex flex-col space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">ID Lowongan:</span>
                                                    <span className="font-mono font-medium">{job.id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Kategori:</span>
                                                    <span className="font-medium">{job.category?.name || 'Tidak dikategorikan'}</span>
                                                </div>
                                                {job.creator && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Diposting oleh:</span>
                                                        <span className="font-medium">{job.creator.name}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tanggal posting:</span>
                                                    <span className="font-medium">{formatDate(job.created_at)}</span>
                                                </div>
                                                {job.application_deadline && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Batas lamaran:</span>
                                                        <span className="font-medium text-red-600">{formatDate(job.application_deadline)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                                        {job.status === 'published' ? 'Aktif' : job.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Jobs */}
                {relatedJobs.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                        Lowongan Serupa
                                    </h2>
                                    <p className="text-gray-600 text-lg">
                                        Jelajahi peluang karir lain yang mungkin Anda minati
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {relatedJobs.map((relatedJob, index) => (
                                        <motion.div
                                            key={relatedJob.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                                        >
                                            <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-0 shadow-lg h-full">
                                                <CardContent className="p-6 flex flex-col h-full">
                                                    <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                                                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-gray-200 flex-shrink-0">
                                                            {relatedJob.company.logo ? (
                                                                <AvatarImage src={relatedJob.company.logo} alt={relatedJob.company.name} />
                                                            ) : (
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white font-bold">
                                                                    {relatedJob.company.name.charAt(0)}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 hover:text-[#2347FA] transition-colors line-clamp-2">
                                                                {relatedJob.title}
                                                            </h3>
                                                            <p className="text-xs sm:text-sm text-gray-600 truncate">{relatedJob.company.name}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                                                            {formatEmploymentType(relatedJob.employment_type)}
                                                        </Badge>
                                                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                                                            {formatWorkArrangement(relatedJob.work_arrangement)}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 mb-4">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        <span className="truncate">{relatedJob.location}</span>
                                                    </div>
                                                    
                                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-[#2347FA]">
                                                                {formatSalary(relatedJob.salary_min, relatedJob.salary_max, relatedJob.salary_currency, relatedJob.salary_negotiable)}
                                                            </span>
                                                            <Link href={`/jobs/${relatedJob.slug}`}>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline"
                                                                    className="border-[#2347FA] text-[#2347FA] hover:bg-[#2347FA] hover:text-white transition-all duration-200"
                                                                >
                                                                    Lihat
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </section>
                )}

                <ModernFooter />
            </div>
        </>
    );
}