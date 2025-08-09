import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { User, UserRole, UserUpdateRequest } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, User2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    user: User;
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

export default function EditUser({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm<UserUpdateRequest>({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'user',
        is_active: user.is_active ?? true,
        first_name: user.profile?.first_name || '',
        last_name: user.profile?.last_name || '',
        phone: user.profile?.phone || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        current_position: user.profile?.current_position || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                toast.success('Pengguna Berhasil Diperbarui!', {
                    description: 'Data pengguna telah berhasil diperbarui.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Memperbarui Pengguna', {
                    description: 'Terjadi kesalahan saat memperbarui data pengguna.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit ${user.name}`} />

            <div className="space-y-6 p-6">
                <div className="flex flex-col items-start gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.visit('/admin/users')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Pengguna
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Pengguna</h1>
                        <p className="text-gray-600">Perbarui informasi pengguna</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User2 className="h-5 w-5" />
                                    Informasi Akun
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama Lengkap *</Label>
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

                                <div>
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

                                <div>
                                    <Label htmlFor="password">Kata Sandi Baru</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        placeholder="Biarkan kosong untuk mempertahankan kata sandi saat ini"
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi Baru</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                        placeholder="Konfirmasi kata sandi baru"
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="role">Peran *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value as UserRole)}>
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
                                    <div>
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

                                    <div>
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

                                <div>
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

                                <div>
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

                                <div>
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

                                <div>
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
                            {processing ? 'Memperbarui...' : 'Perbarui Pengguna'}
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
