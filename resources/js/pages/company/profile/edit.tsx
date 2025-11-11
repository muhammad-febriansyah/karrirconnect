import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building, Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Company {
    id: number;
    name: string;
    description?: string;
    industry?: string;
    size?: string;
    location?: string;
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
    founded_year?: number;
    logo?: string;
    logo_url?: string;
}

interface Props {
    company: Company;
}

export default function EditCompanyProfile({ company }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(company.logo_url || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        size: company.size || '',
        location: company.location || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        founded_year: company.founded_year || '',
        logo: null as File | null,
        _method: 'PUT'
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setLogoPreview(null);
        // Reset the file input
        const fileInput = document.getElementById('logo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.profile.update'), {
            onSuccess: () => {
                toast.success('Profil perusahaan berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Terjadi kesalahan saat memperbarui profil perusahaan.');
            }
        });
    };

    const companySizes = [
        { value: 'startup', label: 'Startup (1-10 karyawan)' },
        { value: 'small', label: 'Kecil (11-50 karyawan)' },
        { value: 'medium', label: 'Menengah (51-200 karyawan)' },
        { value: 'large', label: 'Besar (201-1000 karyawan)' },
        { value: 'enterprise', label: 'Enterprise (1000+ karyawan)' }
    ];

    const industries = [
        'Teknologi', 'Keuangan', 'Pendidikan', 'Kesehatan', 'Retail',
        'Manufaktur', 'Konstruksi', 'Transportasi', 'Media', 'Konsultan',
        'Properti', 'Otomotif', 'Makanan & Minuman', 'Fashion', 'Lainnya'
    ];

    return (
        <AppLayout>
            <Head title="Edit Profil Perusahaan" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/company/dashboard">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Profil Perusahaan</h1>
                            <p className="text-gray-600">Kelola informasi profil perusahaan Anda</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5" />
                                        Informasi Dasar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nama Perusahaan *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama perusahaan"
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Deskripsi Perusahaan</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Deskripsikan perusahaan Anda..."
                                            rows={4}
                                        />
                                        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="industry">Industri</Label>
                                            <Select value={data.industry} onValueChange={(value) => setData('industry', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih industri" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {industries.map((industry) => (
                                                        <SelectItem key={industry} value={industry}>
                                                            {industry}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="size">Ukuran Perusahaan</Label>
                                            <Select value={data.size} onValueChange={(value) => setData('size', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih ukuran perusahaan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {companySizes.map((size) => (
                                                        <SelectItem key={size.value} value={size.value}>
                                                            {size.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.size && <p className="text-sm text-red-600 mt-1">{errors.size}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="founded_year">Tahun Didirikan</Label>
                                        <Input
                                            id="founded_year"
                                            type="number"
                                            value={data.founded_year}
                                            onChange={(e) => setData('founded_year', e.target.value)}
                                            placeholder="2020"
                                            min="1800"
                                            max={new Date().getFullYear()}
                                        />
                                        {errors.founded_year && <p className="text-sm text-red-600 mt-1">{errors.founded_year}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Kontak</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="company@example.com"
                                            />
                                            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Nomor Telepon</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="021-1234567"
                                            />
                                            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://www.company.com"
                                        />
                                        {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Lokasi</Label>
                                        <Input
                                            id="location"
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Jakarta, Indonesia"
                                        />
                                        {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Alamat</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Alamat lengkap perusahaan..."
                                            rows={3}
                                        />
                                        {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Logo Perusahaan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        {logoPreview ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo Preview"
                                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                                                    onClick={removeLogo}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                                <Upload className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="logo">Upload Logo</Label>
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: JPEG, PNG, JPG, GIF. Maksimal 2MB.
                                        </p>
                                        {errors.logo && <p className="text-sm text-red-600 mt-1">{errors.logo}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t">
                        <Link href="/company/dashboard">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? (
                                <>Menyimpan...</>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}