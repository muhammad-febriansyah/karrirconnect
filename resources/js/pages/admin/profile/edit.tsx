import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, router, useForm } from '@inertiajs/react';
import { Camera, User } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Profile', href: '/admin/profile' },
];

interface AdminProfileEditProps {
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        role: string;
    };
}

export default function AdminProfileEdit({ user }: AdminProfileEditProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        avatar: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profil berhasil diperbarui!', {
                    description: 'Data profil Anda telah berhasil disimpan.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal memperbarui profil', {
                    description: 'Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
        }
    };

    const currentAvatar = data.avatar 
        ? URL.createObjectURL(data.avatar) 
        : user.avatar 
        ? `/storage/${user.avatar}` 
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profil Admin" />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Profil Admin</h1>
                    <p className="text-gray-600">Kelola informasi profil Anda</p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Informasi Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center space-x-4">
                                <div 
                                    className="relative group cursor-pointer" 
                                    onClick={handleAvatarClick}
                                >
                                    <div className="h-20 w-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                                        {currentAvatar ? (
                                            <img
                                                src={currentAvatar}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                                <User className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                                        {user.avatar ? 'Ganti Foto' : 'Upload Foto'}
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-1">
                                        JPG, PNG atau GIF (maksimal 2MB)
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            {errors.avatar && <p className="text-sm text-red-600">{errors.avatar}</p>}

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="Masukkan alamat email"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Role Display (Read-only) */}
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-700 capitalize">
                                    {user.role.replace('_', ' ')}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}