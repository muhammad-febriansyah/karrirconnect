// import ModernFooter from '@/components/modern-footer';
// import ModernNavbar from '@/components/modern-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bell, BookmarkCheck, Briefcase, Calendar, Clock, ExternalLink, Eye, FileText, MapPin, MessageCircle, Star, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type SharedData } from '@/types';
import { route } from 'ziggy-js';
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
    employment_type?: string;
    created_at?: string;
}

interface JobApplication {
    id: number;
    status: string;
    created_at: string;
    jobListing?: JobListing;
}

interface SavedJob extends JobListing {
    saved_at?: string;
}

interface JobInvitationSummary {
    id: number;
    status: string;
    created_at: string;
    responded_at?: string | null;
    message?: string | null;
    company?: {
        id?: number;
        name?: string;
        logo?: string | null;
    } | null;
    jobListing?: {
        id?: number;
        slug?: string;
        title?: string;
    } | null;
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
    jobInvitations?: JobInvitationSummary[];
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'pending':
            return 'secondary';
        case 'reviewing':
            return 'default';
        case 'shortlisted':
            return 'default';
        case 'interview':
            return 'default';
        case 'hired':
            return 'default';
        case 'rejected':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Menunggu';
        case 'reviewing':
            return 'Ditinjau';
        case 'shortlisted':
            return 'Shortlist';
        case 'interview':
            return 'Interview';
        case 'hired':
            return 'Diterima';
        case 'rejected':
            return 'Ditolak';
        default:
            return status;
    }
};

const getEmploymentTypeText = (type: string) => {
    switch (type) {
        case 'full_time':
            return 'Penuh Waktu';
        case 'part_time':
            return 'Paruh Waktu';
        case 'contract':
            return 'Kontrak';
        case 'internship':
            return 'Magang';
        case 'freelance':
            return 'Freelance';
        default:
            return type || 'Tipe Kerja';
    }
};

const getInvitationBadgeVariant = (status: string) => {
    switch (status) {
        case 'accepted':
            return 'default';
        case 'declined':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const getInvitationStatusText = (status: string) => {
    switch (status) {
        case 'accepted':
            return 'Diterima';
        case 'declined':
            return 'Ditolak';
        case 'pending':
        default:
            return 'Menunggu';
    }
};

export default function UserDashboard({
    stats = { applications: 0, saved_jobs: 0, pending_applications: 0, interview_applications: 0 },
    recentApplications = [],
    savedJobs = [],
    jobInvitations = [],
}: DashboardProps) {
    const [isResponding, setIsResponding] = useState(false);

    // Show global flash messages (e.g., after redirect)
    const { flash } = usePage<SharedData>().props as any;
    const [shownFlash, setShownFlash] = useState<string | null>(null);

    useEffect(() => {
        // Create a unique key for the current flash message
        const flashKey = `${flash?.success || ''}-${flash?.error || ''}-${flash?.warning || ''}`;

        // Only show toast if it's a new flash message (not previously shown)
        if (flashKey && flashKey !== shownFlash) {
            if (flash?.success) {
                toast.success(flash.success);
            }
            if (flash?.error) {
                toast.error(flash.error);
            }
            if (flash?.warning) {
                toast.warning?.(flash.warning);
            }
            setShownFlash(flashKey);
        }
    }, [flash?.success, flash?.error, flash?.warning, shownFlash]);

    const handleInvitationResponse = async (invitationId: number, status: 'accepted' | 'declined') => {
        if (isResponding) return;

        setIsResponding(true);

        try {
            router.patch(
                route('user.job-invitations.update', invitationId),
                {
                    status: status,
                },
                {
                    preserveState: false,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        // Flash message will be handled by useEffect, no need for duplicate toast
                        setIsResponding(false);
                    },
                    onError: (errors) => {
                        console.error('Job invitation response error:', errors);

                        let errorMessage = 'Terjadi kesalahan saat merespon undangan';

                        if (typeof errors === 'object' && errors !== null) {
                            const firstError = Object.values(errors)[0];
                            if (typeof firstError === 'string') {
                                errorMessage = firstError;
                            } else if (Array.isArray(firstError) && firstError.length > 0) {
                                errorMessage = firstError[0];
                            }
                        }

                        // Handle specific error cases
                        if (errorMessage.includes('403') || errorMessage.includes('authorized') || errorMessage.includes('izin')) {
                            toast.error('Anda tidak memiliki izin untuk merespon undangan ini');
                        } else if (errorMessage.includes('sudah merespon')) {
                            toast.warning('Anda sudah merespon undangan ini sebelumnya');
                        } else {
                            toast.error(errorMessage);
                        }

                        setIsResponding(false);
                    },
                    onFinish: () => {
                        setIsResponding(false);
                    },
                },
            );
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error('Terjadi kesalahan saat merespon undangan');
            setIsResponding(false);
        }
    };
    return (
        <MainLayout currentPage="dashboard">
            <Head title="Dashboard" />

                <main className="pt-20 pb-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard Saya</h1>
                            <p className="mt-2 text-gray-600">Kelola profil dan lamaran pekerjaan Anda</p>
                        </div>

                        {/* Statistics Cards */}
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Total Lamaran</CardTitle>
                                        <Briefcase className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.applications}</div>
                                        <p className="mt-1 text-xs text-gray-500">Semua lamaran yang pernah dikirim</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Pekerjaan Disimpan</CardTitle>
                                        <BookmarkCheck className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.saved_jobs}</div>
                                        <p className="mt-1 text-xs text-gray-500">Lowongan yang disimpan</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Menunggu Respon</CardTitle>
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.pending_applications}</div>
                                        <p className="mt-1 text-xs text-gray-500">Lamaran dalam proses</p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600">Interview</CardTitle>
                                        <Users className="h-4 w-4 text-purple-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900">{stats.interview_applications}</div>
                                        <p className="mt-1 text-xs text-gray-500">Tahap interview</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Recent Applications */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                                <Card className="border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            Lamaran Terbaru
                                        </CardTitle>
                                        <CardDescription>5 lamaran terbaru yang Anda kirimkan</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {recentApplications && recentApplications.length > 0 ? (
                                            <div className="space-y-4">
                                                {recentApplications.map((application) => (
                                                    <div key={application.id} className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
                                                        <div className="min-w-0 flex-1 space-y-2">
                                                            <h4 className="break-words text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                                                                {application.jobListing?.title || 'Lowongan Telah Dihapus'}
                                                            </h4>
                                                            <p className="flex flex-wrap items-center gap-1 text-xs text-gray-600 sm:text-sm">
                                                                <span className="truncate max-w-[150px] sm:max-w-none">{application.jobListing?.company?.name || 'Perusahaan tidak tersedia'}</span>
                                                                {application.jobListing?.location && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                        <span className="truncate max-w-[100px] sm:max-w-none">{application.jobListing.location}</span>
                                                                    </>
                                                                )}
                                                            </p>
                                                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                                                <span className="whitespace-nowrap">Dilamar pada {new Date(application.created_at).toLocaleDateString('id-ID')}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
                                                            <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                                                                {getStatusText(application.status)}
                                                            </Badge>
                                                            {application.jobListing ? (
                                                                <Link
                                                                    href={`/jobs/${application.jobListing.slug || application.jobListing.id}`}
                                                                    className="flex items-center gap-1 whitespace-nowrap text-xs text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <Eye className="h-3 w-3" />
                                                                    Lihat
                                                                </Link>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                                    <Eye className="h-3 w-3" />
                                                                    Tidak tersedia
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="border-t pt-4">
                                                    <Link href={route('user.applications')}>
                                                        <Button variant="outline" className="w-full text-sm">
                                                            Lihat Semua Lamaran
                                                            <ExternalLink className="ml-2 h-4 w-4 sm:ml-3" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                                <p className="mb-4 text-gray-500">Belum ada lamaran yang dikirim</p>
                                                <Link href="/jobs">
                                                    <Button>
                                                        Cari Pekerjaan
                                                        <ExternalLink className="ml-3 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Saved Jobs */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                <Card className="border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookmarkCheck className="h-5 w-5 text-green-600" />
                                            Pekerjaan Disimpan
                                        </CardTitle>
                                        <CardDescription>Lowongan yang Anda simpan untuk ditinjau nanti</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {savedJobs && savedJobs.length > 0 ? (
                                            <div className="space-y-4">
                                                {savedJobs.map((savedJob) => (
                                                    <div key={savedJob.id} className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
                                                        <div className="min-w-0 flex-1 space-y-2">
                                                            <h4 className="break-words text-sm font-semibold leading-snug text-gray-900 sm:text-base">
                                                                {savedJob.title || 'Lowongan Tidak Tersedia'}
                                                            </h4>
                                                            <p className="flex flex-wrap items-center gap-1 text-xs text-gray-600 sm:text-sm">
                                                                <span className="truncate max-w-[120px] sm:max-w-none">{savedJob.company?.name || 'Perusahaan'}</span>
                                                                <span>•</span>
                                                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                <span className="truncate max-w-[100px] sm:max-w-none">{savedJob.location || 'Lokasi tidak tersedia'}</span>
                                                            </p>
                                                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                                                <span className="whitespace-nowrap">Disimpan {new Date(savedJob.created_at || '').toLocaleDateString('id-ID')}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
                                                            <Badge variant="secondary" className="text-xs">{getEmploymentTypeText(savedJob.employment_type || '')}</Badge>
                                                            <Link
                                                                href={`/jobs/${savedJob.slug || savedJob.id || '#'}`}
                                                                className="flex items-center gap-1 whitespace-nowrap text-xs text-blue-600 hover:text-blue-700"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                Lihat
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="border-t pt-4">
                                                    <Link href="/user/saved-jobs">
                                                        <Button variant="outline" className="w-full text-sm">
                                                            Lihat Semua
                                                            <ExternalLink className="ml-2 h-4 w-4 sm:ml-3" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center">
                                                <BookmarkCheck className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                                <p className="mb-4 text-gray-500">Belum ada pekerjaan yang disimpan</p>
                                                <Link href="/jobs">
                                                    <Button>
                                                        Cari Pekerjaan
                                                        <ExternalLink className="ml-3 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                        <br />
                        {/* Job Invitations */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <Card className="border-0 shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-purple-600" />
                                            Job Invitation
                                        </CardTitle>
                                        <CardDescription>Undangan kerja yang dikirim langsung oleh perusahaan</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('user.job-invitations.index')}>
                                            Lihat semua
                                            <ExternalLink className="ml-3 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {jobInvitations && jobInvitations.length > 0 ? (
                                        <div className="space-y-4">
                                            {jobInvitations.map((invitation) => (
                                                <div key={invitation.id} className="overflow-hidden rounded-lg border border-gray-100 p-3 sm:p-4">
                                                    <div className="flex flex-col gap-3 sm:gap-4">
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="min-w-0 flex-1 space-y-2">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h3 className="break-words text-sm font-semibold text-gray-900 sm:text-base">
                                                                        {invitation.company?.name || 'Perusahaan'}
                                                                    </h3>
                                                                    <Badge variant={getInvitationBadgeVariant(invitation.status)} className="text-xs capitalize">
                                                                        {getInvitationStatusText(invitation.status)}
                                                                    </Badge>
                                                                </div>
                                                                {invitation.jobListing?.title && (
                                                                    <p className="break-words text-xs text-gray-600 sm:text-sm">{invitation.jobListing.title}</p>
                                                                )}
                                                                <div className="space-y-1 text-xs text-gray-400">
                                                                    <p className="whitespace-nowrap">
                                                                        Dikirim pada {new Date(invitation.created_at).toLocaleDateString('id-ID')}
                                                                    </p>
                                                                    {invitation.responded_at && (
                                                                        <p className="whitespace-nowrap">
                                                                            Direspon pada {new Date(invitation.responded_at).toLocaleDateString('id-ID')}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            {invitation.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-600 text-xs text-white hover:bg-green-700 sm:text-sm"
                                                                        disabled={isResponding}
                                                                        onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                                                                    >
                                                                        Terima
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-red-600 text-xs text-red-600 hover:bg-red-600 hover:text-white sm:text-sm"
                                                                        disabled={isResponding}
                                                                        onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                                                                    >
                                                                        Tolak
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {invitation.status === 'accepted' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        disabled
                                                                        className="cursor-not-allowed bg-gray-300 text-xs text-gray-500 sm:text-sm"
                                                                    >
                                                                        Terima
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled
                                                                        className="cursor-not-allowed border-gray-300 text-xs text-gray-400 sm:text-sm"
                                                                    >
                                                                        Tolak
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {invitation.status === 'declined' && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        disabled
                                                                        className="cursor-not-allowed bg-gray-300 text-xs text-gray-500 sm:text-sm"
                                                                    >
                                                                        Terima
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled
                                                                        className="cursor-not-allowed border-gray-300 text-xs text-gray-400 sm:text-sm"
                                                                    >
                                                                        Tolak
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {invitation.jobListing?.slug && (
                                                                <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
                                                                    <Link href={`/jobs/${invitation.jobListing.slug}`}>Lihat Lowongan</Link>
                                                                </Button>
                                                            )}

                                                            {/* Chat button - only active when invitation is accepted */}
                                                            {invitation.status === 'accepted' && (
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="bg-blue-50 text-xs text-blue-600 hover:bg-blue-100 sm:text-sm"
                                                                >
                                                                    <Link href={route('user.job-invitations.messages.index', invitation.id)}>
                                                                        <MessageCircle className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                        Chat
                                                                    </Link>
                                                                </Button>
                                                            )}

                                                            {/* Disabled Chat button when declined */}
                                                            {invitation.status === 'declined' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled
                                                                    className="cursor-not-allowed bg-gray-100 text-xs text-gray-400 sm:text-sm"
                                                                >
                                                                    <MessageCircle className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                    Chat
                                                                </Button>
                                                            )}

                                                            {/* Disabled Chat button when pending */}
                                                            {invitation.status === 'pending' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled
                                                                    className="cursor-not-allowed bg-gray-100 text-xs text-gray-400 sm:text-sm"
                                                                >
                                                                    <MessageCircle className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                    Chat
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {invitation.message && (
                                                        <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                                                            {invitation.message}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center">
                                            <Users className="mb-3 h-10 w-10 text-gray-300" />
                                            <p className="text-gray-500">Belum ada undangan kerja yang masuk.</p>
                                            <Link href="/jobs" className="mt-4">
                                                <Button>
                                                    Cari Pekerjaan
                                                    <ExternalLink className="ml-3 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8">
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle>Aksi Cepat</CardTitle>
                                    <CardDescription>Kelola profil dan pengaturan akun Anda</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <Link href="/user/profile">
                                            <Button variant="outline" className="h-auto w-full justify-start p-4">
                                                <User className="mr-3 h-5 w-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Edit Profil</div>
                                                    <div className="text-xs text-gray-500">Perbarui informasi personal</div>
                                                </div>
                                            </Button>
                                        </Link>

                                        <Link href="/jobs">
                                            <Button variant="outline" className="h-auto w-full justify-start p-4">
                                                <Briefcase className="mr-3 h-5 w-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Cari Pekerjaan</div>
                                                    <div className="text-xs text-gray-500">Temukan lowongan terbaru</div>
                                                </div>
                                            </Button>
                                        </Link>

                                        <Link href="/companies">
                                            <Button variant="outline" className="h-auto w-full justify-start p-4">
                                                <Users className="mr-3 h-5 w-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Jelajahi Perusahaan</div>
                                                    <div className="text-xs text-gray-500">Lihat profil perusahaan</div>
                                                </div>
                                            </Button>
                                        </Link>

                                        <Link href="/user/success-stories">
                                            <Button variant="outline" className="h-auto w-full justify-start p-4">
                                                <Star className="mr-3 h-5 w-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Bagikan Kisah Sukses</div>
                                                    <div className="text-xs text-gray-500">Inspirasi orang lain</div>
                                                </div>
                                            </Button>
                                        </Link>

                                        <Link href="/user/notifications">
                                            <Button variant="outline" className="h-auto w-full justify-start p-4">
                                                <Bell className="mr-3 h-5 w-5" />
                                                <div className="text-left">
                                                    <div className="font-semibold">Notifikasi</div>
                                                    <div className="text-xs text-gray-500">Lihat pesan terbaru</div>
                                                </div>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </main>

            </MainLayout>
    );
}