import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, BellRing, Check, CheckCheck, CheckCircle, Info, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string | null;
};

interface Props {
  notifications: NotificationItem[];
  unread_count: number;
}

const iconFor = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'system':
      return <Info className="h-5 w-5 text-purple-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const priorityBadge = (priority: Props['notifications'][number]['priority']) => {
  const mapping: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return <Badge className={`text-xs ${mapping[priority] || mapping.medium}`}>{priority}</Badge>;
};

export default function AdminNotificationsIndex({ notifications, unread_count }: Props) {
  const [items, setItems] = useState<NotificationItem[]>(notifications || []);

  useEffect(() => setItems(notifications || []), [notifications]);

  const markAsRead = async (id: number) => {
    router.post(route('admin.notifications.mark-as-read', id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        toast.success('Notifikasi ditandai telah dibaca');
      },
      onError: () => toast.error('Gagal menandai notifikasi'),
    });
  };

  const markAll = async () => {
    router.post(route('admin.notifications.mark-all-as-read'), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setItems(prev => prev.map(n => ({ ...n, read: true })));
        toast.success('Semua notifikasi telah dibaca');
      },
      onError: () => toast.error('Gagal menandai semua notifikasi'),
    });
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const unread = items.filter(n => !n.read).length;

  return (
    <AppLayout>
      <Head title="Notifikasi" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BellRing className="h-6 w-6 text-[#2347FA]" />
            <div>
              <h1 className="text-2xl font-bold">Notifikasi</h1>
              <p className="text-gray-600">{unread > 0 ? `${unread} belum dibaca` : 'Semua notifikasi telah dibaca'}</p>
            </div>
          </div>
          {unread > 0 && (
            <Button onClick={markAll} variant="outline" className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4" /> Tandai semua dibaca
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-gray-500">Tidak ada notifikasi.</CardContent>
            </Card>
          ) : (
            items.map((n) => (
              <Card key={n.id} className={`transition ${!n.read ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{iconFor(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h3>
                          {priorityBadge(n.priority)}
                        </div>
                        <div className="text-xs text-gray-500">{formatTime(n.time)}</div>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{n.message}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {n.action_url && (
                          <Button asChild size="sm" variant="outline">
                            <Link href={n.action_url}>Lihat Detail</Link>
                          </Button>
                        )}
                        {!n.read && (
                          <Button size="sm" onClick={() => markAsRead(n.id)}>
                            <Check className="h-4 w-4 mr-1" /> Tandai Dibaca
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

