import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Briefcase, 
    BookmarkCheck, 
    Clock, 
    Users, 
    Calendar,
    MapPin,
    ExternalLink,
    Eye,
    FileText,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';

interface JobListing {
    id?: number;
    title?: string;
    company?: {
        name?: string;
        logo?: string;
    };
    location?: string;
    employment_type?: string;
    created_at?: string;
}

interface JobApplication {
    id: number;
    status: string;
    created_at: string;
    jobListing?: JobListing;
}

interface SavedJob {
    id: number;
    created_at: string;
    jobListing?: JobListing;
}

interface DashboardProps {
    stats?: {
        applications: number;
        saved_jobs: number;
        pending_applications: number;
        interview_applications: number;
    };
    recentApplications?: JobApplication[];
    savedJobs?: SavedJob[];
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'pending': return 'secondary';
        case 'reviewing': return 'default';
        case 'shortlisted': return 'default';
        case 'interview': return 'default';
        case 'hired': return 'default';
        case 'rejected': return 'destructive';
        default: return 'secondary';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending': return 'Menunggu';
        case 'reviewing': return 'Ditinjau';
        case 'shortlisted': return 'Shortlist';
        case 'interview': return 'Interview';
        case 'hired': return 'Diterima';
        case 'rejected': return 'Ditolak';
        default: return status;
    }
};

export default function UserDashboard({ 
    stats = { applications: 0, saved_jobs: 0, pending_applications: 0, interview_applications: 0 }, 
    recentApplications = [], 
    savedJobs = [] 
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                <ModernNavbar />
                
                <main className="pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard Saya</h1>
                            <p className="text-gray-600 mt-2">Kelola profil dan lamaran pekerjaan Anda</p>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Total Lamaran
                                        </CardTitle>
                                        <Briefcase className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.applications}</div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Semua lamaran yang pernah dikirim
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Pekerjaan Disimpan
                                        </CardTitle>
                                        <BookmarkCheck className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.saved_jobs}</div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Lowongan yang disimpan
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Menunggu Respon
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.pending_applications}</div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Lamaran dalam proses
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">
                                            Interview
                                        </CardTitle>
                                        <Users className="h-4 w-4 text-purple-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.interview_applications}</div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Tahap interview
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Applications */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            Lamaran Terbaru
                                        </CardTitle>
                                        <CardDescription>
                                            5 lamaran terbaru yang Anda kirimkan
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {recentApplications && recentApplications.length > 0 ? (
                                            <div className="space-y-4">
                                                {recentApplications.map((application) => (
                                                    <div key={application.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {application.jobListing?.title || 'Lowongan Tidak Tersedia'}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                                <span>{application.jobListing?.company?.name || 'Perusahaan'}</span>
                                                                <span>•</span>
                                                                <MapPin className="h-3 w-3" />
                                                                <span>{application.jobListing?.location || 'Lokasi tidak tersedia'}</span>
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(application.created_at).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <Badge variant={getStatusBadgeVariant(application.status)}>
                                                                {getStatusText(application.status)}
                                                            </Badge>
                                                            <Link 
                                                                href={`/jobs/${application.jobListing?.id || '#'}`}
                                                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                Lihat
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="pt-4 border-t">
                                                    <Link href="/user/applications">
                                                        <Button variant="outline" className="w-full">
                                                            Lihat Semua Lamaran
                                                            <ExternalLink className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 mb-4">Belum ada lamaran yang dikirim</p>
                                                <Link href="/jobs">
                                                    <Button>
                                                        Cari Pekerjaan
                                                        <ExternalLink className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Saved Jobs */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Card className="border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookmarkCheck className="h-5 w-5 text-green-600" />
                                            Pekerjaan Disimpan
                                        </CardTitle>
                                        <CardDescription>
                                            Lowongan yang Anda simpan untuk ditinjau nanti
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {savedJobs && savedJobs.length > 0 ? (
                                            <div className="space-y-4">
                                                {savedJobs.map((savedJob) => (
                                                    <div key={savedJob.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {savedJob.jobListing?.title || 'Lowongan Tidak Tersedia'}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                                <span>{savedJob.jobListing?.company?.name || 'Perusahaan'}</span>
                                                                <span>•</span>
                                                                <MapPin className="h-3 w-3" />
                                                                <span>{savedJob.jobListing?.location || 'Lokasi tidak tersedia'}</span>
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                                                <Calendar className="h-3 w-3" />
                                                                Disimpan {new Date(savedJob.created_at).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <Badge variant="secondary">
                                                                {savedJob.jobListing?.employment_type || 'Tipe Kerja'}
                                                            </Badge>
                                                            <Link 
                                                                href={`/jobs/${savedJob.jobListing?.id || '#'}`}
                                                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                Lihat
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="pt-4 border-t">
                                                    <Link href="/user/saved-jobs">
                                                        <Button variant="outline" className="w-full">
                                                            Lihat Semua
                                                            <ExternalLink className="h-4 w-4 ml-2" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <BookmarkCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 mb-4">Belum ada pekerjaan yang disimpan</p>
                                                <Link href="/jobs">
                                                    <Button>
                                                        Cari Pekerjaan
                                                        <ExternalLink className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="mt-8"
                        >
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle>Aksi Cepat</CardTitle>
                                    <CardDescription>
                                        Kelola profil dan pengaturan akun Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Link href="/user/profile">
                                            <Button variant="outline" className="w-full justify-start h-auto p-4">
                                                <User className="h-5 w-5 mr-3" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Edit Profil</div>
                                                    <div className="text-xs text-gray-500">Perbarui informasi personal</div>
                                                </div>
                                            </Button>
                                        </Link>
                                        
                                        <Link href="/jobs">
                                            <Button variant="outline" className="w-full justify-start h-auto p-4">
                                                <Briefcase className="h-5 w-5 mr-3" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Cari Pekerjaan</div>
                                                    <div className="text-xs text-gray-500">Temukan lowongan terbaru</div>
                                                </div>
                                            </Button>
                                        </Link>

                                        <Link href="/companies">
                                            <Button variant="outline" className="w-full justify-start h-auto p-4">
                                                <Users className="h-5 w-5 mr-3" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Jelajahi Perusahaan</div>
                                                    <div className="text-xs text-gray-500">Lihat profil perusahaan</div>
                                                </div>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </main>
                
                <ModernFooter />
            </div>
        </>
    );
}