import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { Company, CompanyFilters, PaginatedResponse } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Building2, CheckCircle, Edit, Eye, Plus, Search, Trash2, Users, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExtendedCompany extends Company {
    job_listings_count: number;
    users_count: number;
}

interface Props {
    companies: PaginatedResponse<ExtendedCompany>;
    filters: CompanyFilters;
}

export default function CompaniesIndex({ companies, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [verified, setVerified] = useState(filters.verification_status || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(companies.per_page.toString());

    const handleSearch = () => {
        router.get('/admin/companies', {
            search: search || undefined,
            verification_status: verified === 'all' ? undefined : verified,
            status: status === 'all' ? undefined : status,
            per_page: perPage !== '10' ? perPage : undefined,
        });
    };

    const handlePerPageChange = (newPerPage: string) => {
        setPerPage(newPerPage);
        router.get('/admin/companies', {
            search: search || undefined,
            verification_status: verified === 'all' ? undefined : verified,
            status: status === 'all' ? undefined : status,
            per_page: newPerPage !== '10' ? newPerPage : undefined,
        });
    };

    const navigateToPage = (pageNumber: number) => {
        // Validate page number
        if (pageNumber < 1 || pageNumber > companies.last_page) {
            return;
        }
        
        // Don't navigate if already on the requested page
        if (pageNumber === companies.current_page) {
            return;
        }
        
        const params: Record<string, any> = {};
        
        // Add filters if they exist
        if (filters.search) params.search = filters.search;
        if (filters.verification_status) params.verification_status = filters.verification_status;
        if (filters.status) params.status = filters.status;
        
        // Add per_page if not default
        if (perPage && perPage !== '10') {
            params.per_page = perPage;
        }
        
        // Add page if not first page
        if (pageNumber > 1) {
            params.page = pageNumber;
        }
        
        router.get('/admin/companies', params);
    };

    const clearFilters = () => {
        setSearch('');
        setVerified('all');
        setStatus('all');
        setPerPage('10');
        router.get('/admin/companies');
    };

    const toggleVerification = (company: ExtendedCompany) => {
        router.post(
            `/admin/companies/${company.id}/toggle-verification`,
            {},
            {
                onSuccess: () => {
                    toast.success(company.is_verified ? 'Verifikasi perusahaan berhasil dibatalkan' : 'Perusahaan berhasil diverifikasi');
                },
                onError: () => {
                    toast.error('Gagal mengubah status verifikasi');
                },
            },
        );
    };

    const toggleStatus = (company: ExtendedCompany) => {
        router.post(
            `/admin/companies/${company.id}/toggle-status`,
            {},
            {
                onSuccess: () => {
                    toast.success(company.is_active ? 'Perusahaan berhasil dinonaktifkan' : 'Perusahaan berhasil diaktifkan');
                },
                onError: () => {
                    toast.error('Gagal mengubah status perusahaan');
                },
            },
        );
    };

    const deleteCompany = (company: ExtendedCompany) => {
        if (confirm(`Apakah Anda yakin ingin menghapus perusahaan "${company.name}"?`)) {
            router.delete(`/admin/companies/${company.id}`, {
                onSuccess: () => {
                    toast.success('Perusahaan berhasil dihapus');
                },
                onError: () => {
                    toast.error('Gagal menghapus perusahaan');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Perusahaan" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Perusahaan</h1>
                        <p className="text-gray-600">Kelola perusahaan di platform Anda</p>
                    </div>
                    <Button onClick={() => router.get('/admin/companies/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Perusahaan
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari perusahaan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <Select value={verified} onValueChange={setVerified}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status verifikasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Perusahaan</SelectItem>
                                    <SelectItem value="verified">Terverifikasi</SelectItem>
                                    <SelectItem value="unverified">Belum Diverifikasi</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
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

                {/* Companies List */}
                <div className="grid gap-4">
                    {companies.data.map((company) => (
                        <Card key={company.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h3 className="text-lg font-semibold">{company.name}</h3>
                                            <div className="flex gap-2">
                                                {company.is_verified ? (
                                                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Terverifikasi
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-gray-600">
                                                        Belum Diverifikasi
                                                    </Badge>
                                                )}

                                                {company.is_active ? (
                                                    <Badge variant="outline" className="border-green-600 text-green-600">
                                                        Aktif
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-red-600 text-red-600">
                                                        Tidak Aktif
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>{company.email}</p>
                                            <p>{company.address}</p>
                                            {company.industry && <p>Industri: {company.industry}</p>}
                                        </div>

                                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {company.users_count} pengguna
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-4 w-4" />
                                                {company.job_listings_count} lowongan
                                            </span>
                                            <span>Bergabung {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.get(`/admin/companies/${company.id}`)}
                                                title="Lihat Detail"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.get(`/admin/companies/${company.id}/edit`)}
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteCompany(company)}
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <Button
                                            size="sm"
                                            variant={company.is_verified ? 'outline' : 'default'}
                                            onClick={() => toggleVerification(company)}
                                        >
                                            {company.is_verified ? (
                                                <>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Batalkan Verifikasi
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Verifikasi
                                                </>
                                            )}
                                        </Button>

                                        <Button size="sm" variant="outline" onClick={() => toggleStatus(company)}>
                                            {company.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {companies.data.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium">Tidak ada perusahaan ditemukan</h3>
                            <p className="text-gray-600">
                                {Object.values(filters).some((f) => f)
                                    ? 'Coba sesuaikan filter Anda untuk melihat lebih banyak hasil.'
                                    : 'Belum ada perusahaan yang terdaftar.'}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {companies.total > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <p className="text-sm text-gray-600">
                                        Menampilkan {(companies.current_page - 1) * companies.per_page + 1} sampai{' '}
                                        {Math.min(companies.current_page * companies.per_page, companies.total)} dari {companies.total} perusahaan
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Tampilkan:</span>
                                        <Select value={perPage} onValueChange={handlePerPageChange}>
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="15">15</SelectItem>
                                                <SelectItem value="25">25</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-sm text-gray-600">per halaman</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    {/* Previous Page */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={companies.current_page <= 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToPage(companies.current_page - 1);
                                        }}
                                    >
                                        Sebelumnya
                                    </Button>

                                    {/* Page Numbers - Only show if more than 1 page */}
                                    {companies.last_page > 1 && (
                                    <div className="hidden items-center gap-1 sm:flex">
                                        {(() => {
                                            const currentPage = companies.current_page;
                                            const lastPage = companies.last_page;
                                            const pages = [];

                                            // Always show first page
                                            if (currentPage > 3) {
                                                pages.push(
                                                    <Button
                                                        key={1}
                                                        variant={currentPage === 1 ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigateToPage(1);
                                                        }}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        1
                                                    </Button>
                                                );

                                                if (currentPage > 4) {
                                                    pages.push(<span key="dots1" className="px-2 text-gray-500">...</span>);
                                                }
                                            }

                                            // Show pages around current page
                                            const startPage = Math.max(1, currentPage - 2);
                                            const endPage = Math.min(lastPage, currentPage + 2);

                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(
                                                    <Button
                                                        key={i}
                                                        variant={currentPage === i ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigateToPage(i);
                                                        }}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {i}
                                                    </Button>
                                                );
                                            }

                                            // Always show last page
                                            if (currentPage < lastPage - 2) {
                                                if (currentPage < lastPage - 3) {
                                                    pages.push(<span key="dots2" className="px-2 text-gray-500">...</span>);
                                                }

                                                pages.push(
                                                    <Button
                                                        key={lastPage}
                                                        variant={currentPage === lastPage ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigateToPage(lastPage);
                                                        }}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {lastPage}
                                                    </Button>
                                                );
                                            }

                                            return pages;
                                        })()}
                                    </div>
                                    )}

                                    {/* Mobile page indicator - Only show if more than 1 page */}
                                    {companies.last_page > 1 && (
                                    <span className="text-sm text-gray-600 sm:hidden">
                                        Hal {companies.current_page}/{companies.last_page}
                                    </span>
                                    )}

                                    {/* Next Page */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={companies.current_page >= companies.last_page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToPage(companies.current_page + 1);
                                        }}
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
