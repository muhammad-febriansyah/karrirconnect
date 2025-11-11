<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display user notifications
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        // Get notifications for the user role
        $notifications = Notification::active()
            ->visibleTo($user)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('user/notifications/index', [
            'notifications' => $notifications
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        $user = Auth::user();
        
        // Check if user has permission to access this notification
        if ($notification->isAccessibleBy($user)) {
            $notification->update([
                'read_at' => now()
            ]);

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    /**
     * Mark all notifications as read for the user
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        
        Notification::active()
            ->visibleTo($user)
            ->whereNull('read_at')
            ->update([
                'read_at' => now()
            ]);

        return response()->json(['success' => true]);
    }

    /**
     * Get unread notification count
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        
        $count = Notification::active()
            ->visibleTo($user)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}
