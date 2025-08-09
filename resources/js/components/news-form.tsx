import { AdvancedImageUpload } from '@/components/ui/advanced-image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

interface NewsFormProps {
    news?: {
        id?: number;
        title: string;
        excerpt: string;
        content: string;
        featured_image?: string;
        status: 'draft' | 'published';
        published_at?: string;
    };
    isEdit?: boolean;
}

export function NewsForm({ news, isEdit = false }: NewsFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: news?.title || '',
        excerpt: news?.excerpt || '',
        content: news?.content || '',
        featured_image: null as File | null,
        status: news?.status || 'draft',
        published_at: news?.published_at || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                toast.success(isEdit ? 'Berita berhasil diperbarui!' : 'Berita berhasil dibuat!');
                if (!isEdit) reset();
            },
            onError: (errors: any) => {
                console.error('Validation errors:', errors);
                toast.error('Terjadi kesalahan saat menyimpan berita!');
            },
        };

        if (isEdit && news?.id) {
            // Create FormData manually for PUT request with file upload
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('excerpt', data.excerpt);
            formData.append('content', data.content);
            formData.append('status', data.status);
            if (data.published_at) {
                formData.append('published_at', data.published_at);
            }
            if (data.featured_image) {
                formData.append('featured_image', data.featured_image);
            }
            formData.append('_method', 'PUT');

            router.post(route('admin.news.update', news.id), formData, {
                onSuccess: () => {
                    toast.success('Berita berhasil diperbarui!');
                },
                onError: (errors: any) => {
                    console.error('Validation errors:', errors);
                    toast.error('Terjadi kesalahan saat menyimpan berita!');
                },
            });
        } else {
            // Use post() method for creation
            post(route('admin.news.store'), options);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href={route('admin.news.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Berita
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}</h1>
                    <p className="text-gray-600">{isEdit ? 'Perbarui informasi berita' : 'Buat berita baru untuk website'}</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Berita</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Berita *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul berita..."
                                />
                                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Ringkasan *</Label>
                                <Textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="Masukkan ringkasan berita..."
                                    rows={3}
                                />
                                {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Konten *</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Masukkan konten berita..."
                                    rows={10}
                                />
                                {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dedicated Image Upload Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Gambar Unggulan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AdvancedImageUpload
                                value={data.featured_image}
                                onChange={(file) => setData('featured_image', file)}
                                currentImage={news?.featured_image}
                                maxSize={5}
                                acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/jpg']}
                                showProgress={true}
                                minWidth={800}
                                minHeight={600}
                                enableCompression={true}
                            />
                            {errors.featured_image && (
                                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="text-sm font-medium text-red-700">{errors.featured_image}</p>
                                </div>
                            )}
                            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                <p className="text-sm text-blue-700">
                                    <strong>Tips:</strong> Upload gambar berkualitas tinggi (minimal 800x600px) untuk hasil terbaik.
                                    {isEdit && news?.featured_image && <> Jika tidak upload gambar baru, gambar sebelumnya akan tetap digunakan.</>}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Publikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select value={data.status} onValueChange={(value: 'draft' | 'published') => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Dipublikasi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Menyimpan...' : isEdit ? 'Perbarui Berita' : 'Simpan Berita'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                        <Link href={route('admin.news.index')}>Batal</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
