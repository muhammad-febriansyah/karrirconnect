import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Eye, Folder, Plus, Search, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface JobCategory {
    id: number;
    name: string;
    description?: string;
    slug: string;
    icon?: string;
    is_active: boolean;
    created_at: string;
    job_listings_count: number;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: JobCategory[];
}

interface Filters {
    search?: string;
    status?: string;
}

interface Props {
    categories: PaginationData;
    filters: Filters;
}

export default function JobCategoriesIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(categories.per_page.toString());

    const handleSearch = () => {
        router.get('/admin/job-categories', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
            per_page: perPage !== '10' ? perPage : undefined,
        });
    };

    const handlePerPageChange = (newPerPage: string) => {
        setPerPage(newPerPage);
        router.get('/admin/job-categories', {
            search: search || undefined,
            status: status === 'all' ? undefined : status,
            per_page: newPerPage !== '10' ? newPerPage : undefined,
        });
    };

    const navigateToPage = (pageNumber: number) => {
        // Validate page number
        if (pageNumber < 1 || pageNumber > categories.last_page) {
            return;
        }

        // Don't navigate if already on the requested page
        if (pageNumber === categories.current_page) {
            return;
        }

        const params: Record<string, any> = {};

        // Add filters if they exist
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;

        // Add per_page if not default
        if (perPage && perPage !== '10') {
            params.per_page = perPage;
        }

        // Add page if not first page
        if (pageNumber > 1) {
            params.page = pageNumber;
        }

        router.get('/admin/job-categories', params);
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        setPerPage('10');
        router.get('/admin/job-categories');
    };

    const toggleStatus = (category: JobCategory) => {
        router.post(
            `/admin/job-categories/${category.id}/toggle-status`,
            {},
            {
                onSuccess: () => {
                    router.reload();
                },
            },
        );
    };

    const deleteCategory = (category: JobCategory) => {
        if (category.job_listings_count > 0) {
            alert(`Tidak dapat menghapus kategori \"${category.name}\" karena memiliki ${category.job_listings_count} lowongan kerja terkait.`);
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus kategori \"${category.name}\"?`)) {
            router.delete(`/admin/job-categories/${category.id}`, {
                onSuccess: () => {
                    toast.success('Kategori pekerjaan berhasil dihapus.', {
                        position: 'top-right',
                    });
                    router.reload();
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Kategori Pekerjaan" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Kategori Pekerjaan</h1>
                        <p className="text-gray-600">Kelola kategori pekerjaan dan industri</p>
                    </div>
                    <Button onClick={() => router.visit('/admin/job-categories/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kategori
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Kategori</p>
                                    <p className="text-2xl font-bold">{categories.total}</p>
                                </div>
                                <Folder className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Kategori Aktif</p>
                                    <p className="text-2xl font-bold text-green-600">{categories.data.filter((c) => c.is_active).length}</p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                    <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Lowongan</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {categories.data.reduce((sum, cat) => sum + cat.job_listings_count, 0)}
                                    </p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <Folder className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Terpopuler</p>
                                    <p className="text-lg font-bold text-purple-600">
                                        {(categories.data.length > 0 &&
                                            categories.data.reduce((max, cat) =>
                                                cat.job_listings_count > (max?.job_listings_count || 0) ? cat : max,
                                            )?.name) ||
                                            'Tidak ada'}
                                    </p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                    <Folder className="h-4 w-4 text-purple-600" />
                                </div>
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
                                    placeholder="Cari kategori..."
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

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories.data.map((category) => (
                        <Card key={category.id} className="transition-shadow hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                {category.icon && (
                                                    <img
                                                        src={`/storage/${category.icon}`}
                                                        alt={`${category.name} icon`}
                                                        className="h-20 w-20 object-contain"
                                                    />
                                                )}

                                                <h3 className="text-lg font-semibold">{category.name}</h3>
                                            </div>

                                            {category.description && (
                                                <p className="mb-3 line-clamp-2 text-sm text-gray-600">{category.description}</p>
                                            )}

                                            <div className="mb-3 flex items-center gap-2">
                                                {category.is_active ? (
                                                    <Badge variant="outline" className="border-green-600 text-green-600">
                                                        Aktif
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-red-600 text-red-600">
                                                        Tidak Aktif
                                                    </Badge>
                                                )}

                                                <Badge variant="secondary">{category.job_listings_count} lowongan</Badge>
                                            </div>

                                            <p className="text-xs text-gray-500">
                                                Dibuat {formatDistanceToNow(new Date(category.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.visit(`/admin/job-categories/${category.id}`)}
                                            className="flex-1"
                                        >
                                            <Eye className="mr-1 h-4 w-4" />
                                            Lihat
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.visit(`/admin/job-categories/${category.id}/edit`)}
                                            className="flex-1"
                                        >
                                            <Edit className="mr-1 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => toggleStatus(category)} className="flex-1">
                                            {category.is_active ? (
                                                <>
                                                    <ToggleRight className="mr-1 h-4 w-4 text-green-600" />
                                                    Nonaktifkan
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft className="mr-1 h-4 w-4 text-gray-600" />
                                                    Aktifkan
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => deleteCategory(category)}
                                            disabled={category.job_listings_count > 0}
                                            className="flex-1"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {categories.data.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Folder className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium">Tidak ada kategori ditemukan</h3>
                            <p className="mb-4 text-gray-600">
                                {Object.values(filters).some((f) => f)
                                    ? 'Coba sesuaikan filter Anda untuk melihat lebih banyak hasil.'
                                    : 'Belum ada kategori pekerjaan yang dibuat.'}
                            </p>
                            <Button onClick={() => router.visit('/admin/job-categories/create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Buat Kategori Pertama
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {categories.total > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <p className="text-sm text-gray-600">
                                        Menampilkan {(categories.current_page - 1) * categories.per_page + 1} sampai{' '}
                                        {Math.min(categories.current_page * categories.per_page, categories.total)} dari {categories.total} kategori
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
                                        disabled={categories.current_page <= 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToPage(categories.current_page - 1);
                                        }}
                                    >
                                        Sebelumnya
                                    </Button>

                                    {/* Page Numbers - Only show if more than 1 page */}
                                    {categories.last_page > 1 && (
                                        <div className="hidden items-center gap-1 sm:flex">
                                            {(() => {
                                                const currentPage = categories.current_page;
                                                const lastPage = categories.last_page;
                                                const pages = [];

                                                // Always show first page
                                                if (currentPage > 3) {
                                                    pages.push(
                                                        <Button
                                                            key={1}
                                                            variant={currentPage === 1 ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                navigateToPage(1);
                                                            }}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            1
                                                        </Button>,
                                                    );

                                                    if (currentPage > 4) {
                                                        pages.push(
                                                            <span key="dots1" className="px-2 text-gray-500">
                                                                ...
                                                            </span>,
                                                        );
                                                    }
                                                }

                                                // Show pages around current page
                                                const startPage = Math.max(1, currentPage - 2);
                                                const endPage = Math.min(lastPage, currentPage + 2);

                                                for (let i = startPage; i <= endPage; i++) {
                                                    pages.push(
                                                        <Button
                                                            key={i}
                                                            variant={currentPage === i ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                navigateToPage(i);
                                                            }}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {i}
                                                        </Button>,
                                                    );
                                                }

                                                // Always show last page
                                                if (currentPage < lastPage - 2) {
                                                    if (currentPage < lastPage - 3) {
                                                        pages.push(
                                                            <span key="dots2" className="px-2 text-gray-500">
                                                                ...
                                                            </span>,
                                                        );
                                                    }

                                                    pages.push(
                                                        <Button
                                                            key={lastPage}
                                                            variant={currentPage === lastPage ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                navigateToPage(lastPage);
                                                            }}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {lastPage}
                                                        </Button>,
                                                    );
                                                }

                                                return pages;
                                            })()}
                                        </div>
                                    )}

                                    {/* Mobile page indicator - Only show if more than 1 page */}
                                    {categories.last_page > 1 && (
                                        <span className="text-sm text-gray-600 sm:hidden">
                                            Hal {categories.current_page}/{categories.last_page}
                                        </span>
                                    )}

                                    {/* Next Page */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={categories.current_page >= categories.last_page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToPage(categories.current_page + 1);
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
