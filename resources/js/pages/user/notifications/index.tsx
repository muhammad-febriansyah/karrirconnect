// import ModernFooter from '@/components/modern-footer';
// import ModernNavbar from '@/components/modern-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Bell, BellRing, Briefcase, Building, Calendar, Check, CheckCheck, CheckCircle, Info, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import MainLayout from '@/layouts/main-layout';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'job_application' | 'system';
    target_roles: string[];
    read_at: string | null;
    created_at: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    action_url: string | null;
    is_global: boolean;
    data: any;
}

interface NotificationsIndexProps {
    notifications: {
        data: Notification[];
        links: any;
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function NotificationsIndex({ notifications }: NotificationsIndexProps) {
    const [loadingActions, setLoadingActions] = useState<{ [key: number]: boolean }>({});
    const { props } = usePage<any>();

    // Helper function untuk API calls dengan CSRF token
    const apiCall = async (url: string, method: 'get' | 'post' | 'put' | 'delete' = 'post', data?: any) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        return await axios({
            method,
            url,
            data,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            case 'job_application':
                return <Briefcase className="h-5 w-5 text-blue-500" />;
            case 'system':
                return <Building className="h-5 w-5 text-purple-500" />;
            default:
                return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    const getNotificationBadge = (type: string) => {
        const badges = {
            success: { color: 'bg-green-100 text-green-800', label: 'Sukses' },
            error: { color: 'bg-red-100 text-red-800', label: 'Error' },
            warning: { color: 'bg-yellow-100 text-yellow-800', label: 'Peringatan' },
            job_application: { color: 'bg-blue-100 text-blue-800', label: 'Lamaran Kerja' },
            system: { color: 'bg-purple-100 text-purple-800', label: 'Sistem' },
            info: { color: 'bg-gray-100 text-gray-800', label: 'Info' },
        };

        const badge = badges[type as keyof typeof badges] || badges.info;
        return <Badge className={`text-xs ${badge.color}`}>{badge.label}</Badge>;
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString('id-ID', {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });
        } else {
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });
        }
    };

    const markAsRead = async (notificationId: number) => {
        setLoadingActions((prev) => ({ ...prev, [notificationId]: true }));

        try {
            const response = await apiCall(`/user/notifications/${notificationId}/mark-as-read`);

            if (response.data.success) {
                toast.success('Notifikasi ditandai sebagai sudah dibaca');
                // Refresh halaman untuk update status
                window.location.reload();
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Gagal menandai notifikasi sebagai sudah dibaca');
        } finally {
            setLoadingActions((prev) => ({ ...prev, [notificationId]: false }));
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await apiCall('/user/notifications/mark-all-as-read');

            if (response.data.success) {
                toast.success('Semua notifikasi ditandai sebagai sudah dibaca');
                // Refresh halaman untuk update status
                window.location.reload();
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Gagal menandai semua notifikasi sebagai sudah dibaca');
        }
    };

    const unreadCount = notifications.data.filter((n) => !n.read_at).length;

    return (
        <MainLayout currentPage="notifications">
            <Head title="Notifikasi" />

                <main className="pt-20 pb-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <Link
                                href={route('user.dashboard')}
                                className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 sm:text-base"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Dashboard
                            </Link>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <BellRing className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Notifikasi</h1>
                                        <p className="mt-1 text-sm text-gray-600 sm:text-base">
                                            {unreadCount > 0
                                                ? `${unreadCount} belum dibaca dari ${notifications.total} total`
                                                : `${notifications.total} notifikasi`}
                                        </p>
                                    </div>
                                </div>

                                {unreadCount > 0 && (
                                    <Button onClick={markAllAsRead} variant="outline" size="sm" className="flex w-full items-center gap-2 sm:w-auto">
                                        <CheckCheck className="h-4 w-4" />
                                        <span className="hidden sm:inline">Tandai Semua Sudah Dibaca</span>
                                        <span className="sm:hidden">Tandai Semua</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-4">
                            {notifications.data.length > 0 ? (
                                notifications.data.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card
                                            className={`transition-all duration-200 hover:shadow-md ${
                                                !notification.read_at ? 'border-blue-200 bg-blue-50/50 shadow-sm' : 'border-gray-200 bg-white'
                                            }`}
                                        >
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex items-start gap-3 sm:gap-4">
                                                    <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="space-y-3">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="mb-2 flex items-center gap-2">
                                                                        <h3
                                                                            className={`text-base font-semibold sm:text-lg ${
                                                                                !notification.read_at ? 'text-gray-900' : 'text-gray-700'
                                                                            } line-clamp-2`}
                                                                        >
                                                                            {notification.title}
                                                                        </h3>
                                                                        {!notification.read_at && (
                                                                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {!notification.read_at && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                        disabled={loadingActions[notification.id]}
                                                                        className="flex h-auto min-w-0 flex-shrink-0 items-center gap-1 px-2 py-1 text-xs"
                                                                    >
                                                                        <Check className="h-3 w-3" />
                                                                        <span className="hidden sm:inline">
                                                                            {loadingActions[notification.id] ? 'Memproses...' : 'Tandai Dibaca'}
                                                                        </span>
                                                                        <span className="sm:hidden">
                                                                            {loadingActions[notification.id] ? '...' : 'Baca'}
                                                                        </span>
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                                                                {notification.message}
                                                            </p>

                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                                                {getNotificationBadge(notification.type)}
                                                                <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {formatDateTime(notification.created_at)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-12 text-center sm:py-16">
                                    <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300 sm:h-16 sm:w-16" />
                                    <h3 className="mb-2 text-lg font-semibold text-gray-600 sm:text-xl">Tidak Ada Notifikasi</h3>
                                    <p className="mx-auto max-w-md text-sm text-gray-500 sm:text-base">Anda belum memiliki notifikasi apa pun.</p>
                                </motion.div>
                            )}
                        </div>

                        {/* Pagination */}
                        {notifications.total > 20 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex items-center gap-1 overflow-x-auto px-4 sm:gap-2 sm:px-0">
                                    {notifications.links.map((link: any, index: number) => {
                                        const commonClass = `px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                                            link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`;

                                        // Some paginator links have null URL (e.g., ellipsis or disabled prev/next).
                                        // Render them as plain text to avoid Inertia Link errors.
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className={`${commonClass} cursor-not-allowed opacity-50`}
                                                    // label may contain HTML entities from Laravel paginator
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={commonClass}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

            </MainLayout>
    );
}