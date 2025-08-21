import AppLayout from '@/layouts/app-layout';
import { NewsForm } from '@/components/news-form';
import { Head } from '@inertiajs/react';

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

interface EditNewsProps {
    news: NewsItem;
}

const breadcrumbs = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Berita', href: '/admin/news' },
    { title: 'Edit Berita', href: '#' },
];

export default function EditNews({ news }: EditNewsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Berita: ${news.title}`} />
            <div className="p-6">
                <NewsForm news={news} isEdit />
            </div>
        </AppLayout>
    );
}