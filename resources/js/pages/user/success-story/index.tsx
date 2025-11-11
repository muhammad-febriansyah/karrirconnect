import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/main-layout';
import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    MapPin,
    Plus,
    Star,
    TrendingUp,
    Trophy,
    Users,
    XCircle,
} from 'lucide-react';

type SuccessStory = {
    id: number;
    name: string;
    position: string;
    company: string;
    story: string;
    location?: string | null;
    experience_years?: number | null;
    salary_increase_percentage?: number | null;
    avatar_url?: string | null;
    created_at?: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

interface PaginatedSuccessStories {
    data: SuccessStory[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface SuccessStoryIndexProps {
    successStories: PaginatedSuccessStories;
    stats: {
        total_submissions: number;
        published_stories: number;
        featured_stories: number;
    };
}

const formatNumber = (value?: number) => (value ?? 0).toLocaleString('id-ID');

const formatDate = (value?: string) => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const getPaginationLabel = (label: string) => {
    if (label.includes('&laquo;')) return 'Sebelumnya';
    if (label.includes('&raquo;')) return 'Berikutnya';
    const sanitized = label.replace(/&[^;]+;/g, '').trim();
    return sanitized || '...';
};

const getInitials = (name?: string) => {
    if (!name) return 'K';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
};

const SuccessStoryCard = ({ story }: { story: SuccessStory }) => {
    return (
        <Card className="flex h-full flex-col border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl">
            <CardHeader className="flex flex-row items-start gap-4 border-b border-gray-100 pb-4">
                <Avatar className="h-12 w-12">
                    {story.avatar_url ? <AvatarImage src={story.avatar_url} alt={story.name} /> : null}
                    <AvatarFallback className="bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white">
                        {getInitials(story.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">{story.name}</CardTitle>
                    <p className="text-sm text-gray-600">{story.position}</p>
                    <p className="text-sm text-gray-500">{story.company}</p>
                </div>
                {story.salary_increase_percentage ? (
                    <Badge className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        +{story.salary_increase_percentage}%
                    </Badge>
                ) : null}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 pt-4">
                <p className="text-sm leading-relaxed text-gray-700 line-clamp-4">&ldquo;{story.story}&rdquo;</p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {story.location ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                            <MapPin className="h-3 w-3" />
                            {story.location}
                        </span>
                    ) : null}

                    {story.experience_years !== null && story.experience_years !== undefined ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                            <Briefcase className="h-3 w-3" />
                            {story.experience_years} th pengalaman
                        </span>
                    ) : null}
                </div>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <span>Dipublikasikan {formatDate(story.created_at)}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-[#2347FA]">
                        <Star className="h-3 w-3 fill-current" />
                        Inspiratif
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default function SuccessStoryIndex({ successStories, stats }: SuccessStoryIndexProps) {
    const stories = successStories?.data ?? [];
    const paginationLinks = successStories?.links ?? [];

    const statCards = [
        {
            label: 'Total Pengajuan',
            value: formatNumber(stats?.total_submissions),
            description: 'Kisah yang telah dibagikan',
            icon: Users,
        },
        {
            label: 'Telah Dipublikasikan',
            value: formatNumber(stats?.published_stories),
            description: 'Kisah yang sudah tayang',
            icon: CheckCircle,
        },
        {
            label: 'Kisah Unggulan',
            value: formatNumber(stats?.featured_stories),
            description: 'Dipilih tim KarirConnect',
            icon: Star,
        },
    ];

    return (
        <MainLayout currentPage="success-stories">
            <Head title="Kisah Sukses" />

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <section className="space-y-8 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2347FA] to-[#3b56fc] text-white sm:h-20 sm:w-20">
                            <Star className="h-8 w-8 sm:h-10 sm:w-10" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Kisah Sukses</h1>
                            <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
                                Bergabunglah dengan ribuan profesional yang telah mentransformasi karir mereka dan meraih impian bersama
                                KarirConnect.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {statCards.map((item) => (
                                <Card key={item.label} className="border border-gray-100 shadow-sm">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-[#2347FA]">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500">{item.label}</p>
                                            <p className="text-xl font-semibold text-gray-900">{item.value}</p>
                                            <p className="text-xs text-gray-500">{item.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Success story cards */}
                    <section className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-gray-900">Cerita Terbaru</h2>
                                <p className="text-sm text-gray-600 sm:text-base">
                                    Lihat bagaimana komunitas KarirConnect menaklukkan tantangan karir dan meraih pencapaian baru.
                                </p>
                            </div>
                            <Button asChild size="lg" className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white">
                                <Link href="/user/success-stories/create" className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    Bagikan Kisah Anda
                                </Link>
                            </Button>
                        </div>

                        {stories.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {stories.map((story) => (
                                    <SuccessStoryCard key={story.id} story={story} />
                                ))}
                            </div>
                        ) : (
                            <Card className="border border-dashed">
                                <CardContent className="flex flex-col items-center space-y-4 p-10 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-gray-900">Belum ada kisah sukses</h3>
                                        <p className="text-sm text-gray-600">
                                            Jadilah yang pertama berbagi pengalaman dan inspirasi untuk komunitas KarirConnect.
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <Link href="/user/success-stories/create">Tulis Kisah Pertama</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {stories.length > 0 && paginationLinks.length > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {paginationLinks.map((link, index) => (
                                    <Button
                                        key={`${link.label}-${index}`}
                                        asChild={Boolean(link.url)}
                                        variant={link.active ? 'default' : 'outline'}
                                        className={`rounded-full px-4 py-2 text-sm ${
                                            link.active
                                                ? 'bg-gradient-to-r from-[#2347FA] to-[#3b56fc] text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-[#2347FA]/40 hover:text-[#2347FA]'
                                        }`}
                                        disabled={!link.url}
                                    >
                                        {link.url ? <Link href={link.url}>{getPaginationLabel(link.label)}</Link> : <span>{getPaginationLabel(link.label)}</span>}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* CTA Section */}
                    <section>
                        <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardContent className="space-y-6 p-6 sm:p-8">
                                <div className="space-y-3 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Bagikan Kisah Sukses Anda</h2>
                                    <p className="text-sm text-gray-600 sm:text-base">
                                        Inspirasi jutaan pencari kerja lainnya dengan menceritakan perjalanan karir Anda bersama KarirConnect.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <Trophy className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Inspirasi Orang Lain</h3>
                                        <p className="text-sm text-gray-600">Cerita Anda dapat memotivasi pencari kerja lain untuk tidak menyerah.</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Tingkatkan Visibilitas</h3>
                                        <p className="text-sm text-gray-600">Kisah sukses dapat meningkatkan profil profesional Anda.</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/80 p-4 text-center shadow-sm">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Bangun Jaringan</h3>
                                        <p className="text-sm text-gray-600">Terhubung dengan profesional lain yang memiliki pengalaman serupa.</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Button size="lg" className="bg-gradient-to-r from-[#2347FA] to-[#3b56fc]" asChild>
                                        <Link href="/user/success-stories/create" className="flex items-center gap-2">
                                            <Plus className="h-5 w-5" />
                                            Mulai Menulis Kisah Anda
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* How it works */}
                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-2xl text-gray-900">Bagaimana Cara Kerjanya?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    {[
                                        {
                                            step: '1',
                                            title: 'Tulis Kisah Anda',
                                            description: 'Ceritakan perjalanan karir Anda, tantangan yang dihadapi, dan bagaimana KarirConnect membantu.',
                                        },
                                        {
                                            step: '2',
                                            title: 'Review Tim',
                                            description: 'Tim kami meninjau kisah Anda untuk memastikan kualitas dan kesesuaian konten.',
                                        },
                                        {
                                            step: '3',
                                            title: 'Terbitkan & Inspirasi',
                                            description: 'Kisah Anda akan dipublikasikan dan menginspirasi ribuan pencari kerja lainnya.',
                                        },
                                    ].map((item) => (
                                        <div key={item.step} className="rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2347FA]/10 text-[#2347FA]">
                                                <span className="text-lg font-bold">{item.step}</span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Guidelines */}
                    <section>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Panduan Menulis Kisah Sukses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-green-600">Yang Sebaiknya Dilakukan</h4>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            {[
                                                'Ceritakan pengalaman nyata dan autentik.',
                                                'Sertakan tantangan dan bagaimana Anda mengatasinya.',
                                                'Jelaskan peran KarirConnect dalam perjalanan Anda.',
                                                'Gunakan bahasa profesional namun tetap personal.',
                                                'Berikan tips untuk pencari kerja lain.',
                                            ].map((text) => (
                                                <li key={text} className="flex items-start gap-2">
                                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                                    <span>{text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-red-500">Yang Sebaiknya Dihindari</h4>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            {[
                                                'Membuat cerita yang tidak benar.',
                                                'Menggunakan bahasa yang tidak sopan.',
                                                'Menyebutkan informasi sensitif perusahaan.',
                                                'Membuat konten promosi berlebihan.',
                                                'Mengunggah foto yang tidak pantas.',
                                            ].map((text) => (
                                                <li key={text} className="flex items-start gap-2">
                                                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                                                    <span>{text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Final CTA */}
                    <section className="rounded-3xl bg-gradient-to-r from-[#2347FA] to-[#3b56fc] px-6 py-10 text-center text-white sm:px-12">
                        <h3 className="text-2xl font-bold sm:text-3xl">Siap Berbagi Kisah Sukses Anda?</h3>
                        <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                            Jadilah bagian dari komunitas profesional yang saling menginspirasi. Kisah Anda mungkin adalah motivasi yang
                            dibutuhkan seseorang untuk tidak menyerah.
                        </p>
                        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button size="lg" className="bg-white text-[#2347FA] hover:bg-white/90" asChild>
                                <Link href="/user/success-stories/create" className="flex items-center gap-2">
                                    Mulai Menulis Kisah Anda
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </MainLayout>
    );
}
