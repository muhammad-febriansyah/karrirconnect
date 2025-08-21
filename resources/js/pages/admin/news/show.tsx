import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Edit, Eye, Image as ImageIcon, User } from 'lucide-react';

interface Author {
    id: number;
    name: string;
    email: string;
}

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    category?: string;
    tags?: string[];
    is_featured?: boolean;
    views_count?: number;
    reading_time?: number;
    comments_count?: number;
    status: 'draft' | 'published';
    published_at?: string;
    created_at: string;
    updated_at: string;
    author: Author;
    featured_image?: string;
}

interface ShowNewsProps {
    news: NewsItem;
}

const breadcrumbs = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Berita', href: '/admin/news' },
    { title: 'Lihat Berita', href: '#' },
];

export default function ShowNews({ news }: ShowNewsProps) {
    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={news.title} />

            <div className="min-h-screen bg-gray-50/50">
                <div className="border-b bg-white">
                    <div className="mx-auto px-6 py-6">
                        <div className="mb-6 flex items-center justify-between">
                            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                                <Link href={route('admin.news.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Daftar Berita
                                </Link>
                            </Button>
                            <div className="flex gap-2">
                                <Button size="sm" asChild>
                                    <Link href={route('admin.news.edit', news.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Berita
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Article Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Badge variant={news.status === 'published' ? 'default' : 'secondary'} className="px-3 py-1 text-xs">
                                    {news.status === 'published' ? (
                                        <>
                                            <Eye className="mr-1 h-3 w-3" />
                                            Dipublikasi
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="mr-1 h-3 w-3" />
                                            Draft
                                        </>
                                    )}
                                </Badge>
                                {news.status === 'published' && (
                                    <span className="text-xs text-muted-foreground">Dipublikasi pada {formatDateShort(news.published_at!)}</span>
                                )}
                            </div>

                            <h1 className="pr-8 text-4xl leading-tight font-bold text-gray-900">{news.title}</h1>

                            <p className="text-xl leading-relaxed text-muted-foreground">{news.excerpt}</p>

                            {/* Author & Meta Info */}
                            <div className="flex items-center gap-6 border-t pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                                        {news.author.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{news.author.name}</div>
                                        <div className="text-sm text-muted-foreground">Penulis</div>
                                    </div>
                                </div>

                                <Separator orientation="vertical" className="h-12" />

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <div className="text-sm">
                                        <div>{formatDateShort(news.published_at || news.created_at)}</div>
                                        <div className="text-xs">{news.published_at ? 'Dipublikasi' : 'Dibuat'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
                    {/* Featured Image */}
                    {news.featured_image ? (
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                            <img src={`/storage/${news.featured_image}`} alt={news.title} className="h-auto max-h-[500px] w-full object-cover" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    ) : (
                        <div className="relative flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-center">
                                <ImageIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                <p className="font-medium text-gray-500">Tidak ada gambar unggulan</p>
                                <p className="text-sm text-gray-400">Gambar akan ditampilkan di sini</p>
                            </div>
                        </div>
                    )}

                    {/* Article Content */}
                    <Card className="overflow-hidden">
                        <CardContent className="p-8">
                            <div className="prose prose-lg prose-gray max-w-none">
                                <div className="space-y-6 leading-relaxed text-gray-700">
                                    {news.content
                                        .split('\n')
                                        .filter((paragraph) => paragraph.trim())
                                        .map((paragraph, index) => (
                                            <p key={index} className="text-base leading-7">
                                                {paragraph}
                                            </p>
                                        ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Publication Info */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Informasi Penulis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                                        {news.author.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{news.author.name}</div>
                                        <div className="text-sm text-muted-foreground">{news.author.email}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                    Informasi Publikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <Badge variant={news.status === 'published' ? 'default' : 'secondary'}>
                                            {news.status === 'published' ? 'Dipublikasi' : 'Draft'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-600">Dibuat:</span>
                                        <span className="text-sm text-gray-900">{formatDateShort(news.created_at)}</span>
                                    </div>

                                    {news.published_at ? (
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Dipublikasi:</span>
                                            <span className="text-sm text-gray-900">{formatDateShort(news.published_at)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium text-gray-600">Diperbarui:</span>
                                            <span className="text-sm text-gray-900">{formatDateShort(news.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="mb-1 font-semibold text-gray-900">Kelola Berita</h3>
                                    <p className="text-sm text-gray-600">Edit konten atau kembali ke daftar berita</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" asChild>
                                        <Link href={route('admin.news.index')}>
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('admin.news.edit', news.id)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Berita
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
