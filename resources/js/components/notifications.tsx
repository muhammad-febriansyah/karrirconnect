import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, FileText, UserPlus, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    type: 'user' | 'company' | 'application' | 'system';
    title: string;
    message: string;
    time: Date;
    read: boolean;
}

// Mock data - in real app this would come from API/props
const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'user',
        title: 'Pengguna Baru',
        message: 'Ahmad Rizki mendaftar sebagai pencari kerja',
        time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: false,
    },
    {
        id: '2',
        type: 'company',
        title: 'Perusahaan Baru',
        message: 'PT Teknologi Maju mengajukan verifikasi',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
    },
    {
        id: '3',
        type: 'application',
        title: 'Lamaran Baru',
        message: '5 lamaran baru masuk untuk posisi Developer',
        time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: true,
    },
    {
        id: '4',
        type: 'system',
        title: 'Pembaruan Sistem',
        message: 'Sistem berhasil diperbarui ke versi 2.1.0',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
    },
];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'user':
            return <UserPlus className="h-4 w-4 text-blue-500" />;
        case 'company':
            return <Users className="h-4 w-4 text-green-500" />;
        case 'application':
            return <FileText className="h-4 w-4 text-orange-500" />;
        case 'system':
            return <CheckCircle className="h-4 w-4 text-purple-500" />;
        default:
            return <Bell className="h-4 w-4 text-gray-500" />;
    }
};

export function Notifications() {
    const unreadCount = mockNotifications.filter(n => !n.read).length;

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
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {unreadCount} baru
                        </Badge>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <ScrollArea className="h-[300px]">
                    {mockNotifications.length > 0 ? (
                        mockNotifications.map((notification, index) => (
                            <div key={notification.id}>
                                <DropdownMenuItem className="flex items-start gap-3 p-4 cursor-pointer">
                                    <div className="mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {notification.title}
                                            </p>
                                            {!notification.read && (
                                                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(notification.time, { 
                                                addSuffix: true
                                            })}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                                {index < mockNotifications.length - 1 && <DropdownMenuSeparator />}
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