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
            ->whereJsonContains('target_roles', $user->role)
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
        if (in_array($user->role, $notification->target_roles ?? [])) {
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
            ->whereJsonContains('target_roles', $user->role)
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
            ->whereJsonContains('target_roles', $user->role)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}