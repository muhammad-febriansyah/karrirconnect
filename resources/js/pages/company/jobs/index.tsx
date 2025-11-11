import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Briefcase,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coins,
    Edit,
    Eye,
    FileText,
    MapPin,
    Pause,
    Play,
    Plus,
    Search,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface JobListing {
    id: number;
    title: string;
    description: string;
    employment_type: string;
    work_arrangement: string;
    experience_level: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    salary_negotiable: boolean;
    status: 'draft' | 'published' | 'closed' | 'paused';
    featured: boolean;
    views_count: number;
    applications_count: number;
    positions_available: number;
    application_deadline?: string;
    created_at: string;
    category: {
        id: number;
        name: string;
    };
}

interface Company {
    id: number;
    name: string;
    job_posting_points: number;
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
    is_verified: boolean;
    can_post_job: boolean;
}

interface Stats {
    total_jobs: number;
    active_jobs: number;
    draft_jobs: number;
    total_applications: number;
    current_points: number;
}

interface JobCategory {
    id: number;
    name: string;
}

interface Props {
    jobs: {
        data: JobListing[];
        links: any[];
        meta: any;
    };
    stats: Stats;
    company: Company;
    filters: {
        search?: string;
        status?: string;
        category?: string;
        employment_type?: string;
        per_page?: number;
    };
    filterOptions: {
        categories: JobCategory[];
        employment_types: Record<string, string>;
        statuses: Record<string, string>;
    };
}

export default function CompanyJobsIndex({ jobs, stats, company, filters, filterOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [category, setCategory] = useState(filters.category || 'all');
    const [employmentType, setEmploymentType] = useState(filters.employment_type || 'all');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [isLoading, setIsLoading] = useState(false);

    const toggleStatus = (job: JobListing) => {
        router.post(
            `/company/jobs/${job.id}/toggle-status`,
            {},
            {
                onSuccess: () => {
                    const newStatus = job.status === 'published' ? 'dijeda' : 'diaktifkan';
                    toast.success(`Lowongan berhasil ${newStatus}!`);
                },
                onError: () => {
                    toast.error('Gagal mengubah status lowongan. Silakan coba lagi.');
                },
            },
        );
    };

    const deleteJob = (job: JobListing) => {
        toast('Konfirmasi Hapus', {
            description: `Apakah Anda yakin ingin menghapus lowongan "${job.title}"?`,
            action: {
                label: 'Hapus',
                onClick: () => {
                    router.delete(`/company/jobs/${job.id}`, {
                        onSuccess: () => {
                            toast.success('Lowongan berhasil dihapus!');
                        },
                        onError: () => {
                            toast.error('Gagal menghapus lowongan. Silakan coba lagi.');
                        },
                    });
                },
            },
            cancel: {
                label: 'Batal',
                onClick: () => {
                    toast.dismiss();
                },
            },
        });
    };

    const handleSearch = () => {
        setIsLoading(true);
        router.get(
            route('company.jobs.index'),
            {
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                category: category !== 'all' ? category : undefined,
                employment_type: employmentType !== 'all' ? employmentType : undefined,
                per_page: perPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setCategory('all');
        setEmploymentType('all');
        setPerPage(10);
        router.get(route('company.jobs.index'));
    };

    // Auto-search with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                search !== filters.search ||
                status !== filters.status ||
                category !== filters.category ||
                employmentType !== filters.employment_type ||
                perPage !== filters.per_page
            ) {
                handleSearch();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [search, status, category, employmentType, perPage]);

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'bg-gray-100 text-gray-800',
            published: 'bg-green-100 text-green-800',
            paused: 'bg-yellow-100 text-yellow-800',
            closed: 'bg-red-100 text-red-800',
        };

        const labels = {
            draft: 'Draft',
            published: 'Aktif',
            paused: 'Dijeda',
            closed: 'Ditutup',
        };

        return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
    };

    const formatSalary = (min?: number, max?: number, negotiable?: boolean) => {
        if (negotiable) return 'Dapat dinegosiasi';
        if (!min && !max) return 'Tidak ditentukan';
        if (min && max) return `Rp ${min.toLocaleString('id-ID')} - ${max.toLocaleString('id-ID')}`;
        if (min) return `Mulai dari Rp ${min.toLocaleString('id-ID')}`;
        return `Hingga Rp ${max?.toLocaleString('id-ID')}`;
    };

    return (
        <AppLayout>
            <Head title="Kelola Lowongan" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-gray-900">Kelola Lowongan</h1>
                            <p className="text-gray-600">Kelola semua lowongan pekerjaan perusahaan Anda</p>
                        </div>
                        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto">
                            <Link href="/company/points/packages" className="w-full sm:w-auto">
                                <Button variant="outline" className="flex w-full items-center justify-center gap-2">
                                    <Coins className="h-4 w-4" />
                                    {company.job_posting_points} Poin
                                </Button>
                            </Link>
                            {company.can_post_job ? (
                                <Link href="/company/jobs/create" className="w-full sm:w-auto">
                                    <Button className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
                                        <Plus className="h-4 w-4" />
                                        Posting Lowongan Baru
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    disabled
                                    className="flex w-full cursor-not-allowed items-center justify-center gap-2 bg-gray-400 sm:w-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    Posting Lowongan Baru
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Lowongan</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        <NumberTicker value={stats.total_jobs} className="text-2xl font-bold text-blue-700" />
                                    </p>
                                </div>
                                <Briefcase className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Lowongan Aktif</p>
                                    <p className="text-2xl font-bold text-green-700">
                                        <NumberTicker value={stats.active_jobs} className="text-2xl font-bold text-green-700" />
                                    </p>
                                </div>
                                <Play className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Draft</p>
                                    <p className="text-2xl font-bold text-yellow-700">
                                        <NumberTicker value={stats.draft_jobs} className="text-2xl font-bold text-yellow-700" />
                                    </p>
                                </div>
                                <FileText className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Total Pelamar</p>
                                    <p className="text-2xl font-bold text-purple-700">
                                        <NumberTicker value={stats.total_applications} className="text-2xl font-bold text-purple-700" />
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600">Poin Tersisa</p>
                                    <p className="text-2xl font-bold text-orange-700">
                                        <NumberTicker value={stats.current_points} className="text-2xl font-bold text-orange-700" />
                                    </p>
                                </div>
                                <Coins className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Verification Status Warning */}
                {!company.is_verified && (
                    <Card
                        className={`border-2 ${
                            company.verification_status === 'rejected'
                                ? 'border-red-200 bg-red-50'
                                : company.verification_status === 'pending'
                                  ? 'border-yellow-200 bg-yellow-50'
                                  : 'border-blue-200 bg-blue-50'
                        }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <div
                                    className={`rounded-full p-2 ${
                                        company.verification_status === 'rejected'
                                            ? 'bg-red-100'
                                            : company.verification_status === 'pending'
                                              ? 'bg-yellow-100'
                                              : 'bg-blue-100'
                                    } flex-shrink-0`}
                                >
                                    {company.verification_status === 'rejected' ? (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    ) : company.verification_status === 'pending' ? (
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    {company.verification_status === 'rejected' ? (
                                        <>
                                            <h4 className="font-medium text-red-800">Verifikasi Ditolak</h4>
                                            <p className="text-sm text-red-700">
                                                Verifikasi perusahaan Anda telah ditolak. Silakan hubungi admin untuk informasi lebih lanjut dan
                                                perbaiki dokumen verifikasi Anda.
                                            </p>
                                        </>
                                    ) : company.verification_status === 'pending' ? (
                                        <>
                                            <h4 className="font-medium text-yellow-800">Menunggu Verifikasi</h4>
                                            <p className="text-sm text-yellow-700">
                                                Perusahaan Anda sedang dalam proses verifikasi. Anda belum bisa memposting lowongan hingga verifikasi
                                                selesai.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="font-medium text-blue-800">Belum Diverifikasi</h4>
                                            <p className="text-sm text-blue-700">
                                                Perusahaan Anda belum melakukan proses verifikasi. Lengkapi proses verifikasi untuk dapat memposting
                                                lowongan.
                                            </p>
                                        </>
                                    )}
                                </div>
                                {company.verification_status !== 'pending' && (
                                    <Link href="/company/profile" className="w-full sm:w-auto">
                                        <Button
                                            size="sm"
                                            className={`w-full ${
                                                company.verification_status === 'rejected'
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            {company.verification_status === 'rejected' ? 'Perbaiki Verifikasi' : 'Verifikasi Sekarang'}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Point Warning */}
                {company.is_verified && company.job_posting_points <= 2 && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="rounded-full bg-amber-100 p-2 flex-shrink-0">
                                    <Coins className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-amber-800">Poin Hampir Habis!</h4>
                                    <p className="text-sm text-amber-700">
                                        Anda hanya memiliki {company.job_posting_points} poin tersisa. Beli paket poin untuk terus posting lowongan.
                                    </p>
                                </div>
                                <Link href="/company/points/packages" className="w-full sm:w-auto">
                                    <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                                        Beli Poin
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Success message for verified companies */}
                {company.is_verified && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-green-800">Perusahaan Terverifikasi</h4>
                                    <p className="text-sm text-green-700">
                                        Selamat! Perusahaan Anda sudah terverifikasi dan dapat memposting lowongan pekerjaan.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center space-x-2">
                                <Search className="h-5 w-5 text-gray-500" />
                                <CardTitle className="text-lg">Cari & Filter Lowongan</CardTitle>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleReset} className="w-full lg:w-auto">
                                Reset
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            {/* Search Input */}
                            <div className="xl:col-span-2">
                                <Input
                                    placeholder="Cari berdasarkan judul, deskripsi, lokasi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        {Object.entries(filterOptions.statuses).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {filterOptions.categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Employment Type Filter */}
                            <div>
                                <Select value={employmentType} onValueChange={setEmploymentType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipe Kerja" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Tipe</SelectItem>
                                        {Object.entries(filterOptions.employment_types).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-1 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-2">
                                <span>
                                    Menampilkan {jobs.meta?.from || 0} - {jobs.meta?.to || 0} dari {jobs.meta?.total || 0} lowongan
                                </span>
                                {isLoading && <span className="text-blue-600">Memuat...</span>}
                            </div>
                            <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
                                <span className="text-sm text-gray-600">Per halaman:</span>
                                <Select value={perPage.toString()} onValueChange={(value) => setPerPage(parseInt(value))}>
                                    <SelectTrigger className="w-full sm:w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Jobs List */}
                <div className="space-y-4">
                    {jobs.data.map((job) => (
                        <Card key={job.id} className="border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-md">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1 space-y-3 overflow-hidden">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 overflow-hidden">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <h3 className="break-words text-lg font-semibold text-gray-900">{job.title}</h3>
                                                    {job.featured && (
                                                        <Badge className="border-yellow-300 bg-yellow-100 text-yellow-800">Featured</Badge>
                                                    )}
                                                    {getStatusBadge(job.status)}
                                                </div>
                                                <p
                                                    className="mb-3 line-clamp-2 break-words text-sm text-gray-600"
                                                    dangerouslySetInnerHTML={{
                                                        __html: job?.description
                                                            ? job.description.length > 150
                                                                ? job.description.substring(0, 150) + '...'
                                                                : job.description
                                                            : '',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Briefcase className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{job.employment_type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="h-4 w-4 flex-shrink-0" />
                                                <span className="whitespace-nowrap">{job.applications_count} pelamar</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Eye className="h-4 w-4 flex-shrink-0" />
                                                <span className="whitespace-nowrap">{job.views_count} dilihat</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center text-xs font-semibold text-gray-600">
                                                    Rp
                                                </span>
                                                <span className="break-words">{formatSalary(job.salary_min, job.salary_max, job.salary_negotiable)}</span>
                                            </div>
                                            {job.application_deadline && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Deadline: {new Date(job.application_deadline).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex w-full flex-wrap gap-2 lg:ml-4 lg:w-auto lg:flex-nowrap">
                                        <Link href={`/company/jobs/${job.id}`} className="w-full sm:w-auto">
                                            <Button size="sm" variant="outline" className="flex w-full items-center justify-center gap-1 sm:w-auto">
                                                <Eye className="h-4 w-4" />
                                                <span className="hidden sm:inline">Lihat</span>
                                            </Button>
                                        </Link>

                                        <Link href={`/company/jobs/${job.id}/edit`} className="w-full sm:w-auto">
                                            <Button size="sm" variant="outline" className="flex w-full items-center justify-center gap-1 sm:w-auto">
                                                <Edit className="h-4 w-4" />
                                                <span className="hidden sm:inline">Edit</span>
                                            </Button>
                                        </Link>

                                        {job.status !== 'closed' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleStatus(job)}
                                                className="flex w-full items-center justify-center gap-1 sm:w-auto"
                                            >
                                                {job.status === 'published' ? (
                                                    <>
                                                        <Pause className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Jeda</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Aktifkan</span>
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => deleteJob(job)}
                                            className="flex w-full items-center justify-center gap-1 sm:w-auto"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {jobs.data.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Briefcase className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium">Belum ada lowongan</h3>
                            <p className="mb-4 text-gray-600">
                                {company.is_verified
                                    ? 'Mulai dengan membuat lowongan pekerjaan pertama untuk perusahaan Anda.'
                                    : 'Lengkapi verifikasi perusahaan terlebih dahulu untuk dapat memposting lowongan.'}
                            </p>
                            {company.can_post_job ? (
                                <Link href="/company/jobs/create">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Posting Lowongan Pertama
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/company/profile">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Lengkapi Verifikasi
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {jobs.meta && jobs.meta.last_page > 1 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-1 text-center text-sm text-gray-600 sm:text-left">
                                    <span>
                                        Halaman {jobs.meta.current_page} dari {jobs.meta.last_page}
                                    </span>
                                    <span>•</span>
                                    <span>Total {jobs.meta.total} lowongan</span>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                                    {/* Previous Button */}
                                    {jobs.links.find((link) => link.label.includes('Previous'))?.url ? (
                                        <Link
                                            href={jobs.links.find((link) => link.label.includes('Previous'))?.url || '#'}
                                            className="flex items-center gap-1 rounded-md border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Link>
                                    ) : (
                                        <div className="flex cursor-not-allowed items-center gap-1 rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-400">
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </div>
                                    )}

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {jobs.links
                                            .filter((link) => link.label !== 'Previous' && link.label !== 'Next' && !link.label.includes('&'))
                                            .map((link, index) => {
                                                const label = link.label.replace(/<[^>]*>/g, '');
                                                if (label === '...') {
                                                    return (
                                                        <span key={index} className="px-2 py-1 text-sm text-gray-500">
                                                            ...
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`min-w-[2.5rem] rounded-md px-3 py-2 text-center text-sm ${
                                                            link.active ? 'bg-blue-600 text-white' : 'border bg-white text-gray-700 hover:bg-gray-50'
                                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    >
                                                        {label}
                                                    </Link>
                                                );
                                            })}
                                    </div>

                                    {/* Next Button */}
                                    {jobs.links.find((link) => link.label.includes('Next'))?.url ? (
                                        <Link
                                            href={jobs.links.find((link) => link.label.includes('Next'))?.url || '#'}
                                            className="flex items-center gap-1 rounded-md border bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <div className="flex cursor-not-allowed items-center gap-1 rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-400">
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
