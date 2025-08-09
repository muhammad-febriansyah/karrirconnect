<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        // Apply middleware in the constructor
    }

    public function dashboard()
    {
        // Middleware already handles admin check, so we don't need this here

        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_companies' => Company::count(),
            'total_jobs' => JobListing::count(),
            'active_jobs' => JobListing::active()->count(),
            'total_applications' => JobApplication::count(),
            'pending_applications' => JobApplication::where('status', 'pending')->count(),
            'featured_jobs' => JobListing::where('featured', true)->count(),
            'verified_companies' => Company::where('is_verified', true)->count(),
        ];

        $recentJobs = JobListing::with(['company', 'category'])
            ->latest()
            ->limit(10)
            ->get();

        $recentApplications = JobApplication::with(['user.profile', 'jobListing.company'])
            ->latest()
            ->limit(10)
            ->get();

        $recentCompanies = Company::latest()
            ->limit(10)
            ->get();

        $monthlyStats = $this->getMonthlyStats();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentJobs' => $recentJobs,
            'recentApplications' => $recentApplications,
            'recentCompanies' => $recentCompanies,
            'monthlyStats' => $monthlyStats,
        ]);
    }


    public function applications(Request $request)
    {
        $query = JobApplication::with(['user.profile', 'jobListing.company', 'reviewer'])
            ->when($request->search, function ($q, $search) {
                $q->whereHas('user', function ($userQ) use ($search) {
                    $userQ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                    ->orWhereHas('jobListing', function ($jobQ) use ($search) {
                        $jobQ->where('title', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->when($request->company, function ($q, $company) {
                $q->whereHas('jobListing', function ($jobQ) use ($company) {
                    $jobQ->where('company_id', $company);
                });
            });

        $perPage = $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 15, 25, 50]) ? $perPage : 10;
        
        $applications = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/applications/index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'status', 'company'])
        ]);
    }

    private function getMonthlyStats()
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M Y'),
                'users' => User::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'jobs' => JobListing::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'applications' => JobApplication::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'companies' => Company::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        }

        return $months;
    }

    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewing,shortlisted,interview,rejected,hired',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $application = JobApplication::findOrFail($applicationId);

        $application->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Application status updated successfully.');
    }
}
