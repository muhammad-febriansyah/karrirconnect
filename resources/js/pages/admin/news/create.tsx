import AppLayout from '@/layouts/app-layout';
import { NewsForm } from '@/components/news-form';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Berita', href: '/admin/news' },
    { title: 'Tambah Berita', href: '/admin/news/create' },
];

export default function CreateNews() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Berita Baru" />
            <div className="p-6">
                <NewsForm />
            </div>
        </AppLayout>
    );
}