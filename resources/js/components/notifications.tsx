import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, FileText, UserPlus, Users, AlertTriangle, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Notification {
    id: string;
    type: 'user' | 'company' | 'application' | 'system' | 'finance' | 'content';
    title: string;
    message: string;
    time: Date;
    read: boolean;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    action_url?: string;
}

interface NotificationData {
    notifications: Notification[];
    unread_count: number;
}

const getNotificationIcon = (type: string, priority?: string) => {
    const iconColor = priority === 'urgent' ? 'text-red-500' : 
                     priority === 'high' ? 'text-orange-500' :
                     priority === 'medium' ? 'text-yellow-500' : 'text-gray-500';
    
    switch (type) {
        case 'user':
            return <UserPlus className={`h-4 w-4 ${priority === 'urgent' ? 'text-red-500' : 'text-blue-500'}`} />;
        case 'company':
            return <Users className={`h-4 w-4 ${priority === 'urgent' ? 'text-red-500' : 'text-green-500'}`} />;
        case 'application':
            return <FileText className={`h-4 w-4 ${priority === 'urgent' ? 'text-red-500' : 'text-orange-500'}`} />;
        case 'system':
            return <CheckCircle className={`h-4 w-4 ${priority === 'urgent' ? 'text-red-500' : 'text-purple-500'}`} />;
        case 'finance':
            return <Shield className={`h-4 w-4 ${iconColor}`} />;
        case 'content':
            return <FileText className={`h-4 w-4 ${iconColor}`} />;
        default:
            return <Bell className={`h-4 w-4 ${iconColor}`} />;
    }
};

const getPriorityBadge = (priority?: string) => {
    switch (priority) {
        case 'urgent':
            return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
        case 'high':
            return <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">High</Badge>;
        case 'medium':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge>;
        case 'low':
            return <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">Low</Badge>;
        default:
            return null;
    }
};

export function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch notifications based on user role
    const fetchNotifications = async () => {
        try {
            const response = await fetch('/admin/notifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            if (response.ok) {
                const data: NotificationData = await response.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId: string) => {
        try {
            const response = await fetch(`/admin/notifications/${notificationId}/mark-as-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            if (response.ok) {
                // Update local state
                setNotifications(prev => 
                    prev.map(notification => 
                        notification.id === notificationId 
                            ? { ...notification, read: true }
                            : notification
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const response = await fetch('/admin/notifications/mark-all-as-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            
            if (response.ok) {
                setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification: Notification) => {
        // Mark as read if not already
        if (!notification.read) {
            markAsRead(notification.id);
        }
        
        // Navigate to action URL if available
        if (notification.action_url) {
            router.visit(notification.action_url);
        }
    };

    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
        
        // Set up polling for real-time updates (every 30 seconds)
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikasi</span>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {unreadCount} baru
                            </Badge>
                        )}
                        {unreadCount > 0 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs h-6 px-2"
                                onClick={markAllAsRead}
                            >
                                Tandai Semua
                            </Button>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Memuat notifikasi...
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div key={notification.id}>
                                <DropdownMenuItem 
                                    className="flex items-start gap-3 p-4 cursor-pointer"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="mt-1">
                                        {getNotificationIcon(notification.type, notification.priority)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {notification.title}
                                                </p>
                                                {notification.priority && notification.priority !== 'medium' && (
                                                    getPriorityBadge(notification.priority)
                                                )}
                                            </div>
                                            {!notification.read && (
                                                <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(notification.time), { 
                                                addSuffix: true
                                            })}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                                {index < notifications.length - 1 && <DropdownMenuSeparator />}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Tidak ada notifikasi
                        </div>
                    )}
                </ScrollArea>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-center">
                    <Button variant="ghost" size="sm" className="w-full">
                        Lihat Semua Notifikasi
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}