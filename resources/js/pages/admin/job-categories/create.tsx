import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Folder, Hash, Image, Save, Upload, X } from 'lucide-react';
import { ChangeEvent, DragEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface FormData {
    name: string;
    description: string;
    image: File | null;
    is_active: boolean;
}

interface FormErrors {
    name?: string;
    description?: string;
    image?: string;
    is_active?: string;
}

export default function CreateJobCategory() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        description: '',
        image: null,
        is_active: true,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);

    const validateFile = (file: File): boolean => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            alert('Hanya file PNG, JPG, JPEG, atau SVG yang diperbolehkan');
            return false;
        }

        if (file.size > maxSize) {
            alert('Ukuran file tidak boleh lebih dari 2MB');
            return false;
        }

        return true;
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            processFile(file);
        }
    };

    const processFile = (file: File): void => {
        setData('image', file);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (): void => {
        setData('image', null);
        setImagePreview(null);
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragOut = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0] && validateFile(files[0])) {
            processFile(files[0]);
        }
    };

    const formatFileSize = (bytes: number): string => {
        return (bytes / 1024).toFixed(1);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        post('/admin/job-categories', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Kategori Pekerjaan Berhasil Dibuat!', {
                    description: 'Kategori pekerjaan baru telah berhasil ditambahkan.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Membuat Kategori', {
                    description: 'Terjadi kesalahan saat membuat kategori pekerjaan.',
                    duration: 4000,
                });
            },
        });
    };

    const typedErrors = errors as FormErrors;

    return (
        <AppLayout>
            <Head title="Tambah Kategori Pekerjaan" />

            <div className="space-y-6 p-6">
                <div className="flex flex-col items-start gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.visit('/admin/job-categories')} type="button">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Kategori
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tambah Kategori Pekerjaan</h1>
                        <p className="mt-2 text-gray-600">Tambahkan kategori pekerjaan baru untuk mengorganisir lowongan kerja</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-full">
                    <Card className="shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Folder className="h-5 w-5 text-blue-600" />
                                Informasi Kategori
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6">
                            {/* Name Field */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <Hash className="h-4 w-4 text-gray-500" />
                                    Nama Kategori *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`${typedErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} transition-colors`}
                                    placeholder="contoh: Teknologi Informasi, Kesehatan, Keuangan"
                                    required
                                />
                                {typedErrors.name && <p className="mt-2 text-sm text-red-600">{typedErrors.name}</p>}
                                <p className="text-sm text-gray-500">Pilih nama yang jelas dan deskriptif untuk kategori pekerjaan ini</p>
                            </div>

                            {/* Description Field */}
                            <div className="space-y-3">
                                <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`${typedErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'} resize-none transition-colors`}
                                    placeholder="Deskripsi singkat tentang kategori pekerjaan ini..."
                                    rows={4}
                                />
                                {typedErrors.description && <p className="mt-2 text-sm text-red-600">{typedErrors.description}</p>}
                                <p className="text-sm text-gray-500">Deskripsi opsional untuk membantu pengguna memahami kategori ini</p>
                            </div>

                            {/* Image Upload Field */}
                            <div className="space-y-3">
                                <Label htmlFor="image" className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <Image className="h-4 w-4 text-gray-500" />
                                    Gambar Kategori (Opsional)
                                </Label>
                                <div className="space-y-4">
                                    {/* Hidden File Input */}
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {/* Drop Zone */}
                                    {!imagePreview && (
                                        <div
                                            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                                                dragActive
                                                    ? 'border-blue-400 bg-blue-50'
                                                    : typedErrors.image
                                                      ? 'border-red-300 hover:border-red-400'
                                                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                            onClick={() => document.getElementById('image')?.click()}
                                            onDragEnter={handleDragIn}
                                            onDragLeave={handleDragOut}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <Upload className={`mx-auto mb-4 h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                                            <p className="mb-2 text-base font-medium text-gray-700">Klik untuk upload gambar atau drag & drop</p>
                                            <p className="text-sm text-gray-500">PNG, JPG, JPEG, SVG (Maksimal 2MB)</p>
                                        </div>
                                    )}

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="relative">
                                            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="h-24 w-24 rounded-lg border-2 border-white object-cover shadow-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-base font-semibold text-gray-900">{data.image?.name}</p>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {data.image && `${formatFileSize(data.image.size)} KB • ${data.image.type}`}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-1.5">
                                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                            <p className="text-sm font-medium text-green-700">Gambar berhasil dimuat</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {typedErrors.image && <p className="mt-2 text-sm text-red-600">{typedErrors.image}</p>}
                                <p className="text-sm text-gray-500">
                                    Upload gambar untuk mewakili kategori ini secara visual. Format yang didukung: PNG, JPG, JPEG, SVG
                                </p>
                            </div>

                            {/* Active Status Field */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label htmlFor="is_active" className="text-base font-medium text-gray-700">
                                        Kategori Aktif
                                    </Label>
                                </div>
                                <p className="text-sm text-gray-500">Hanya kategori aktif yang akan tersedia untuk posting lowongan kerja</p>
                                {typedErrors.is_active && <p className="mt-2 text-sm text-red-600">{typedErrors.is_active}</p>}
                            </div>

                            {/* Preview Section */}
                            {(data.name || imagePreview) && (
                                <div className="mt-8 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                    <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Pratinjau Kategori
                                    </h4>
                                    <div className="flex items-center gap-6 rounded-xl border border-white bg-white p-6 shadow-sm">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Category preview"
                                                className="h-20 w-20 rounded-xl border-2 border-gray-100 object-cover shadow-md"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                                                <Image className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h5 className="text-xl font-bold text-gray-900">{data.name || 'Nama Kategori'}</h5>
                                            {data.description && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{data.description}</p>
                                            )}
                                            <div className="mt-3 flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                        data.is_active
                                                            ? 'bg-green-100 text-green-800 ring-1 ring-green-600/20'
                                                            : 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20'
                                                    }`}
                                                >
                                                    {data.is_active ? '✓ Aktif' : '○ Tidak Aktif'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="mt-8 flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Membuat...' : 'Buat Kategori'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/job-categories')}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
