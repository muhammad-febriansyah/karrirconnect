import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { Company } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Briefcase, CheckCircle, Edit, Mail, MapPin, Phone, Trash2, Users, Globe, XCircle, Building2, Hash, Coins, FileText, ExternalLink, User, ImageIcon } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
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
                                        {company.verification_status === 'pending' ? 'Menunggu Review' :
                                         company.verification_status === 'rejected' ? 'Ditolak' : 'Belum Diverifikasi'}
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
                    
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.get(`/admin/companies/${company.id}/edit`)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        {userRole !== 'company_admin' && (
                            <Button
                                variant="outline"
                                onClick={deleteCompany}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                            </Button>
                        )}
                    </div>
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
                                {/* Logo Section */}
                                {company.logo && (
                                    <div className="flex justify-center md:justify-start mb-6">
                                        <div className="relative">
                                            <img
                                                src={`/storage/${company.logo}`}
                                                alt={`${company.name} logo`}
                                                className="h-24 w-24 object-cover rounded-lg border shadow-sm"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <ImageIcon className="h-6 w-6 text-gray-400 absolute inset-0 m-auto" />
                                        </div>
                                    </div>
                                )}

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

                                    {company.location && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Lokasi</label>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                <p className="text-base">{company.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {company.company_size && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Ukuran Perusahaan</label>
                                            <p className="text-base">{getCompanySizeLabel(company.company_size)}</p>
                                        </div>
                                    )}

                                    {company.slug && (
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium text-gray-500">Slug</label>
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-4 w-4 text-gray-500" />
                                                <p className="text-base font-mono text-gray-600">{company.slug}</p>
                                            </div>
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

                        {/* Admin User Information */}
                        {company.admin_user_id && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Perusahaan Ditetapkan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <User className="h-8 w-8 text-blue-600 bg-blue-50 rounded-full p-1.5" />
                                            <div className="flex-1">
                                                {(company as any).admin_user ? (
                                                    <>
                                                        <p className="font-medium">{(company as any).admin_user.name}</p>
                                                        <p className="text-sm text-gray-600">{(company as any).admin_user.email}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="font-medium">Admin Ditetapkan</p>
                                                        <p className="text-sm text-gray-600">User ID: {company.admin_user_id}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Points & Job Management System */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sistem Poin & Lowongan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <Coins className="h-4 w-4 text-yellow-600" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Poin Posting</label>
                                            <p className="text-base font-bold">{company.job_posting_points || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Briefcase className="h-4 w-4 text-blue-600" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Job Posts</label>
                                            <p className="text-base">{company.total_job_posts || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Job Aktif</label>
                                            <p className="text-base">{company.active_job_posts || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-purple-600" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Max Job Aktif</label>
                                            <p className="text-base">{company.max_active_jobs || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {company.points_last_updated && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Poin Terakhir Update</label>
                                        <p className="text-sm text-gray-600">
                                            {formatDistanceToNow(new Date(company.points_last_updated), { addSuffix: true })}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Verification Information */}
                        {(company.verification_status || company.is_verified) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status Verifikasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status Verifikasi</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                {company.is_verified ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <span className="text-green-600 font-medium">Terverifikasi</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">
                                                            {company.verification_status === 'pending' ? 'Menunggu Review' :
                                                             company.verification_status === 'rejected' ? 'Ditolak' : 'Belum Diverifikasi'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {company.verification_status && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Verification Status</label>
                                                <p className="text-base capitalize">{company.verification_status}</p>
                                            </div>
                                        )}
                                    </div>

                                    {company.verification_documents && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Dokumen Verifikasi</label>
                                            <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                                                Dokumen tersedia
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Social Media Links */}
                        {company.social_links && Object.keys(company.social_links).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Media</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-3">
                                        {company.social_links.linkedin && (
                                            <div className="flex items-center gap-3">
                                                <FaLinkedin className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                                                    <a
                                                        href={company.social_links.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {company.social_links.linkedin}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {company.social_links.twitter && (
                                            <div className="flex items-center gap-3">
                                                <FaTwitter className="h-5 w-5 text-sky-500" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Twitter</label>
                                                    <a
                                                        href={company.social_links.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {company.social_links.twitter}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {company.social_links.facebook && (
                                            <div className="flex items-center gap-3">
                                                <FaFacebook className="h-5 w-5 text-blue-700" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Facebook</label>
                                                    <a
                                                        href={company.social_links.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {company.social_links.facebook}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {company.social_links.instagram && (
                                            <div className="flex items-center gap-3">
                                                <FaInstagram className="h-5 w-5 text-pink-600" />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Instagram</label>
                                                    <a
                                                        href={company.social_links.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-base text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {company.social_links.instagram}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

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
                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{company.users_count || 0}</p>
                                        <p className="text-sm text-gray-600">Karyawan</p>
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

                        {/* Company Users */}
                        {company.users && company.users.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Daftar Karyawan</CardTitle>
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

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tindakan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {userRole !== 'company_admin' && (
                                    <>
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
                                    </>
                                )}

                                {/* Actions available for Company Admin */}
                                {userRole === 'company_admin' && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">Hubungi Super Admin untuk mengubah status verifikasi perusahaan</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

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