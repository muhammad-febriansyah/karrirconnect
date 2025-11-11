import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    MapPin,
    Building2,
    Eye,
    FileText,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import MainLayout from '@/layouts/main-layout';

interface JobListing {
    id?: number;
    slug?: string;
    title?: string;
    company?: {
        name?: string;
        logo?: string;
    };
    location?: string;
    category?: {
        name?: string;
    };
}

interface JobApplication {
    id: number;
    status: string;
    created_at: string;
    jobListing?: JobListing;
}

interface PaginatedApplications {
    data: JobApplication[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    applications: PaginatedApplications;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'reviewing':
            return 'bg-blue-100 text-blue-800';
        case 'shortlisted':
            return 'bg-purple-100 text-purple-800';
        case 'interview':
            return 'bg-indigo-100 text-indigo-800';
        case 'hired':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Menunggu Review';
        case 'reviewing':
            return 'Sedang Direview';
        case 'shortlisted':
            return 'Masuk Shortlist';
        case 'interview':
            return 'Wawancara';
        case 'hired':
            return 'Diterima';
        case 'rejected':
            return 'Ditolak';
        default:
            return status;
    }
};

export default function UserApplications({ applications }: Props) {
    // Debug: Log the received data

    return (
        <MainLayout currentPage="applications">
            <Head title="Lamaran Saya" />

                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/user/dashboard"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Dashboard
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lamaran Saya</h1>
                            <p className="text-gray-600">
                                Total {applications.total} lamaran kerja yang telah Anda kirimkan
                            </p>
                        </motion.div>
                    </div>

                    {/* Applications List */}
                    <div className="space-y-6">
                        {applications.data.length > 0 ? (
                            applications.data.map((application, index) => (
                                <motion.div
                                    key={application.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        {application.jobListing?.company?.logo ? (
                                                            <img
                                                                src={application.jobListing.company.logo}
                                                                alt={application.jobListing.company.name}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                                <Building2 className="h-6 w-6 text-white" />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                {application.jobListing?.title || 'Posisi tidak tersedia'}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span className="flex items-center gap-1">
                                                                    <Building2 className="h-4 w-4" />
                                                                    {application.jobListing?.company?.name || 'Perusahaan tidak tersedia'}
                                                                </span>
                                                                {application.jobListing?.location && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="h-4 w-4" />
                                                                        {application.jobListing.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            Dilamar pada {new Date(application.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                        {application.jobListing?.category?.name && (
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="h-4 w-4" />
                                                                {application.jobListing.category.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Badge className={getStatusColor(application.status)}>
                                                        {getStatusLabel(application.status)}
                                                    </Badge>

                                                    {application.jobListing?.slug && (
                                                        <Link href={`/jobs/${application.jobListing.slug}`}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Lihat
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum Ada Lamaran
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Anda belum mengirimkan lamaran pekerjaan apapun.
                                </p>
                                <Link href="/jobs">
                                    <Button>
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        Cari Lowongan
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Pagination */}
                    {applications.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-2">
                                {applications.current_page > 1 && (
                                    <Link
                                        href={`/user/applications?page=${applications.current_page - 1}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Sebelumnya
                                        </Button>
                                    </Link>
                                )}

                                <span className="text-sm text-gray-600 mx-4">
                                    Halaman {applications.current_page} dari {applications.last_page}
                                </span>

                                {applications.current_page < applications.last_page && (
                                    <Link
                                        href={`/user/applications?page=${applications.current_page + 1}`}
                                    >
                                        <Button variant="outline" size="sm">
                                            Selanjutnya
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </MainLayout>
    );
}