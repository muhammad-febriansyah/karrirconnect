import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Company } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Briefcase, CheckCircle, Edit, Mail, MapPin, Phone, Trash2, Users, Globe, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const getCompanySizeLabel = (size: string) => {
    switch (size) {
        case 'startup':
            return 'Startup (1-10 karyawan)';
        case 'small':
            return 'Kecil (11-50 karyawan)';
        case 'medium':
            return 'Menengah (51-200 karyawan)';
        case 'large':
            return 'Besar (201-1000 karyawan)';
        case 'enterprise':
            return 'Enterprise (1000+ karyawan)';
        default:
            return size;
    }
};

interface Props {
    company: Company & {
        job_listings_count?: number;
        users_count?: number;
        users?: Array<{
            id: number;
            name: string;
            email: string;
            is_active: boolean;
            role: string;
        }>;
        jobListings?: Array<{
            id: number;
            title: string;
            created_at: string;
            status: string;
        }>;
    };
    userRole: string;
}

export default function ShowCompany({ company, userRole }: Props) {
    const toggleVerification = () => {
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

    const toggleStatus = () => {
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

    const deleteCompany = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus perusahaan "${company.name}"?`)) {
            router.delete(`/admin/companies/${company.id}`, {
                onSuccess: () => {
                    toast.success('Perusahaan berhasil dihapus');
                    router.get('/admin/companies');
                },
                onError: () => {
                    toast.error('Gagal menghapus perusahaan');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title={company.name} />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get(userRole === 'company_admin' ? '/admin/dashboard' : '/admin/companies')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-2xl font-bold">
                                {company.name}
                            </h1>
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
                        <p className="text-gray-600">Detail informasi perusahaan</p>
                    </div>
                    
                    {userRole !== 'company_admin' && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.get(`/admin/companies/${company.id}/edit`)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            onClick={deleteCompany}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Company Information */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nama Perusahaan</label>
                                        <p className="text-base font-medium">{company.name}</p>
                                    </div>
                                    
                                    {company.industry && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Industri</label>
                                            <p className="text-base">{company.industry}</p>
                                        </div>
                                    )}

                                    {company.company_size && (
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-500">Ukuran Perusahaan</label>
                                            <p className="text-base">{getCompanySizeLabel(company.company_size)}</p>
                                        </div>
                                    )}
                                </div>

                                {company.description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Deskripsi</label>
                                        <p className="text-base text-gray-700 whitespace-pre-wrap">{company.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kontak</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {company.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Email</label>
                                                <p className="text-base">{company.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {company.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
                                                <p className="text-base">{company.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {company.website && (
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Website</label>
                                                <a 
                                                    href={company.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-base text-blue-600 hover:underline"
                                                >
                                                    {company.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {company.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Alamat</label>
                                                <p className="text-base text-gray-700 whitespace-pre-wrap">{company.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Job Listings */}
                        {company.jobListings && company.jobListings.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lowongan Pekerjaan Terbaru</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {company.jobListings.slice(0, 5).map((job) => (
                                            <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{job.title}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Dibuat {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                                                    {job.status}
                                                </Badge>
                                            </div>
                                        ))}
                                        {company.jobListings.length > 5 && (
                                            <p className="text-sm text-gray-500 text-center pt-2">
                                                dan {company.jobListings.length - 5} lowongan lainnya
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statistics - Hidden for Company Admin */}
                        {userRole !== 'company_admin' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{company.users_count || 0}</p>
                                        <p className="text-sm text-gray-600">Pengguna</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{company.job_listings_count || 0}</p>
                                        <p className="text-sm text-gray-600">Lowongan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        )}

                        {/* Company Admins - Hidden for Company Admin */}
                        {userRole !== 'company_admin' && company.users && company.users.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Perusahaan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {company.users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                                </div>
                                                <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                                    {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions - Hidden for Company Admin */}
                        {userRole !== 'company_admin' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tindakan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full"
                                    variant={company.is_verified ? 'outline' : 'default'}
                                    onClick={toggleVerification}
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

                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={toggleStatus}
                                >
                                    {company.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                </Button>
                            </CardContent>
                        </Card>
                        )}

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Waktu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Bergabung</label>
                                    <p className="text-sm">
                                        {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Terakhir Diperbarui</label>
                                    <p className="text-sm">
                                        {formatDistanceToNow(new Date(company.updated_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}