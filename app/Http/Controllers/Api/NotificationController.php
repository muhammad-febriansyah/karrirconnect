<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get new message notifications for current user
     */
    public function getNewMessages(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get new message notifications from last 1 minute
        $notifications = Notification::where('type', 'new_message')
            ->where('target_user_id', $user->id)
            ->where('read_at', null)
            ->where('created_at', '>=', now()->subMinute())
            ->orderBy('created_at', 'desc')
            ->get();

        // Mark these notifications as read
        Notification::where('type', 'new_message')
            ->where('target_user_id', $user->id)
            ->where('read_at', null)
            ->where('created_at', '>=', now()->subMinute())
            ->update(['read_at' => now()]);

        return response()->json([
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'action_url' => $notification->action_url,
                    'data' => $notification->data,
                    'created_at' => $notification->created_at,
                ];
            })
        ]);
    }

    /**
     * Get unread message count
     */
    public function getUnreadMessageCount(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $count = Notification::where('type', 'new_message')
            ->where('target_user_id', $user->id)
            ->where('read_at', null)
            ->count();

        return response()->json(['count' => $count]);
    }
}