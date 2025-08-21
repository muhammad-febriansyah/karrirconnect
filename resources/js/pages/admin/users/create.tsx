import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { UserCreateRequest, UserRole } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
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

export default function CreateUser({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm<UserCreateRequest>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        is_active: true,
        first_name: '',
        last_name: '',
        phone: '',
        bio: '',
        location: '',
        current_position: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => {
                toast.success('Pengguna Berhasil Dibuat!', {
                    description: 'Data pengguna baru telah berhasil disimpan ke sistem.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Membuat Pengguna', {
                    description: 'Terjadi kesalahan saat menyimpan data pengguna. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Tambah Pengguna" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col items-start gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.visit('/admin/users')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Pengguna
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Pengguna Baru</h1>
                        <p className="text-gray-600">Tambahkan pengguna baru ke platform</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Informasi Akun
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Nama Lengkap *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Kata Sandi *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Peran *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {getRoleLabel(role)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active">Pengguna Aktif</Label>
                                </div>
                                {errors.is_active && <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>}
                            </CardContent>
                        </Card>

                        {/* Profile Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Profil</CardTitle>
                                <p className="text-sm text-gray-600">Detail profil opsional</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">Nama Depan</Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className={errors.first_name ? 'border-red-500' : ''}
                                        />
                                        {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Nama Belakang</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className={errors.last_name ? 'border-red-500' : ''}
                                        />
                                        {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={errors.phone ? 'border-red-500' : ''}
                                        placeholder="e.g., +62 812 3456 7890"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location">Lokasi</Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className={errors.location ? 'border-red-500' : ''}
                                        placeholder="contoh: Jakarta, Indonesia"
                                    />
                                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="current_position">Posisi Saat Ini</Label>
                                    <Input
                                        id="current_position"
                                        type="text"
                                        value={data.current_position}
                                        onChange={(e) => setData('current_position', e.target.value)}
                                        className={errors.current_position ? 'border-red-500' : ''}
                                        placeholder="contoh: Software Engineer"
                                    />
                                    {errors.current_position && <p className="mt-1 text-sm text-red-600">{errors.current_position}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        className={errors.bio ? 'border-red-500' : ''}
                                        placeholder="Deskripsi singkat tentang pengguna..."
                                        rows={4}
                                    />
                                    {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Membuat...' : 'Tambah Pengguna'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.visit('/admin/users')}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
