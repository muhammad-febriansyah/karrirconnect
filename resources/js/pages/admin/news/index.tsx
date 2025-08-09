import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Eye, Image as ImageIcon, MoreHorizontal, Pencil, Plus, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Author {
    id: number;
    name: string;
    email: string;
}

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    status: 'draft' | 'published';
    published_at?: string;
    created_at: string;
    updated_at: string;
    author: Author;
    featured_image?: string;
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface NewsIndexProps {
    news: {
        data: NewsItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    filters: {
        search: string;
        status: string;
    };
}

const breadcrumbs = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Berita', href: '/admin/news' },
];

export default function NewsIndex({ news, filters }: NewsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');

    const handleSearch = () => {
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (status !== 'all') params.status = status;

        router.get('/admin/news', params);
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get('/admin/news');
    };

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) {
            router.delete(route('admin.news.destroy', id), {
                onSuccess: () => {
                    toast.success('Berita berhasil dihapus!');
                },
                onError: () => {
                    toast.error('Gagal menghapus berita!');
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Berita" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Berita</h1>
                        <p className="text-gray-600">Kelola berita dan artikel untuk website</p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.news.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Berita
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="relative">
                                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari berita..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="published">Dipublikasi</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button onClick={handleSearch} className="flex-1">
                                    Cari
                                </Button>
                                <Button variant="outline" onClick={clearFilters}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* News Grid */}
                {news.data.length > 0 ? (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {news.data.map((item) => (
                                <div className="group overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="relative">
                                        {item.featured_image ? (
                                            <div className="relative h-52 overflow-hidden rounded-t-2xl">
                                                <img
                                                    src={`/storage/${item.featured_image}`}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                                <div className="absolute top-4 left-4">
                                                    <Badge
                                                        variant={item.status === 'published' ? 'default' : 'secondary'}
                                                        className="border-0 px-3 py-1 font-medium shadow-lg backdrop-blur-sm"
                                                    >
                                                        {item.status === 'published' ? '🟢 Dipublikasi' : '🟡 Draft'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex h-52 items-center justify-center rounded-t-2xl border-b bg-gradient-to-br from-gray-50 to-gray-100">
                                                <div className="text-center">
                                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-500">Belum ada gambar</p>
                                                </div>
                                                <div className="absolute top-4 left-4">
                                                    <Badge
                                                        variant={item.status === 'published' ? 'default' : 'secondary'}
                                                        className="border-0 px-3 py-1 font-medium shadow-lg backdrop-blur-sm"
                                                    >
                                                        {item.status === 'published' ? '🟢 Dipublikasi' : '🟡 Draft'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Menu */}
                                        <div className="absolute top-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-10 w-10 border-0 bg-white/90 p-0 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('admin.news.show', item.id)} className="flex items-center">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Lihat Detail
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('admin.news.edit', item.id)} className="flex items-center">
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit Berita
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(item.id, item.title)}
                                                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Hapus Berita
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {/* Title */}
                                            <h3 className="line-clamp-2 text-xl leading-tight font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                                                {item.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{item.excerpt}</p>

                                            {/* Meta Information */}
                                            <div className="space-y-3 border-t border-gray-100 pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                                            <User className="h-3 w-3 text-blue-600" />
                                                        </div>
                                                        <span className="font-medium">{item.author.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                                            <Calendar className="h-3 w-3 text-green-600" />
                                                        </div>
                                                        <span>{item.published_at ? formatDate(item.published_at) : formatDate(item.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    className="flex-1 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <Link href={route('admin.news.show', item.id)}>
                                                        <Eye className="mr-2 h-3 w-3" />
                                                        Lihat
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    asChild
                                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                                                >
                                                    <Link href={route('admin.news.edit', item.id)}>
                                                        <Pencil className="mr-2 h-3 w-3" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {news.last_page > 1 && (
                            <Card>
                                <CardContent className="py-4">
                                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                        <div className="text-sm text-muted-foreground">
                                            Menampilkan {(news.current_page - 1) * news.per_page + 1} hingga{' '}
                                            {Math.min(news.current_page * news.per_page, news.total)} dari {news.total} berita
                                        </div>
                                        <div className="flex gap-1">
                                            {news.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                                    <Search className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">Belum ada berita</h3>
                                <p className="mb-6 text-muted-foreground">Mulai dengan menambah berita pertama untuk ditampilkan di sini.</p>
                                <Button asChild>
                                    <Link href={route('admin.news.create')}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Berita
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
