import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ChatNotificationProps {
    currentJobInvitationId?: number;
}

interface MessageNotification {
    id: number;
    title: string;
    message: string;
    action_url: string;
    data: {
        job_invitation_id: number;
        sender_name: string;
    };
}

export default function ChatNotification({ currentJobInvitationId }: ChatNotificationProps) {
    const [lastNotificationCheck, setLastNotificationCheck] = useState<Date>(new Date());
    const [shouldPoll, setShouldPoll] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        // Start polling after a short delay to ensure the app is loaded
        const startPolling = () => {
            interval = setInterval(async () => {
                // Stop polling if disabled
                if (!shouldPoll) {
                    clearInterval(interval);
                    return;
                }

                try {
                    const response = await fetch('/api/v1/notifications/new-messages', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            'Accept': 'application/json',
                        },
                        credentials: 'same-origin', // Include cookies for authentication
                    });

                    if (response.ok) {
                        const data = await response.json();

                        data.notifications?.forEach((notification: MessageNotification) => {
                            // Don't show notification if user is already viewing that chat
                            if (currentJobInvitationId && notification.data.job_invitation_id === currentJobInvitationId) {
                                return;
                            }

                            // Show toast notification
                            toast(notification.title, {
                                description: notification.message,
                                icon: <MessageCircle className="h-4 w-4" />,
                                action: {
                                    label: 'Lihat Chat',
                                    onClick: () => {
                                        router.visit(notification.action_url);
                                    }
                                },
                                duration: 8000, // 8 seconds
                            });
                        });

                        setLastNotificationCheck(new Date());
                    } else if (response.status === 401) {
                        // User not authenticated, stop polling permanently
                        setShouldPoll(false);
                        clearInterval(interval);
                    }
                } catch (error) {
                    // Silently handle errors - no need to log for normal cases
                }
            }, 10000); // Check every 10 seconds
        };

        // Start polling after a delay to ensure app is ready
        const timeout = setTimeout(startPolling, 2000);

        return () => {
            clearTimeout(timeout);
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [currentJobInvitationId, shouldPoll]);

    // This component doesn't render anything visible
    return null;
}