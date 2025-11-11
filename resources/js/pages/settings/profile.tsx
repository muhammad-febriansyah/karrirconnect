import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengaturan profil',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    bio?: string;
    location?: string;
    avatar?: File;
    resume?: File;
    portfolio_url?: string;
    linkedin_url?: string;
    github_url?: string;
    current_position?: string;
    expected_salary_min?: number;
    expected_salary_max?: number;
    salary_currency?: string;
    open_to_work: boolean;
};

export default function Profile({ mustVerifyEmail, status, user }: { mustVerifyEmail: boolean; status?: string; user?: any }) {
    const { auth } = usePage<SharedData>().props;
    const profile = user?.profile || {};

    // State for preview image
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        email: auth.user.email,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar: undefined,
        resume: undefined,
        portfolio_url: profile.portfolio_url || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || '',
        current_position: profile.current_position || '',
        expected_salary_min: profile.expected_salary_min || undefined,
        expected_salary_max: profile.expected_salary_max || undefined,
        salary_currency: profile.salary_currency || 'IDR',
        open_to_work: profile.open_to_work || false,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePreview = () => {
        setPreviewImage(null);
        setData('avatar', undefined);
        // Reset file input
        const fileInput = document.getElementById('avatar') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();


        post(route('profile.update'), {
            _method: 'PATCH',
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profil Berhasil Diperbarui!', {
                    description: 'Data profil Anda telah berhasil disimpan.',
                    duration: 4000,
                });
                // Clear preview after successful upload
                setPreviewImage(null);
            },
            onError: (errors) => {
                console.error('Profile update errors:', errors);
                const errorMessage = errors.general
                    ? errors.general
                    : 'Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.';

                toast.error('Gagal Memperbarui Profil', {
                    description: errorMessage,
                    duration: 6000,
                });
            },
        });
    };

    // Get current avatar URL using User model's avatar_url accessor
    const getCurrentAvatarUrl = () => {
        return auth.user.avatar_url || null;
    };

    const getInitials = () => {
        const name = data.name || auth.user.name || '';
        return name
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan profil" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi profil" description="Perbarui informasi profil dan preferensi Anda" />
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Lengkap *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            placeholder="Nama lengkap"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            placeholder="alamat@email.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">Nama Depan</Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name || ''}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Nama depan"
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Nama Belakang</Label>
                                        <Input
                                            id="last_name"
                                            value={data.last_name || ''}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Nama belakang"
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Nomor Telepon</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone || ''}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+62 812 3456 7890"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Lokasi</Label>
                                        <Input
                                            id="location"
                                            value={data.location || ''}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Jakarta, Indonesia"
                                        />
                                        <InputError message={errors.location} />
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                        <p className="text-sm text-yellow-800">
                                            Alamat email Anda belum diverifikasi.{' '}
                                            <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="font-medium underline hover:no-underline"
                                            >
                                                Klik di sini untuk mengirim ulang email verifikasi.
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Profile Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Profil</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current_position">Posisi Saat Ini</Label>
                                    <Input
                                        id="current_position"
                                        value={data.current_position || ''}
                                        onChange={(e) => setData('current_position', e.target.value)}
                                        placeholder="Software Developer, UI/UX Designer, etc."
                                    />
                                    <InputError message={errors.current_position} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        rows={4}
                                        value={data.bio || ''}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        placeholder="Ceritakan sedikit tentang diri Anda..."
                                    />
                                    <InputError message={errors.bio} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Files */}
                        <Card>
                            <CardHeader>
                                <CardTitle>File & Dokumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Enhanced Avatar Section with Preview */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="avatar">Foto Profil</Label>

                                        {/* Avatar Preview */}
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200">
                                                    {previewImage ? (
                                                        // Preview new image
                                                        <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                                                    ) : getCurrentAvatarUrl() ? (
                                                        // Show current avatar
                                                        <img
                                                            src={getCurrentAvatarUrl()}
                                                            alt="Current avatar"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        // Show initials as fallback
                                                        <div className="flex h-full w-full items-center justify-center bg-gray-100 font-medium text-gray-600">
                                                            {getInitials()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Remove preview button */}
                                                {previewImage && (
                                                    <button
                                                        type="button"
                                                        onClick={removePreview}
                                                        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                                        title="Hapus preview"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="mb-1" />
                                                <p className="text-xs text-gray-500">Format: JPG, PNG, GIF. Maksimal 2MB</p>
                                            </div>
                                        </div>

                                        <InputError message={errors.avatar} />

                                        {/* Current file info */}
                                        {profile.avatar && !previewImage && <p className="text-sm text-gray-600">Foto saat ini: {profile.avatar}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="resume">CV/Resume</Label>
                                        <Input
                                            id="resume"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setData('resume', e.target.files?.[0])}
                                        />
                                        <InputError message={errors.resume} />
                                        {profile.resume && <p className="text-sm text-gray-600">Resume saat ini: {profile.resume}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tautan Sosial</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                                    <Input
                                        id="portfolio_url"
                                        type="url"
                                        value={data.portfolio_url || ''}
                                        onChange={(e) => setData('portfolio_url', e.target.value)}
                                        placeholder="https://portfolio.com"
                                    />
                                    <InputError message={errors.portfolio_url} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin_url"
                                            type="url"
                                            value={data.linkedin_url || ''}
                                            onChange={(e) => setData('linkedin_url', e.target.value)}
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                        <InputError message={errors.linkedin_url} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="github_url">GitHub URL</Label>
                                        <Input
                                            id="github_url"
                                            type="url"
                                            value={data.github_url || ''}
                                            onChange={(e) => setData('github_url', e.target.value)}
                                            placeholder="https://github.com/username"
                                        />
                                        <InputError message={errors.github_url} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Profil'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">Tersimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
