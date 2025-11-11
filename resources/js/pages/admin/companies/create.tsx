import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { CompanyCreateRequest, CompanySize } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, X, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useRef } from 'react';

const getCompanySizeLabel = (size: CompanySize) => {
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

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface CreateCompanyProps {
    users?: User[];
}

export default function CreateCompany({ users = [] }: CreateCompanyProps) {
    const { data, setData, post, processing, errors } = useForm<CompanyCreateRequest>({
        name: '',
        description: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        location: '',
        industry: '',
        company_size: undefined,
        logo: null,
        social_links: {
            linkedin: '',
            twitter: '',
            facebook: '',
            instagram: '',
            website: '',
        },
        admin_user_id: undefined,
        verification_status: 'unverified',
        is_verified: false,
        is_active: true,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Users already filtered by backend to only include company_admin role
    const adminUsers = users;

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File Terlalu Besar', {
                    description: 'Ukuran logo maksimal 2MB. Silakan pilih file yang lebih kecil.',
                    duration: 5000,
                });
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error('Format File Tidak Valid', {
                    description: 'Logo harus berupa file gambar (JPG, PNG, GIF, dll).',
                    duration: 5000,
                });
                return;
            }

            setData('logo', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            toast.success('Logo Berhasil Dipilih', {
                description: `File "${file.name}" siap untuk diupload.`,
                duration: 3000,
            });
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setLogoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.info('Logo Dihapus', {
            description: 'Logo telah dihapus dari form. Anda dapat memilih logo baru jika diperlukan.',
            duration: 3000,
        });
    };

    const updateSocialLink = (platform: string, value: string) => {
        setData('social_links', {
            ...data.social_links,
            [platform]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Show loading toast
        const loadingToast = toast.loading('Membuat Perusahaan...', {
            description: 'Sedang menyimpan data perusahaan ke sistem.',
        });

        post('/admin/companies', {
            forceFormData: true,
            onStart: () => {
                toast.info('Memvalidasi Data', {
                    description: 'Memeriksa kelengkapan dan validitas data perusahaan.',
                    duration: 2000,
                });
            },
            onSuccess: () => {
                toast.dismiss(loadingToast);

                const companyName = data.name || 'Perusahaan baru';
                const adminName = adminUsers.find(u => u.id === data.admin_user_id)?.name;

                toast.success('Perusahaan Berhasil Dibuat!', {
                    description: `${companyName} telah berhasil ditambahkan ke sistem${adminName ? ` dengan admin ${adminName}` : ''}.`,
                    duration: 5000,
                    action: {
                        label: 'Lihat Daftar',
                        onClick: () => router.get('/admin/companies')
                    }
                });
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);

                const errorCount = Object.keys(errors).length;
                const firstError = Object.values(errors)[0];

                toast.error('Gagal Membuat Perusahaan', {
                    description: errorCount > 1
                        ? `Terdapat ${errorCount} kesalahan dalam form. ${firstError}`
                        : `${firstError}`,
                    duration: 6000,
                    action: {
                        label: 'Tutup',
                        onClick: () => {}
                    }
                });

                // Show specific field errors
                if (errors.name) {
                    toast.error('Nama Perusahaan Bermasalah', {
                        description: errors.name,
                        duration: 4000,
                    });
                }

                if (errors.location) {
                    toast.error('Lokasi Bermasalah', {
                        description: errors.location,
                        duration: 4000,
                    });
                }

                if (errors.logo) {
                    toast.error('Logo Bermasalah', {
                        description: errors.logo,
                        duration: 4000,
                    });
                }
            },
            onFinish: () => {
                toast.dismiss(loadingToast);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Tambah Perusahaan" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.get('/admin/companies')}
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-2xl font-bold">
                                Tambah Perusahaan
                            </h1>
                        </div>
                        <p className="text-gray-600">Buat perusahaan baru dalam sistem</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Perusahaan *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama perusahaan"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="industry">Industri</Label>
                                    <Input
                                        id="industry"
                                        value={data.industry}
                                        onChange={(e) => setData('industry', e.target.value)}
                                        placeholder="Contoh: Teknologi, Keuangan, Retail"
                                    />
                                    <InputError message={errors.industry} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi singkat tentang perusahaan"
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="company_size">Ukuran Perusahaan</Label>
                                <Select 
                                    value={data.company_size} 
                                    onValueChange={(value) => setData('company_size', value as CompanySize)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih ukuran perusahaan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="startup">Startup (1-10 karyawan)</SelectItem>
                                        <SelectItem value="small">Kecil (11-50 karyawan)</SelectItem>
                                        <SelectItem value="medium">Menengah (51-200 karyawan)</SelectItem>
                                        <SelectItem value="large">Besar (201-1000 karyawan)</SelectItem>
                                        <SelectItem value="enterprise">Enterprise (1000+ karyawan)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.company_size} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kontak</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="company@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+62 xxx xxxx xxxx"
                                    />
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="text"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="www.company.com atau company.com"
                                />
                                <InputError message={errors.website} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Lokasi *</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Jakarta, Indonesia"
                                        required
                                    />
                                    <InputError message={errors.location} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Alamat Lengkap</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Alamat lengkap perusahaan"
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logo & Admin */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo & Admin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="logo">Logo Perusahaan</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Input
                                                ref={fileInputRef}
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Pilih Logo
                                            </Button>
                                        </div>
                                        {logoPreview && (
                                            <div className="relative">
                                                <img
                                                    src={logoPreview}
                                                    alt="Preview logo"
                                                    className="h-16 w-16 object-cover rounded border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                                    onClick={removeLogo}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.logo} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="admin_user_id">Admin Perusahaan</Label>
                                    <Select
                                        value={data.admin_user_id?.toString() || "0"}
                                        onValueChange={(value) => {
                                            const oldAdminId = data.admin_user_id;
                                            const newAdminId = value && value !== "0" ? parseInt(value) : undefined;
                                            setData('admin_user_id', newAdminId);

                                            // Show notification for admin change
                                            if (oldAdminId !== newAdminId) {
                                                if (newAdminId) {
                                                    const adminName = adminUsers.find(u => u.id === newAdminId)?.name;
                                                    toast.success('Admin Perusahaan Ditetapkan', {
                                                        description: `${adminName} telah ditetapkan sebagai admin untuk perusahaan ini.`,
                                                        duration: 3000,
                                                    });
                                                } else {
                                                    toast.info('Admin Perusahaan Dihapus', {
                                                        description: 'Admin perusahaan telah dihapus. Perusahaan akan dibuat tanpa admin khusus.',
                                                        duration: 3000,
                                                    });
                                                }
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih admin perusahaan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Tidak ada admin</SelectItem>
                                            {adminUsers.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.name} ({user.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.admin_user_id} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LinkIcon className="h-5 w-5" />
                                Social Media Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        value={data.social_links?.linkedin || ''}
                                        onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/company/yourcompany"
                                    />
                                    <InputError message={errors['social_links.linkedin']} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={data.social_links?.twitter || ''}
                                        onChange={(e) => updateSocialLink('twitter', e.target.value)}
                                        placeholder="https://twitter.com/yourcompany"
                                    />
                                    <InputError message={errors['social_links.twitter']} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                        id="facebook"
                                        value={data.social_links?.facebook || ''}
                                        onChange={(e) => updateSocialLink('facebook', e.target.value)}
                                        placeholder="https://facebook.com/yourcompany"
                                    />
                                    <InputError message={errors['social_links.facebook']} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={data.social_links?.instagram || ''}
                                        onChange={(e) => updateSocialLink('instagram', e.target.value)}
                                        placeholder="https://instagram.com/yourcompany"
                                    />
                                    <InputError message={errors['social_links.instagram']} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="verification_status">Status Verifikasi</Label>
                                <Select
                                    value={data.verification_status}
                                    onValueChange={(value) => {
                                        const oldStatus = data.verification_status;
                                        setData('verification_status', value as 'unverified' | 'pending' | 'verified' | 'rejected');
                                        // Auto-update is_verified based on verification_status
                                        setData('is_verified', value === 'verified');

                                        // Show notification for status change
                                        const statusLabels = {
                                            'unverified': 'Belum Verifikasi',
                                            'pending': 'Menunggu Verifikasi',
                                            'verified': 'Terverifikasi',
                                            'rejected': 'Ditolak'
                                        };

                                        if (oldStatus !== value) {
                                            toast.info('Status Verifikasi Diubah', {
                                                description: `Status diubah ke "${statusLabels[value as keyof typeof statusLabels]}". Checkbox "Terverifikasi" ${value === 'verified' ? 'dicentang' : 'tidak dicentang'} otomatis.`,
                                                duration: 3000,
                                            });
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status verifikasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unverified">Belum Verifikasi</SelectItem>
                                        <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                                        <SelectItem value="verified">Terverifikasi</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.verification_status} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_verified"
                                    checked={data.is_verified}
                                    onCheckedChange={(checked) => {
                                        setData('is_verified', checked as boolean);
                                        // Auto-update verification_status based on is_verified
                                        if (checked) {
                                            setData('verification_status', 'verified');
                                        } else if (data.verification_status === 'verified') {
                                            setData('verification_status', 'unverified');
                                        }
                                    }}
                                />
                                <Label htmlFor="is_verified">Terverifikasi (otomatis sinkron dengan status verifikasi)</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <Label htmlFor="is_active">Aktif</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (data.name || data.description || data.logo || data.email || data.phone) {
                                    toast.warning('Data Belum Tersimpan', {
                                        description: 'Anda memiliki data yang belum tersimpan. Data akan hilang jika melanjutkan.',
                                        duration: 4000,
                                        action: {
                                            label: 'Tetap Keluar',
                                            onClick: () => router.get('/admin/companies')
                                        }
                                    });
                                } else {
                                    toast.info('Kembali ke Daftar Perusahaan', {
                                        description: 'Membatalkan pembuatan perusahaan baru.',
                                        duration: 2000,
                                    });
                                    router.get('/admin/companies');
                                }
                            }}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perusahaan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}