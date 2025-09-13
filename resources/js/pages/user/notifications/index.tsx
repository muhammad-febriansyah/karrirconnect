import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Bell, 
    BellRing, 
    Check, 
    CheckCheck, 
    ArrowLeft, 
    Calendar,
    User,
    Briefcase,
    Building,
    AlertCircle,
    Info,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import ModernNavbar from '@/components/modern-navbar';
import ModernFooter from '@/components/modern-footer';
import { toast } from 'sonner';

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
                'X-Requested-With': 'XMLHttpRequest'
            }
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
            info: { color: 'bg-gray-100 text-gray-800', label: 'Info' }
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
                minute: '2-digit' 
            });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString('id-ID', { 
                weekday: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return date.toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
        }
    };

    const markAsRead = async (notificationId: number) => {
        setLoadingActions(prev => ({ ...prev, [notificationId]: true }));
        
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
            setLoadingActions(prev => ({ ...prev, [notificationId]: false }));
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

    const unreadCount = notifications.data.filter(n => !n.read_at).length;

    return (
        <>
            <Head title="Notifikasi" />
            
            <div className="min-h-screen bg-gray-50">
                <ModernNavbar />
                
                <main className="pt-20 pb-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8">
                            <Link 
                                href="/user/dashboard"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Dashboard
                            </Link>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <BellRing className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
                                            <p className="text-gray-600 mt-1">
                                                {unreadCount > 0 
                                                    ? `${unreadCount} notifikasi belum dibaca dari ${notifications.total} total`
                                                    : `${notifications.total} notifikasi`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {unreadCount > 0 && (
                                    <Button 
                                        onClick={markAllAsRead}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        Tandai Semua Sudah Dibaca
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
                                        <Card className={`transition-all duration-200 hover:shadow-md ${
                                            !notification.read_at 
                                                ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                                                : 'bg-white border-gray-200'
                                        }`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 mt-1">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h3 className={`font-semibold text-lg ${
                                                                        !notification.read_at ? 'text-gray-900' : 'text-gray-700'
                                                                    }`}>
                                                                        {notification.title}
                                                                    </h3>
                                                                    {!notification.read_at && (
                                                                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                                                    )}
                                                                </div>
                                                                
                                                                <p className="text-gray-600 mb-3 leading-relaxed">
                                                                    {notification.message}
                                                                </p>
                                                                
                                                                <div className="flex items-center gap-3">
                                                                    {getNotificationBadge(notification.type)}
                                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                        <Calendar className="h-3 w-3" />
                                                                        {formatDateTime(notification.created_at)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {!notification.read_at && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => markAsRead(notification.id)}
                                                                    disabled={loadingActions[notification.id]}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Check className="h-3 w-3" />
                                                                    {loadingActions[notification.id] ? 'Memproses...' : 'Tandai Dibaca'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        Tidak Ada Notifikasi
                                    </h3>
                                    <p className="text-gray-500">
                                        Anda belum memiliki notifikasi apa pun.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Pagination */}
                        {notifications.total > 20 && (
                            <div className="mt-8 flex justify-center">
                                <div className="flex items-center gap-2">
                                    {notifications.links.map((link: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                
                <ModernFooter />
            </div>
        </>
    );
}