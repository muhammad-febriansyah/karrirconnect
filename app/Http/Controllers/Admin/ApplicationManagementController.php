<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

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

        // Transform the applications data to ensure proper structure
        $applications->getCollection()->transform(function ($application) {
            return [
                'id' => $application->id,
                'status' => $application->status,
                'created_at' => $application->created_at,
                'admin_notes' => $application->admin_notes,
                'reviewed_at' => $application->reviewed_at,
                'user' => $application->user ? [
                    'id' => $application->user->id,
                    'name' => $application->user->name,
                    'email' => $application->user->email,
                    'profile' => $application->user->profile ? [
                        'first_name' => $application->user->profile->first_name,
                        'last_name' => $application->user->profile->last_name,
                        'phone' => $application->user->profile->phone,
                        'location' => $application->user->profile->location,
                    ] : null,
                ] : null,
                'jobListing' => $application->jobListing ? [
                    'id' => $application->jobListing->id,
                    'title' => $application->jobListing->title,
                    'location' => $application->jobListing->location,
                    'company' => $application->jobListing->company ? [
                        'id' => $application->jobListing->company->id,
                        'name' => $application->jobListing->company->name,
                    ] : null,
                ] : null,
                'reviewer' => $application->reviewer ? [
                    'id' => $application->reviewer->id,
                    'name' => $application->reviewer->name,
                ] : null,
            ];
        });

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

        // Transform the application data to ensure proper structure
        $transformedApplication = [
            'id' => $application->id,
            'status' => $application->status,
            'cover_letter' => $application->cover_letter,
            'resume_path' => $application->resume_path,
            'additional_documents' => $application->additional_documents,
            'admin_notes' => $application->admin_notes,
            'created_at' => $application->created_at,
            'reviewed_at' => $application->reviewed_at,
            'user' => $application->user ? [
                'id' => $application->user->id,
                'name' => $application->user->name,
                'email' => $application->user->email,
                'profile' => $application->user->profile ? [
                    'first_name' => $application->user->profile->first_name,
                    'last_name' => $application->user->profile->last_name,
                    'phone' => $application->user->profile->phone,
                    'location' => $application->user->profile->location,
                    'bio' => $application->user->profile->bio,
                    'linkedin' => $application->user->profile->linkedin,
                    'github' => $application->user->profile->github,
                    'portfolio' => $application->user->profile->portfolio,
                ] : null,
            ] : null,
            'jobListing' => $application->jobListing ? [
                'id' => $application->jobListing->id,
                'title' => $application->jobListing->title,
                'slug' => $application->jobListing->slug,
                'description' => $application->jobListing->description,
                'requirements' => $application->jobListing->requirements,
                'benefits' => $application->jobListing->benefits,
                'employment_type' => $application->jobListing->employment_type,
                'location' => $application->jobListing->location,
                'salary_min' => $application->jobListing->salary_min,
                'salary_max' => $application->jobListing->salary_max,
                'salary_currency' => $application->jobListing->salary_currency,
                'company' => $application->jobListing->company ? [
                    'id' => $application->jobListing->company->id,
                    'name' => $application->jobListing->company->name,
                    'description' => $application->jobListing->company->description,
                    'logo' => $application->jobListing->company->logo,
                    'website' => $application->jobListing->company->website,
                ] : null,
            ] : null,
            'reviewer' => $application->reviewer ? [
                'id' => $application->reviewer->id,
                'name' => $application->reviewer->name,
            ] : null,
        ];

        return Inertia::render('admin/applications/show', [
            'application' => $transformedApplication,
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
            'status' => 'required|in:pending,reviewing,shortlisted,interview,hired,rejected',
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

    public function downloadResume(JobApplication $application)
    {
        $user = Auth::user();

        // Company admin can only download resumes for their company's job applications
        if ($user->role === 'company_admin' && $application->jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        if (!$application->resume_path) {
            abort(404, 'Resume file not found');
        }

        if (!Storage::disk('public')->exists($application->resume_path)) {
            abort(404, 'Resume file not found on storage');
        }

        $fileName = 'CV_' . str_replace(' ', '_', $application->user->name) . '_' . $application->id . '.' . pathinfo($application->resume_path, PATHINFO_EXTENSION);

        return Storage::disk('public')->download($application->resume_path, $fileName);
    }

    public function downloadDocument(JobApplication $application, $index)
    {
        $user = Auth::user();

        // Company admin can only download documents for their company's job applications
        if ($user->role === 'company_admin' && $application->jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        if (!$application->additional_documents || !isset($application->additional_documents[$index])) {
            abort(404, 'Document not found');
        }

        $documentPath = $application->additional_documents[$index];

        if (!Storage::disk('public')->exists($documentPath)) {
            abort(404, 'Document file not found on storage');
        }

        $fileName = 'Document_' . str_replace(' ', '_', $application->user->name) . '_' . $application->id . '_' . ($index + 1) . '.' . pathinfo($documentPath, PATHINFO_EXTENSION);

        return Storage::disk('public')->download($documentPath, $fileName);
    }
}
