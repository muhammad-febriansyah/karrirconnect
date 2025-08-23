import React from 'react';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
    const { settings } = usePage<SharedData>().props;
    
    return (
        <div className="min-h-screen bg-gray-50">
            {title && (
                <head>
                    <title>{title} - {settings?.site_name || 'KarirConnect'}</title>
                </head>
            )}
            <main>
                {children}
            </main>
        </div>
    );
}