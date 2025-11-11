import ModernFooter from '@/components/modern-footer';
import ModernNavbar from '@/components/modern-navbar';
import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    /** Mengatur item aktif pada navbar */
    currentPage?:
        | 'home'
        | 'jobs'
        | 'companies'
        | 'blog'
        | 'about'
        | 'pasang-lowongan'
        | 'contact'
        | 'privacy-policy'
        | 'terms-of-service'
        | 'success-stories'
        | 'profile';
    /** Optional document title override */
    title?: string;
    className?: string;
}

export default function MainLayout({ children, currentPage = 'home', title, className }: MainLayoutProps) {
    const { settings, statistics } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {title ? <Head title={title} /> : null}
            <ModernNavbar currentPage={currentPage} />
            <main className={clsx('flex-1', className)}>{children}</main>
            <ModernFooter
                siteName={settings?.site_name}
                siteDescription={settings?.description}
                statistics={{
                    total_jobs: statistics?.total_jobs ?? 0,
                    total_companies: statistics?.total_companies ?? 0,
                    total_candidates: statistics?.total_candidates ?? 0,
                }}
                settings={settings}
            />
        </div>
    );
}
