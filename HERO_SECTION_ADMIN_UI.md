# Hero Section - Admin UI Component

Tambahkan section berikut di file `resources/js/pages/admin/settings/edit.tsx` sebelum Submit Button (sebelum line `{/* Submit Button */}`).

## Lokasi: Sebelum line 1083

```tsx
                    {/* Hero Section Homepage */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Hero Section Homepage
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                                Gambar dan teks yang tampil di bagian hero section halaman utama (berbeda dari thumbnail untuk login/register)
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Hero Image Display */}
                            {setting.hero_image && !heroImagePreview && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">Hero Image Saat Ini</Label>
                                    <br />
                                    <br />
                                    <div className="relative inline-block">
                                        <div className="flex h-48 w-64 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                                            <img
                                                src={`/storage/${setting.hero_image}`}
                                                alt="Hero Image Saat Ini"
                                                className="max-h-full max-w-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Aktif</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hero Image Preview */}
                            {heroImagePreview && (
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-gray-700">Preview Hero Image Baru</Label>
                                    <br />
                                    <br />
                                    <div className="relative inline-block">
                                        <div className="flex h-48 w-64 items-center justify-center overflow-hidden rounded-lg border-2 border-green-200 bg-green-50 shadow-sm">
                                            <img src={heroImagePreview} alt="Preview Hero Image" className="max-h-full max-w-full object-cover" />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-md transition-transform hover:scale-110"
                                            onClick={removeHeroImagePreview}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                        <div className="absolute bottom-2 left-2">
                                            <div className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">Preview</div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <p className="text-sm font-medium text-green-700">Hero Image siap diupload</p>
                                        </div>
                                        <p className="mt-1 text-xs text-green-600">Klik "Simpan Pengaturan" untuk menyimpan perubahan.</p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Section */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700">
                                    {setting.hero_image || heroImagePreview ? 'Ganti Hero Image' : 'Upload Hero Image'}
                                </Label>

                                {/* Drag and Drop Area */}
                                <div
                                    className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all duration-200 hover:bg-gray-50 ${
                                        isHeroImageDragOver
                                            ? 'border-blue-400 bg-blue-50'
                                            : heroImageError
                                              ? 'border-red-300 bg-red-50'
                                              : 'border-gray-300'
                                    }`}
                                    onDragOver={handleHeroImageDragOver}
                                    onDragLeave={handleHeroImageDragLeave}
                                    onDrop={handleHeroImageDrop}
                                    onClick={triggerHeroImageInput}
                                >
                                    <div className="space-y-3 text-center">
                                        <div className="mx-auto">
                                            {isHeroImageDragOver ? (
                                                <Upload className="h-10 w-10 animate-bounce text-blue-500" />
                                            ) : (
                                                <ImageIcon className="h-10 w-10 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {isHeroImageDragOver ? 'Lepaskan file di sini' : 'Drag & drop hero image atau klik untuk pilih file'}
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
                                                triggerHeroImageInput();
                                            }}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Pilih File
                                        </Button>
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={heroImageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleHeroImageChange}
                                    className="hidden"
                                />

                                {/* Error Display */}
                                <InputError message={errors.hero_image || heroImageError || undefined} />
                            </div>

                            {/* Hero Title and Subtitle */}
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="hero_title">Hero Title (Opsional)</Label>
                                    <Input
                                        id="hero_title"
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        placeholder="Contoh: Temukan Karir Impian Anda"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Jika kosong, akan menggunakan default dari sistem
                                    </p>
                                    <InputError message={errors.hero_title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hero_subtitle">Hero Subtitle (Opsional)</Label>
                                    <Textarea
                                        id="hero_subtitle"
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        placeholder="Contoh: Platform karir terpercaya yang menghubungkan talenta dengan peluang terbaik"
                                        rows={3}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Jika kosong, akan menggunakan default dari sistem
                                    </p>
                                    <InputError message={errors.hero_subtitle} />
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Info:</strong> Hero image akan tampil di sebelah kanan hero section halaman utama.
                                    Sedangkan thumbnail untuk login/register tetap terpisah.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
```

## Handler Functions

Tambahkan fungsi-fungsi handler berikut di dalam component (setelah favicon handlers, sekitar line 340):

```tsx
    // Hero Image handlers
    const triggerHeroImageInput = () => {
        heroImageInputRef.current?.click();
    };

    const processHeroImageFile = (file: File) => {
        const error = validateFile(file);
        setHeroImageError(error);

        if (error) {
            toast.error('File Hero Image Tidak Valid', {
                description: error,
                duration: 4000,
            });
            return;
        }

        setData('hero_image', file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setHeroImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        toast.success('Hero Image Siap Diupload', {
            description: `File ${file.name} telah dipilih. Klik "Simpan Pengaturan" untuk menyimpan.`,
            duration: 3000,
        });
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processHeroImageFile(file);
        } else {
            setData('hero_image', null);
            setHeroImagePreview(null);
            setHeroImageError(null);
        }
    };

    const handleHeroImageDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHeroImageDragOver(true);
    };

    const handleHeroImageDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHeroImageDragOver(false);
    };

    const handleHeroImageDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsHeroImageDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processHeroImageFile(files[0]);
        }
    };

    const removeHeroImagePreview = () => {
        setData('hero_image', null);
        setHeroImagePreview(null);
        setHeroImageError(null);
        if (heroImageInputRef.current) {
            heroImageInputRef.current.value = '';
        }

        toast.info('Hero Image Dihapus', {
            description: 'Preview hero image telah dihapus. Pilih file baru untuk mengupload hero image.',
            duration: 3000,
        });
    };
```

## Testing

1. Login sebagai admin
2. Pergi ke `/admin/settings`
3. Scroll ke section "Hero Section Homepage"
4. Upload gambar untuk hero section
5. (Opsional) Isi hero title dan subtitle custom
6. Klik "Simpan Pengaturan"
7. Kunjungi homepage `http://127.0.0.1:8000/`
8. Hero image akan muncul di sebelah kanan hero section
