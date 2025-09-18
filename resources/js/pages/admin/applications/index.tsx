import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { ApplicationStatus, JobApplication, PaginatedResponse } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Building2, Calendar, Clock, Eye, FileText, MapPin, Search, User } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '@/components/applications-data-table';
import { toast } from 'sonner';

interface ExtendedJobApplication extends JobApplication {
    user?: {
        id: number;
        name?: string;
        email?: string;
        profile?: {
            first_name?: string;
            last_name?: string;
            phone?: string;
            location?: string;
        };
    };
    jobListing?: {
        id: number;
        title?: string;
        location?: string;
        company?: {
            id: number;
            name?: string;
        };
    };
    reviewer?: {
        id: number;
        name: string;
    };
}

interface Props {
    applications: PaginatedResponse<ExtendedJobApplication>;
    filters: {
        search?: string;
        status?: ApplicationStatus;
        company?: string;
    };
    userRole: string;
}

const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'reviewing':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'shortlisted':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'interview':
            return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'hired':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'rejected':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
        case 'pending':
            return 'Menunggu Peninjauan';
        case 'reviewing':
            return 'Sedang Ditinjau';
        case 'shortlisted':
            return 'Masuk Daftar Pendek';
        case 'interview':
            return 'Wawancara Terjadwal';
        case 'hired':
            return 'Diterima';
        case 'rejected':
            return 'Ditolak';
        default:
            return status;
    }
};

export default function ApplicationsIndex({ applications, filters, userRole }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [selectedApp, setSelectedApp] = useState<ExtendedJobApplication | null>(null);
    const [newStatus, setNewStatus] = useState<ApplicationStatus>('pending');
    const [adminNotes, setAdminNotes] = useState('');

    const handleSearch = () => {
        router.get('/admin/applications', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/admin/applications');
    };

    const updateApplicationStatus = (application: ExtendedJobApplication) => {
        router.patch(
            `/admin/applications/${application.id}/status`,
            {
                status: newStatus,
                admin_notes: adminNotes,
            },
            {
                onSuccess: () => {
                    toast.success('Status lamaran berhasil diperbarui!', {
                        description: `Status untuk ${application.user?.name || 'pelamar'} telah diubah menjadi ${getStatusLabel(newStatus)}`,
                        duration: 4000,
                    });
                    setSelectedApp(null);
                    setAdminNotes('');
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Update failed:', errors);
                    toast.error('Gagal memperbarui status lamaran', {
                        description: 'Silakan coba lagi beberapa saat.',
                        duration: 4000,
                    });
                },
            },
        );
    };

    const openStatusModal = (application: ExtendedJobApplication) => {
        setSelectedApp(application);
        setNewStatus(application.status);
        setAdminNotes(application.admin_notes || '');
    };

    return (
        <AppLayout>
            <Head title="Manajemen Lamaran Kerja" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Lamaran</h1>
                        <p className="text-gray-600">Tinjau dan kelola lamaran kerja</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Lamaran</p>
                                    <p className="text-2xl font-bold">{applications.total}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Menunggu Peninjauan</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {applications.data.filter((app) => app.status === 'pending').length}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Sedang Ditinjau</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {applications.data.filter((app) => app.status === 'reviewing').length}
                                    </p>
                                </div>
                                <Eye className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Diterima</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {applications.data.filter((app) => app.status === 'hired').length}
                                    </p>
                                </div>
                                <User className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari lamaran..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu Peninjauan</SelectItem>
                                    <SelectItem value="reviewing">Sedang Ditinjau</SelectItem>
                                    <SelectItem value="shortlisted">Masuk Daftar Pendek</SelectItem>
                                    <SelectItem value="interview">Wawancara</SelectItem>
                                    <SelectItem value="hired">Diterima</SelectItem>
                                    <SelectItem value="rejected">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} className="flex-1">
                                    <Search className="mr-2 h-4 w-4" />
                                    Cari
                                </Button>
                                <Button variant="outline" onClick={clearFilters}>
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Lamaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={applications.data}
                            onStatusUpdate={openStatusModal}
                        />
                    </CardContent>
                </Card>

                {/* Status Update Modal */}
                {selectedApp && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Perbarui Status Lamaran</CardTitle>
                                <p className="text-sm text-gray-600">
                                    {selectedApp.user?.name || 'Nama tidak tersedia'} - {selectedApp.jobListing?.title || 'Posisi tidak tersedia'}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ApplicationStatus)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Menunggu Peninjauan</SelectItem>
                                            <SelectItem value="reviewing">Sedang Ditinjau</SelectItem>
                                            <SelectItem value="shortlisted">Masuk Daftar Pendek</SelectItem>
                                            <SelectItem value="interview">Wawancara Terjadwal</SelectItem>
                                            <SelectItem value="hired">Diterima</SelectItem>
                                            <SelectItem value="rejected">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Catatan Admin</label>
                                    <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Tambahkan catatan tentang lamaran ini..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button onClick={() => updateApplicationStatus(selectedApp)} className="flex-1">
                                        Perbarui Status
                                    </Button>
                                    <Button variant="outline" onClick={() => setSelectedApp(null)}>
                                        Batal
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Pagination */}
                {applications.last_page > 1 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Menampilkan {(applications.current_page - 1) * applications.per_page + 1} sampai{' '}
                                    {Math.min(applications.current_page * applications.per_page, applications.total)} dari {applications.total}{' '}
                                    lamaran
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={applications.current_page === 1}
                                        onClick={() =>
                                            router.get('/admin/applications', {
                                                ...filters,
                                                page: applications.current_page - 1,
                                            })
                                        }
                                    >
                                        Sebelumnya
                                    </Button>

                                    <span className="text-sm text-gray-600">
                                        Halaman {applications.current_page} dari {applications.last_page}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={applications.current_page === applications.last_page}
                                        onClick={() =>
                                            router.get('/admin/applications', {
                                                ...filters,
                                                page: applications.current_page + 1,
                                            })
                                        }
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
