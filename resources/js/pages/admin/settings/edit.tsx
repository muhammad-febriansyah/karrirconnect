import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Camera, DollarSign, Facebook, Globe, Image as ImageIcon, Instagram, Mail, Save, Trash2, Upload, Youtube } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { FaTiktok } from 'react-icons/fa';
import { toast } from 'sonner';

interface Setting {
    id?: number;
    site_name?: string;
    keyword?: string;
    email?: string;
    address?: string;
    phone?: string;
    description?: string;
    yt?: string;
    ig?: string;
    fb?: string;
    tiktok?: string;
    fee?: number;
    logo?: string;
    thumbnail?: string;
}

interface Props {
    setting: Setting;
    flash?: {
        success?: string;
    };
}

export default function EditSettings({ setting, flash }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isThumbnailDragOver, setIsThumbnailDragOver] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [thumbnailError, setThumbnailError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [feeDisplay, setFeeDisplay] = useState<string>(setting.fee ? new Intl.NumberFormat('id-ID').format(setting.fee) : '0');

    const { data, setData, post, processing, errors, progress } = useForm({
        site_name: setting.site_name || '',
        keyword: setting.keyword || '',
        email: setting.email || '',
        address: setting.address || '',
        phone: setting.phone || '',
        description: setting.description || '',
        yt: setting.yt || '',
        ig: setting.ig || '',
        fb: setting.fb || '',
        tiktok: setting.tiktok || '',
        fee: setting.fee || 0,
        logo: null as File | null,
        thumbnail: null as File | null,
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success('Pengaturan Berhasil Disimpan!', {
                description: 'Semua perubahan pengaturan sistem telah berhasil disimpan.',
                duration: 4000,
            });
        }
    }, [flash]);

    const validateFile = (file: File): string | null => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            return 'File harus berformat JPEG, PNG, JPG, GIF, atau WebP.';
        }

        if (file.size > maxSize) {
            return 'Ukuran file tidak boleh lebih dari 2MB.';
        }

        return null;
    };

    const processFile = (file: File) => {
        const error = validateFile(file);
        setFileError(error);

        if (error) {
            toast.error('File Tidak Valid', {
                description: error,
                duration: 4000,
            });
            return;
        }

        setData('logo', file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        toast.success('Logo Siap Diupload', {
            description: `File ${file.name} telah dipilih. Klik "Simpan Pengaturan" untuk menyimpan.`,
            duration: 3000,
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        } else {
            setData('logo', null);
            setLogoPreview(null);
            setFileError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const triggerThumbnailInput = () => {
        thumbnailInputRef.current?.click();
    };

    const removeLogoPreview = () => {
        setData('logo', null);
        setLogoPreview(null);
        setFileError(null);
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.info('Logo Dihapus', {
            description: 'Preview logo telah dihapus. Pilih file baru untuk mengupload logo.',
            duration: 3000,
        });
    };

    // Thumbnail handlers
    const processThumbnailFile = (file: File) => {
        const error = validateFile(file);
        setThumbnailError(error);

        if (error) {
            toast.error('File Thumbnail Tidak Valid', {
                description: error,
                duration: 4000,
            });
            return;
        }

        setData('thumbnail', file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        toast.success('Thumbnail Siap Diupload', {
            description: `File ${file.name} telah dipilih. Klik "Simpan Pengaturan" untuk menyimpan.`,
            duration: 3000,
        });
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processThumbnailFile(file);
        } else {
            setData('thumbnail', null);
            setThumbnailPreview(null);
            setThumbnailError(null);
        }
    };

    const handleThumbnailDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsThumbnailDragOver(true);
    };

    const handleThumbnailDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsThumbnailDragOver(false);
    };

    const handleThumbnailDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsThumbnailDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processThumbnailFile(files[0]);
        }
    };

    const removeThumbnailPreview = () => {
        setData('thumbnail', null);
        setThumbnailPreview(null);
        setThumbnailError(null);
        // Reset the file input
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }

        toast.info('Thumbnail Dihapus', {
            description: 'Preview thumbnail telah dihapus. Pilih file baru untuk mengupload thumbnail.',
            duration: 3000,
        });
    };

    const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        const numericValue = parseInt(value) || 0;

        setData('fee', numericValue);
        setFeeDisplay(new Intl.NumberFormat('id-ID').format(numericValue));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Pengaturan Berhasil Disimpan!', {
                    description: 'Semua perubahan pengaturan sistem telah berhasil disimpan.',
                    duration: 4000,
                });
            },
            onError: () => {
                toast.error('Gagal Menyimpan Pengaturan', {
                    description: 'Terjadi kesalahan saat menyimpan pengaturan. Silakan coba lagi.',
                    duration: 4000,
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Pengaturan Sistem" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
                        <p className="text-gray-600">Kelola pengaturan website dan aplikasi</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Informasi Dasar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="site_name">Nama Website</Label>
                                    <Input
                                        id="site_name"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        placeholder="Masukkan nama website"
                                    />
                                    <InputError message={errors.site_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="keyword">Kata Kunci SEO</Label>
                                    <Input
                                        id="keyword"
                                        value={data.keyword}
                                        onChange={(e) => setData('keyword', e.target.value)}
                                        placeholder="Kata kunci untuk SEO"
                                    />
                                    <InputError message={errors.keyword} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Website</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Deskripsi singkat tentang website"
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Informasi Kontak
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
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

                            <div className="space-y-2">
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

                    {/* Media Sosial */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Instagram className="h-5 w-5" />
                                Media Sosial
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="yt" className="flex items-center gap-2">
                                        <Youtube className="h-4 w-4 text-red-500" />
                                        YouTube
                                    </Label>
                                    <Input
                                        id="yt"
                                        value={data.yt}
                                        onChange={(e) => setData('yt', e.target.value)}
                                        placeholder="https://youtube.com/@channel"
                                    />
                                    <InputError message={errors.yt} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ig" className="flex items-center gap-2">
                                        <Instagram className="h-4 w-4 text-pink-500" />
                                        Instagram
                                    </Label>
                                    <Input
                                        id="ig"
                                        value={data.ig}
                                        onChange={(e) => setData('ig', e.target.value)}
                                        placeholder="https://instagram.com/username"
                                    />
                                    <InputError message={errors.ig} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fb" className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4 text-blue-600" />
                                        Facebook
                                    </Label>
                                    <Input
                                        id="fb"
                                        value={data.fb}
                                        onChange={(e) => setData('fb', e.target.value)}
                                        placeholder="https://facebook.com/page"
                                    />
                                    <InputError message={errors.fb} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tiktok" className="flex items-center gap-2">
                                        <FaTiktok className="h-4 w-4 text-black" />
                                        TikTok
                                    </Label>
                                    <Input
                                        id="tiktok"
                                        value={data.tiktok}
                                        onChange={(e) => setData('tiktok', e.target.value)}
                                        placeholder="https://tiktok.com/@username"
                                    />
                                    <InputError message={errors.tiktok} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pengaturan Bisnis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pengaturan Bisnis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fee">Biaya Layanan</Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">Rp</span>
                                    </div>
                                    <Input id="fee" type="text" value={feeDisplay} onChange={handleFeeChange} placeholder="0" className="pl-10" />
                                </div>
                                <InputError message={errors.fee} />
                                <p className="text-sm text-gray-500">
                                    Biaya yang akan dikenakan untuk layanan tertentu.
                                    {/* {data.fee > 0 && (
                                        <span className="block mt-1 font-medium text-green-600">
                                            Nilai: Rp {new Intl.NumberFormat('id-ID').format(data.fee)}
                                        </span>
                                    )} */}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Logo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Logo Website
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Logo Display */}
                            {setting.logo && !logoPreview && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">Logo Saat Ini</Label>
                                    <br />
                                    <br />
                                    <div className="relative inline-block">
                                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                                            <img
                                                src={`/storage/${setting.logo}`}
                                                alt="Logo Saat Ini"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Aktif</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Logo Preview */}
                            {logoPreview && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">Preview Logo Baru</Label>
                                    <div className="relative inline-block">
                                        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border-2 border-green-200 bg-green-50 shadow-sm">
                                            <img src={logoPreview} alt="Preview Logo" className="max-h-full max-w-full object-contain" />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-md transition-transform hover:scale-110"
                                            onClick={removeLogoPreview}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <div className="absolute bottom-2 left-2">
                                            <div className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">Preview</div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <p className="text-sm font-medium text-green-700">Logo siap diupload</p>
                                        </div>
                                        <p className="mt-1 text-xs text-green-600">Klik "Simpan Pengaturan" untuk menyimpan perubahan.</p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700">
                                    {setting.logo || logoPreview ? 'Ganti Logo' : 'Upload Logo'}
                                </Label>

                                {/* Drag and Drop Area */}
                                <div
                                    className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all duration-200 hover:bg-gray-50 ${
                                        isDragOver ? 'border-blue-400 bg-blue-50' : fileError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={triggerFileInput}
                                >
                                    <div className="space-y-3 text-center">
                                        <div className="mx-auto">
                                            {isDragOver ? (
                                                <Upload className="h-10 w-10 animate-bounce text-blue-500" />
                                            ) : (
                                                <ImageIcon className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {isDragOver ? 'Lepaskan file di sini' : 'Drag & drop logo atau klik untuk pilih file'}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">Format: JPEG, PNG, JPG, GIF, WebP • Maksimal 2MB</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                triggerFileInput();
                                            }}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Pilih File
                                        </Button>
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />

                                {/* Error Display */}
                                <InputError message={errors.logo || fileError} />
                            </div>

                            {/* Upload Progress */}
                            {progress && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Mengupload...</span>
                                        <span className="text-sm text-gray-600">{progress.percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Thumbnail */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Thumbnail Website
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Thumbnail Display */}
                            {setting.thumbnail && !thumbnailPreview && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">Thumbnail Saat Ini</Label>
                                    <br />
                                    <br />
                                    <div className="relative inline-block">
                                        <div className="flex h-32 w-48 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                                            <img
                                                src={`/storage/${setting.thumbnail}`}
                                                alt="Thumbnail Saat Ini"
                                                className="max-h-full max-w-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Aktif</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thumbnail Preview */}
                            {thumbnailPreview && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">Preview Thumbnail Baru</Label>
                                    <br />
                                    <br />
                                    <div className="relative inline-block">
                                        <div className="flex h-32 w-48 items-center justify-center overflow-hidden rounded-lg border-2 border-green-200 bg-green-50 shadow-sm">
                                            <img src={thumbnailPreview} alt="Preview Thumbnail" className="max-h-full max-w-full object-cover" />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-md transition-transform hover:scale-110"
                                            onClick={removeThumbnailPreview}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <div className="absolute bottom-2 left-2">
                                            <div className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">Preview</div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <p className="text-sm font-medium text-green-700">Thumbnail siap diupload</p>
                                        </div>
                                        <p className="mt-1 text-xs text-green-600">Klik "Simpan Pengaturan" untuk menyimpan perubahan.</p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700">
                                    {setting.thumbnail || thumbnailPreview ? 'Ganti Thumbnail' : 'Upload Thumbnail'}
                                </Label>

                                {/* Drag and Drop Area */}
                                <div
                                    className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all duration-200 hover:bg-gray-50 ${
                                        isThumbnailDragOver
                                            ? 'border-blue-400 bg-blue-50'
                                            : thumbnailError
                                              ? 'border-red-300 bg-red-50'
                                              : 'border-gray-300'
                                    }`}
                                    onDragOver={handleThumbnailDragOver}
                                    onDragLeave={handleThumbnailDragLeave}
                                    onDrop={handleThumbnailDrop}
                                    onClick={triggerThumbnailInput}
                                >
                                    <div className="space-y-3 text-center">
                                        <div className="mx-auto">
                                            {isThumbnailDragOver ? (
                                                <Upload className="h-10 w-10 animate-bounce text-blue-500" />
                                            ) : (
                                                <ImageIcon className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {isThumbnailDragOver ? 'Lepaskan file di sini' : 'Drag & drop thumbnail atau klik untuk pilih file'}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">Format: JPEG, PNG, JPG, GIF, WebP • Maksimal 2MB</p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                triggerThumbnailInput();
                                            }}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Pilih File
                                        </Button>
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleThumbnailChange}
                                    className="hidden"
                                />

                                {/* Error Display */}
                                <InputError message={errors.thumbnail || thumbnailError || undefined} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
