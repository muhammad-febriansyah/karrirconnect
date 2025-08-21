import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { Company, CompanySize, CompanyUpdateRequest } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

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

interface Props {
    company: Company;
}

export default function EditCompany({ company }: Props) {
    const { data, setData, put, processing, errors } = useForm<CompanyUpdateRequest>({
        name: company.name,
        description: company.description || '',
        website: company.website || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        industry: company.industry || '',
        company_size: company.company_size,
        is_verified: company.is_verified,
        is_active: company.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/companies/${company.id}`, {
            onSuccess: () => {
                toast.success('Perusahaan Berhasil Diperbarui!', {
                    description: 'Data perusahaan telah berhasil diperbarui dalam sistem.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Memperbarui Perusahaan', {
                    description: 'Terjadi kesalahan saat memperbarui data perusahaan. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit ${company.name}`} />

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
                                Edit Perusahaan
                            </h1>
                        </div>
                        <p className="text-gray-600">Perbarui informasi perusahaan {company.name}</p>
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
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="https://www.company.com"
                                />
                                <InputError message={errors.website} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Alamat</Label>
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

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_verified"
                                    checked={data.is_verified}
                                    onCheckedChange={(checked) => setData('is_verified', checked as boolean)}
                                />
                                <Label htmlFor="is_verified">Terverifikasi</Label>
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
                            onClick={() => router.get('/admin/companies')}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Perbarui Perusahaan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}