import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedResponse, User, UserFilters, UserRole } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Eye, Mail, MapPin, Phone, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    users: PaginatedResponse<User>;
    filters: UserFilters;
    roles: UserRole[];
}

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case 'super_admin':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'company_admin':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'user':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getRoleLabel = (role: UserRole) => {
    switch (role) {
        case 'super_admin':
            return 'Super Admin';
        case 'company_admin':
            return 'Admin Perusahaan';
        case 'user':
            return 'Pengguna';
        default:
            return role;
    }
};

export default function UsersIndex({ users, filters, roles }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [perPage, setPerPage] = useState(users.per_page.toString());

    const handleSearch = () => {
        router.get('/admin/users', {
            search: search || undefined,
            role: role === 'all' ? undefined : role,
            status: status === 'all' ? undefined : status,
            per_page: perPage !== '10' ? perPage : undefined,
        });
    };

    const handlePerPageChange = (newPerPage: string) => {
        setPerPage(newPerPage);
        router.get('/admin/users', {
            search: search || undefined,
            role: role === 'all' ? undefined : role,
            status: status === 'all' ? undefined : status,
            per_page: newPerPage !== '10' ? newPerPage : undefined,
        });
    };

    const navigateToPage = (pageNumber: number) => {
        // Validate page number
        if (pageNumber < 1 || pageNumber > users.last_page) {
            return;
        }
        
        // Don't navigate if already on the requested page
        if (pageNumber === users.current_page) {
            return;
        }
        
        const params: Record<string, any> = {};
        
        // Add filters if they exist
        if (filters.search) params.search = filters.search;
        if (filters.role) params.role = filters.role;
        if (filters.status) params.status = filters.status;
        if (filters.company) params.company = filters.company;
        
        // Add per_page if not default
        if (perPage && perPage !== '10') {
            params.per_page = perPage;
        }
        
        // Add page if not first page
        if (pageNumber > 1) {
            params.page = pageNumber;
        }
        
        router.get('/admin/users', params);
    };

    const clearFilters = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        setPerPage('10');
        router.get('/admin/users');
    };

    const toggleUserStatus = (user: User) => {
        router.post(
            `/admin/users/${user.id}/toggle-status`,
            {},
            {
                onSuccess: () => {
                    router.reload();
                },
            },
        );
    };

    const deleteUser = (user: User) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`)) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    toast.success('Pengguna Berhasil Dihapus!', {
                        description: `Pengguna ${user.name} telah berhasil dihapus dari sistem.`,
                        duration: 4000,
                    });
                },
                onError: () => {
                    toast.error('Gagal Menghapus Pengguna', {
                        description: 'Terjadi kesalahan saat menghapus pengguna. Silakan coba lagi.',
                        duration: 4000,
                    });
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Manajemen Pengguna" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
                        <p className="text-gray-600">Kelola semua pengguna di platform Anda</p>
                    </div>
                    <Button onClick={() => router.visit('/admin/users/create')}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Tambah Pengguna
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Pengguna</p>
                                    <p className="text-2xl font-bold">{users.total}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pengguna Aktif</p>
                                    <p className="text-2xl font-bold text-green-600">{users.data.filter((u) => u.is_active).length}</p>
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
                                    <p className="text-sm text-gray-600">Admin</p>
                                    <p className="text-2xl font-bold text-purple-600">{users.data.filter((u) => u.role.includes('admin')).length}</p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                    <Users className="h-4 w-4 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pencari Kerja</p>
                                    <p className="text-2xl font-bold text-blue-600">{users.data.filter((u) => u.role === 'user').length}</p>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <Users className="h-4 w-4 text-blue-600" />
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
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari pengguna..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Peran</SelectItem>
                                    {roles.map((roleOption) => (
                                        <SelectItem key={roleOption} value={roleOption}>
                                            {getRoleLabel(roleOption)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

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

                {/* Users List */}
                <div className="grid gap-4">
                    {users.data.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-3">
                                            <h3 className="text-lg font-semibold">{user.name}</h3>
                                            <Badge variant="outline" className={getRoleColor(user.role)}>
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                            {user.is_active ? (
                                                <Badge variant="outline" className="border-green-600 text-green-600">
                                                    Aktif
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-red-600 text-red-600">
                                                    Tidak Aktif
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="mb-3 space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                <span>{user.email}</span>
                                            </div>

                                            {user.profile?.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{user.profile.phone}</span>
                                                </div>
                                            )}

                                            {user.profile?.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{user.profile.location}</span>
                                                </div>
                                            )}

                                            {user.profile?.current_position && (
                                                <p className="mt-2 font-medium text-gray-700">{user.profile.current_position}</p>
                                            )}

                                            {user.profile?.bio && <p className="mt-2 line-clamp-2 text-gray-600">{user.profile.bio}</p>}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Bergabung {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
                                            {user.last_login_at && (
                                                <span>Login terakhir {formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true })}</span>
                                            )}
                                            {user.company && <span>Perusahaan: {user.company.name}</span>}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col gap-2">
                                        <Button size="sm" variant="outline" onClick={() => router.visit(`/admin/users/${user.id}`)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat
                                        </Button>

                                        <Button size="sm" variant="outline" onClick={() => router.visit(`/admin/users/${user.id}/edit`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>

                                        <Button size="sm" variant="outline" onClick={() => toggleUserStatus(user)}>
                                            {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                        </Button>

                                        <Button size="sm" variant="destructive" onClick={() => deleteUser(user)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {users.data.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium">Tidak ada pengguna ditemukan</h3>
                            <p className="text-gray-600">
                                {Object.values(filters).some((f) => f)
                                    ? 'Coba sesuaikan filter Anda untuk melihat lebih banyak hasil.'
                                    : 'Belum ada pengguna yang terdaftar.'}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {users.total > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <p className="text-sm text-gray-600">
                                        Menampilkan {(users.current_page - 1) * users.per_page + 1} sampai{' '}
                                        {Math.min(users.current_page * users.per_page, users.total)} dari {users.total} pengguna
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
                                        disabled={users.current_page <= 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToPage(users.current_page - 1);
                                        }}
                                    >
                                        Sebelumnya
                                    </Button>

                                    {/* Page Numbers - Only show if more than 1 page */}
                                    {users.last_page > 1 && (
                                    <div className="hidden items-center gap-1 sm:flex">
                                        {(() => {
                                            const currentPage = users.current_page;
                                            const lastPage = users.last_page;
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
                                    {users.last_page > 1 && (
                                    <span className="text-sm text-gray-600 sm:hidden">
                                        Hal {users.current_page}/{users.last_page}
                                    </span>
                                    )}

                                    {/* Next Page */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={users.current_page >= users.last_page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigateToPage(users.current_page + 1);
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
