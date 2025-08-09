import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { User, UserRole } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, ArrowLeft, Briefcase, Building2, Calendar, Edit, FileText, Mail, MapPin, Phone, User2 } from 'lucide-react';

interface Props {
    user: User;
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

export default function ShowUser({ user }: Props) {
    return (
        <AppLayout>
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col items-start gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.visit('/admin/users')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Pengguna
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-600">Detail Pengguna</p>
                    </div>
                    <Button onClick={() => router.visit(`/admin/users/${user.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Pengguna
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Basic Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User2 className="h-5 w-5" />
                                Informasi Dasar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
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

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="h-4 w-4" />
                                            <span>{user.email}</span>
                                        </div>

                                        {user.profile?.phone && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="h-4 w-4" />
                                                <span>{user.profile.phone}</span>
                                            </div>
                                        )}

                                        {user.profile?.location && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="h-4 w-4" />
                                                <span>{user.profile.location}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>Bergabung {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {user.profile?.current_position && (
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                                        <Briefcase className="h-4 w-4" />
                                        Posisi Saat Ini
                                    </h3>
                                    <p className="text-gray-600">{user.profile.current_position}</p>
                                </div>
                            )}

                            {user.profile?.bio && (
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                                        <FileText className="h-4 w-4" />
                                        Bio
                                    </h3>
                                    <p className="leading-relaxed text-gray-600">{user.profile.bio}</p>
                                </div>
                            )}

                            {user.company && (
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                                        <Building2 className="h-4 w-4" />
                                        Perusahaan
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">{user.company.name}</span>
                                        {user.company.is_verified && (
                                            <Badge variant="outline" className="border-green-600 text-green-600">
                                                Terverifikasi
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Stats & Actions */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Status Akun
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    {user.is_active ? (
                                        <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-800">Tidak Aktif</Badge>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Verifikasi Email</p>
                                    {user.email_verified_at ? (
                                        <Badge className="bg-green-100 text-green-800">Terverifikasi</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800">Belum Diverifikasi</Badge>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Peran</p>
                                    <Badge variant="outline" className={getRoleColor(user.role)}>
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Anggota Sejak</p>
                                    <p className="text-sm font-medium">
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Aksi Cepat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => router.visit(`/admin/users/${user.id}/edit`)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Pengguna
                                </Button>

                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => {
                                        // Toggle user status
                                        router.post(
                                            `/admin/users/${user.id}/toggle-status`,
                                            {},
                                            {
                                                onSuccess: () => router.reload(),
                                            },
                                        );
                                    }}
                                >
                                    {user.is_active ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
