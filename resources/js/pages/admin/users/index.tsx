import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { usersColumns, type User as UserType } from '@/components/tables/users-columns';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedResponse, User, UserFilters, UserRole } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

interface Props {
    users: PaginatedResponse<User>;
    filters: UserFilters;
    roles: UserRole[];
}

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

    const handleSearch = () => {
        router.get('/admin/users', {
            search: search || undefined,
            role: role === 'all' ? undefined : role,
            status: status === 'all' ? undefined : status,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        router.get('/admin/users');
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

                {/* Users Data Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable 
                            columns={usersColumns} 
                            data={users.data as UserType[]}
                            searchKey="name"
                            searchPlaceholder="Cari pengguna..."
                        />
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}