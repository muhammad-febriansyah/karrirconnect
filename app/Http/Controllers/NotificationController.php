<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get notifications for current user based on their role
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['notifications' => [], 'unread_count' => 0]);
        }

        $notifications = Notification::query()
            ->active()
            ->forRole($user->role)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'time' => $notification->created_at,
                    'read' => $notification->is_read,
                    'priority' => $notification->priority,
                    'action_url' => $notification->action_url,
                ];
            });

        $unreadCount = Notification::active()
            ->forRole($user->role)
            ->unread()
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        $user = Auth::user();
        
        // Check if notification is for user's role
        if (!$notification->isForRole($user->role)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read for current user
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        
        Notification::active()
            ->forRole($user->role)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Get notification statistics by role (for admin dashboard)
     */
    public function getStatistics(Request $request)
    {
        $user = Auth::user();
        
        // Only super admin can see all statistics
        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $statistics = [
            'super_admin' => [
                'total' => Notification::active()->forRole('super_admin')->count(),
                'unread' => Notification::active()->forRole('super_admin')->unread()->count(),
                'high_priority' => Notification::active()->forRole('super_admin')->byPriority('high')->count(),
            ],
            'company_admin' => [
                'total' => Notification::active()->forRole('company_admin')->count(),
                'unread' => Notification::active()->forRole('company_admin')->unread()->count(),
                'high_priority' => Notification::active()->forRole('company_admin')->byPriority('high')->count(),
            ],
            'by_type' => [
                'user' => Notification::active()->byType('user')->count(),
                'company' => Notification::active()->byType('company')->count(),
                'application' => Notification::active()->byType('application')->count(),
                'system' => Notification::active()->byType('system')->count(),
            ]
        ];

        return response()->json($statistics);
    }

    /**
     * Create a new notification (admin only)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // Only admin can create notifications
        if (!in_array($user->role, ['super_admin', 'company_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_roles' => 'required|array',
            'target_roles.*' => 'in:super_admin,company_admin,user',
            'priority' => 'in:low,medium,high,urgent',
            'action_url' => 'nullable|string',
        ]);

        // Company admin can only create notifications for their own role or users
        if ($user->role === 'company_admin') {
            $allowedRoles = ['company_admin', 'user'];
            $invalidRoles = array_diff($request->target_roles, $allowedRoles);
            if (!empty($invalidRoles)) {
                return response()->json(['message' => 'Company admin cannot create notifications for super admin'], 403);
            }
        }

        $notification = Notification::create([
            'type' => $request->type,
            'title' => $request->title,
            'message' => $request->message,
            'target_roles' => $request->target_roles,
            'priority' => $request->priority ?? 'medium',
            'action_url' => $request->action_url,
            'created_by' => $user->id,
            'data' => $request->data ?? null,
        ]);

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification
        ], 201);
    }
}
