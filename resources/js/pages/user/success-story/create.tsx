import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Upload,
    User,
    Building,
    MapPin,
    Trophy,
    DollarSign,
    FileText,
    Star
} from 'lucide-react';
import { toast } from 'sonner';
// import ModernNavbar from '@/components/modern-navbar';
// import ModernFooter from '@/components/modern-footer';
import { type SharedData } from '@/types';
import MainLayout from '@/layouts/main-layout';

export default function CreateSuccessStory() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user as any;

    // Local display state for Rupiah-formatted inputs
    const [salaryBeforeDisplay, setSalaryBeforeDisplay] = useState<string>('');
    const [salaryAfterDisplay, setSalaryAfterDisplay] = useState<string>('');

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        position: '',
        company: '',
        story: '',
        location: '',
        experience_years: '',
        salary_before: '',
        salary_after: '',
        avatar: null as File | null,
    });

    // Prefill personal info from logged-in user
    useEffect(() => {
        if (!user) return;
        const profile = user?.profile || {};
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();

        if (!data.name && (fullName || user.name)) {
            setData('name', fullName || user.name || '');
        }
        if (!data.location && profile.location) {
            setData('location', profile.location || '');
        }
        if (!data.position && profile.current_position) {
            setData('position', profile.current_position || '');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Helpers for Rupiah formatting
    const onlyDigits = (val: string) => (val || '').replace(/[^0-9]/g, '');
    const formatRupiah = (digits: string) => {
        if (!digits) return '';
        const n = parseInt(digits, 10);
        if (isNaN(n)) return '';
        return 'Rp ' + n.toLocaleString('id-ID');
    };

    // Keep display fields in sync when data restored after validation
    useEffect(() => {
        if (data.salary_before && !salaryBeforeDisplay) {
            setSalaryBeforeDisplay(formatRupiah(onlyDigits(String(data.salary_before))));
        }
    }, [data.salary_before]);
    useEffect(() => {
        if (data.salary_after && !salaryAfterDisplay) {
            setSalaryAfterDisplay(formatRupiah(onlyDigits(String(data.salary_after))));
        }
    }, [data.salary_after]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Frontend validation: max 2MB, allow jpeg/png/jpg
            const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowed.includes(file.type)) {
                toast.error('Format gambar tidak didukung. Gunakan JPEG/PNG.');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran gambar maksimal 2MB.');
                return;
            }
            setData('avatar', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Transform data for submission: convert empty numeric strings to null and strip formatting
        transform((form) => {
            const sb = onlyDigits(salaryBeforeDisplay);
            const sa = onlyDigits(salaryAfterDisplay);
            const exp = typeof form.experience_years === 'string' ? form.experience_years.trim() : form.experience_years;
            return {
                ...form,
                experience_years: exp === '' || exp === null || typeof exp === 'undefined' ? null : Number(exp),
                salary_before: sb ? Number(sb) : null,
                salary_after: sa ? Number(sa) : null,
            } as typeof form;
        });
        post('/user/success-stories', {
            onSuccess: () => {
                const isAdmin = user && (user.role === 'company_admin' || user.role === 'super_admin');
                router.visit(isAdmin ? '/admin/dashboard' : '/user/dashboard');
            },
            onError: (errs) => {
                // Tampilkan pesan error pertama agar lebih informatif
                const first = errs && typeof errs === 'object' ? (Object.values(errs)[0] as string | undefined) : undefined;
                toast.error(first || 'Terjadi kesalahan. Silakan coba lagi.');
            },
            preserveScroll: true,
        });
    };

    return (
        <MainLayout currentPage="success-stories">
            <Head title="Bagikan Kisah Sukses Anda" />

                <main className="pt-20 pb-12">
                    <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex w-fit items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Kembali</span>
                        </Button>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Bagikan Kisah Sukses Anda</h1>
                            <p className="text-sm text-gray-600 sm:text-base">Inspirasi orang lain dengan perjalanan karir Anda</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Informasi Pribadi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">
                                {/* Avatar Upload */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Foto Profil (Opsional)</Label>
                                    <div className="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover sm:h-20 sm:w-20"
                                            />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100 sm:h-20 sm:w-20">
                                                <User className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8" />
                                            </div>
                                        )}
                                        <div className="w-full sm:w-auto">
                                            <input
                                                type="file"
                                                id="avatar"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="avatar"
                                                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 sm:w-auto"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Pilih Foto
                                            </Label>
                                            <p className="mt-1 text-xs text-gray-500">PNG, JPG hingga 2MB</p>
                                        </div>
                                    </div>
                                    {errors.avatar && <p className="mt-2 text-xs text-red-600">{errors.avatar}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Nama Lengkap *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="mt-2"
                                        />
                                        {errors.name && <p className="text-red-600 text-xs mt-2">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                            Lokasi (Opsional)
                                        </Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Jakarta, Indonesia"
                                            className="mt-2"
                                        />
                                        {errors.location && <p className="text-red-600 text-xs mt-2">{errors.location}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Career Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-blue-600" />
                                    Informasi Karir
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                    <div>
                                        <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                                            Posisi Saat Ini *
                                        </Label>
                                        <Input
                                            id="position"
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            placeholder="Frontend Developer"
                                            className="mt-2"
                                        />
                                        {errors.position && <p className="text-red-600 text-xs mt-2">{errors.position}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                                            Perusahaan *
                                        </Label>
                                        <Input
                                            id="company"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            placeholder="PT. Teknologi Indonesia"
                                            className="mt-2"
                                        />
                                        {errors.company && <p className="text-red-600 text-xs mt-2">{errors.company}</p>}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="experience_years" className="text-sm font-medium text-gray-700">
                                        Pengalaman Kerja (Tahun) - Opsional
                                    </Label>
                                    <Input
                                        id="experience_years"
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={data.experience_years}
                                        onChange={(e) => setData('experience_years', e.target.value)}
                                        placeholder="5"
                                        className="mt-2"
                                    />
                                    {errors.experience_years && <p className="text-red-600 text-xs mt-2">{errors.experience_years}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Salary Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                    Informasi Gaji (Opsional)
                                </CardTitle>
                                <p className="text-xs text-gray-600 sm:text-sm">Informasi ini akan membantu menampilkan peningkatan karir Anda</p>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                    <div>
                                        <Label htmlFor="salary_before" className="text-sm font-medium text-gray-700">
                                            Gaji Sebelumnya (IDR)
                                        </Label>
                                        <Input
                                            id="salary_before"
                                            type="text"
                                            inputMode="numeric"
                                            value={salaryBeforeDisplay}
                                            onChange={(e) => {
                                                const digits = onlyDigits(e.target.value);
                                                setData('salary_before', digits);
                                                setSalaryBeforeDisplay(formatRupiah(digits));
                                            }}
                                            placeholder="Rp 5.000.000"
                                            className="mt-2"
                                        />
                                        {errors.salary_before && <p className="text-red-600 text-xs mt-2">{errors.salary_before}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="salary_after" className="text-sm font-medium text-gray-700">
                                            Gaji Sekarang (IDR)
                                        </Label>
                                        <Input
                                            id="salary_after"
                                            type="text"
                                            inputMode="numeric"
                                            value={salaryAfterDisplay}
                                            onChange={(e) => {
                                                const digits = onlyDigits(e.target.value);
                                                setData('salary_after', digits);
                                                setSalaryAfterDisplay(formatRupiah(digits));
                                            }}
                                            placeholder="Rp 8.000.000"
                                            className="mt-2"
                                        />
                                        {errors.salary_after && <p className="text-red-600 text-xs mt-2">{errors.salary_after}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Success Story */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-blue-600" />
                                    Kisah Sukses Anda
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="story" className="text-sm font-medium text-gray-700">
                                        Ceritakan Perjalanan Karir Anda *
                                    </Label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Bagikan bagaimana KarirConnect membantu Anda menemukan pekerjaan impian atau mengembangkan karir. Maksimal 100 karakter.
                                    </p>
                                    <Textarea
                                        id="story"
                                        value={data.story}
                                        onChange={(e) => setData('story', e.target.value)}
                                        placeholder="Ceritakan perjalanan karir Anda, bagaimana KarirConnect membantu, tantangan yang dihadapi, dan pencapaian yang diraih..."
                                        rows={6}
                                        maxLength={100}
                                        className="mt-2 resize-none"
                                    />
                                    <div className="mt-2 flex justify-between">
                                        {errors.story && <p className="text-red-600 text-xs">{errors.story}</p>}
                                        <p className="text-xs text-gray-500 ml-auto">
                                            {data.story.length}/100 karakter maksimum
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <Card>
                            <CardContent className="p-4 sm:p-6">
                                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:mb-6 sm:p-4">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 sm:h-5 sm:w-5" />
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-medium text-blue-900 sm:text-base">Catatan Penting</h4>
                                            <p className="mt-1 text-xs leading-relaxed text-blue-800 sm:text-sm">
                                                Kisah sukses Anda akan ditinjau oleh tim kami sebelum dipublikasikan.
                                                Pastikan informasi yang Anda berikan akurat dan profesional.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="w-full flex-1 sm:w-auto"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex-1 bg-blue-600 hover:bg-blue-700 sm:w-auto"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                <span className="text-sm sm:text-base">Mengirim...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trophy className="mr-2 h-4 w-4" />
                                                <span className="text-sm sm:text-base">Bagikan Kisah Sukses</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                    </div>
                </main>

            </MainLayout>
    );
}