<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdvancedUserManagementController extends Controller
{
    public function verification(Request $request)
    {
        $query = User::with(['verifier', 'userProfile'])->where('role', '!=', 'admin');

        if ($request->status) {
            $query->where('verification_status', $request->status);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate(20);

        return Inertia::render('admin/users/verification', [
            'users' => $users,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function updateVerification(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:verified,rejected',
            'notes' => 'nullable|string',
        ]);

        $user->update([
            'verification_status' => $request->status,
            'verification_notes' => $request->notes,
            'verified_by' => Auth::id(),
            'verified_at' => now(),
        ]);

        UserActivityLog::log(
            'user_verification_updated',
            "Updated verification status for user {$user->name} to {$request->status}",
            ['user_id' => $user->id, 'new_status' => $request->status],
            $user
        );

        return back()->with('success', 'User verification status updated successfully.');
    }

    public function bulkActions(Request $request)
    {
        $request->validate([
            'action' => 'required|in:verify,reject,activate,deactivate,delete',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $users = User::whereIn('id', $request->user_ids)->where('role', '!=', 'admin');

        switch ($request->action) {
            case 'verify':
                $users->update([
                    'verification_status' => 'verified',
                    'verification_notes' => $request->notes,
                    'verified_by' => Auth::id(),
                    'verified_at' => now(),
                ]);
                break;
            case 'reject':
                $users->update([
                    'verification_status' => 'rejected',
                    'verification_notes' => $request->notes,
                    'verified_by' => Auth::id(),
                    'verified_at' => now(),
                ]);
                break;
            case 'activate':
                $users->update(['is_active' => true]);
                break;
            case 'deactivate':
                $users->update(['is_active' => false]);
                break;
            case 'delete':
                $users->delete();
                break;
        }

        UserActivityLog::log(
            'bulk_user_action',
            "Performed bulk action: {$request->action} on " . count($request->user_ids) . " users",
            ['action' => $request->action, 'user_ids' => $request->user_ids]
        );

        return back()->with('success', 'Bulk action completed successfully.');
    }

    public function activityLogs(Request $request)
    {
        $query = UserActivityLog::with('user')->orderBy('created_at', 'desc');

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->action) {
            $query->where('action', $request->action);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(50);

        return Inertia::render('admin/users/activity-logs', [
            'logs' => $logs,
            'filters' => $request->only(['user_id', 'action', 'date_from', 'date_to']),
            'users' => User::select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    public function export(Request $request)
    {
        $query = User::with(['userProfile']);

        if ($request->is_active !== null) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->verification_status) {
            $query->where('verification_status', $request->verification_status);
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->get();

        $filename = 'users_export_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($users) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, [
                'ID', 'Name', 'Email', 'Role', 'Active Status', 'Verification Status',
                'Phone', 'Location', 'Created At', 'Last Login'
            ]);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    $user->is_active ? 'Active' : 'Inactive',
                    $user->verification_status,
                    $user->userProfile?->phone ?? '',
                    $user->userProfile?->location ?? '',
                    $user->created_at->format('Y-m-d H:i:s'),
                    $user->last_login_at?->format('Y-m-d H:i:s') ?? '',
                ]);
            }

            fclose($file);
        };

        UserActivityLog::log(
            'users_export',
            'Exported users list to CSV',
            ['filter_criteria' => $request->only(['is_active', 'verification_status', 'role'])]
        );

        return response()->stream($callback, 200, $headers);
    }
}
