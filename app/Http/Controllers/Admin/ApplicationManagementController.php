<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ApplicationManagementController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = JobApplication::with(['user.profile', 'jobListing.company', 'reviewer'])
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                // Company admin can only see applications for their company's job listings
                $q->whereHas('jobListing', function ($jobQuery) use ($user) {
                    $jobQuery->where('company_id', $user->company_id);
                });
            })
            ->orderBy('created_at', 'desc');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $applications = $query->paginate(20);

        return Inertia::render('admin/applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['status', 'search']),
            'userRole' => $user->role,
        ]);
    }

    public function show(JobApplication $application)
    {
        $user = Auth::user();
        
        // Company admin can only view applications for their company's job listings
        if ($user->role === 'company_admin' && $application->jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }
        
        $application->load(['user.profile', 'jobListing.company', 'reviewer']);

        return Inertia::render('admin/applications/show', [
            'application' => $application,
            'userRole' => $user->role,
        ]);
    }

    public function updateStatus(Request $request, JobApplication $application)
    {
        $user = Auth::user();
        
        // Company admin can only update applications for their company's job listings
        if ($user->role === 'company_admin' && $application->jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }
        
        $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,interviewed,hired,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $application->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Application status updated successfully.');
    }

    public function bulkAction(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'action' => 'required|in:approve,reject,delete',
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:job_applications,id',
        ]);

        $applications = JobApplication::whereIn('id', $request->application_ids)
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                // Company admin can only bulk action their company's applications
                $q->whereHas('jobListing', function ($jobQuery) use ($user) {
                    $jobQuery->where('company_id', $user->company_id);
                });
            });

        switch ($request->action) {
            case 'approve':
                $applications->update([
                    'status' => 'reviewed',
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);
                break;
            case 'reject':
                $applications->update([
                    'status' => 'rejected',
                    'reviewed_at' => now(),
                    'reviewed_by' => Auth::id(),
                ]);
                break;
            case 'delete':
                $applications->delete();
                break;
        }

        return back()->with('success', 'Bulk action completed successfully.');
    }
}
