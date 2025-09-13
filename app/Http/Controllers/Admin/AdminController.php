<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\User;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        // Apply middleware in the constructor
    }

    public function dashboard()
    {
        $user = Auth::user();
        
        if ($user->role === 'company_admin' && $user->company_id) {
            return $this->companyAdminDashboard($user);
        }
        
        return $this->superAdminDashboard();
    }

    private function superAdminDashboard()
    {
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
            ->whereHas('jobListing')
            ->whereHas('user')
            ->latest()
            ->limit(10)
            ->get();

        $recentCompanies = Company::latest()
            ->limit(10)
            ->get();

        $monthlyStats = $this->getMonthlyStats();
        $chartData = $this->getSuperAdminChartData();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentJobs' => $recentJobs,
            'recentApplications' => $recentApplications,
            'recentCompanies' => $recentCompanies,
            'monthlyStats' => $monthlyStats,
            'userRole' => 'super_admin',
            'chartData' => $chartData,
        ]);
    }

    private function companyAdminDashboard($user)
    {
        $company = $user->company;
        
        $stats = [
            'total_jobs' => JobListing::where('company_id', $user->company_id)->count(),
            'active_jobs' => JobListing::where('company_id', $user->company_id)->active()->count(),
            'draft_jobs' => JobListing::where('company_id', $user->company_id)->where('status', 'draft')->count(),
            'closed_jobs' => JobListing::where('company_id', $user->company_id)->where('status', 'closed')->count(),
            'total_applications' => JobApplication::whereHas('jobListing', function($q) use ($user) {
                $q->where('company_id', $user->company_id);
            })->count(),
            'pending_applications' => JobApplication::whereHas('jobListing', function($q) use ($user) {
                $q->where('company_id', $user->company_id);
            })->where('status', 'pending')->count(),
            'hired_applications' => JobApplication::whereHas('jobListing', function($q) use ($user) {
                $q->where('company_id', $user->company_id);
            })->where('status', 'hired')->count(),
            'company_points' => $company->job_posting_points ?? 0,
        ];

        $recentJobs = JobListing::with(['company', 'category'])
            ->where('company_id', $user->company_id)
            ->latest()
            ->limit(10)
            ->get();

        $recentApplications = JobApplication::with(['user.profile', 'jobListing.company'])
            ->whereHas('jobListing', function($q) use ($user) {
                $q->where('company_id', $user->company_id);
            })
            ->whereHas('user')
            ->latest()
            ->limit(10)
            ->get();

        $monthlyStats = $this->getCompanyMonthlyStats($user->company_id);
        $chartData = $this->getCompanyAdminChartData($user->company_id);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentJobs' => $recentJobs,
            'recentApplications' => $recentApplications,
            'monthlyStats' => $monthlyStats,
            'userRole' => 'company_admin',
            'company' => $company,
            'chartData' => $chartData,
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

    private function getCompanyMonthlyStats($companyId)
    {
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M Y'),
                'jobs' => JobListing::where('company_id', $companyId)
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'applications' => JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'hired' => JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })
                    ->where('status', 'hired')
                    ->whereYear('updated_at', $date->year)
                    ->whereMonth('updated_at', $date->month)
                    ->count(),
            ];
        }

        return $months;
    }

    private function getSuperAdminChartData()
    {
        // Users stats
        $usersMonthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $usersMonthly[] = User::where('role', 'user')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        $usersByRole = [
            ['role' => 'User', 'count' => User::where('role', 'user')->count()],
            ['role' => 'Company Admin', 'count' => User::where('role', 'company_admin')->count()],
            ['role' => 'Super Admin', 'count' => User::where('role', 'super_admin')->count()],
        ];

        // Companies stats
        $companiesMonthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $companiesMonthly[] = Company::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        // Jobs stats
        $jobsMonthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $jobsMonthly[] = JobListing::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        $jobsByCategory = JobCategory::select('job_categories.name as category')
            ->selectRaw('COUNT(job_listings.id) as count')
            ->leftJoin('job_listings', 'job_categories.id', '=', 'job_listings.job_category_id')
            ->groupBy('job_categories.id', 'job_categories.name')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'category' => $item->category,
                    'count' => $item->count
                ];
            })
            ->toArray();

        // Applications stats
        $applicationsMonthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $applicationsMonthly[] = JobApplication::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        $applicationsByStatus = [
            ['status' => 'Pending', 'count' => JobApplication::where('status', 'pending')->count()],
            ['status' => 'Under Review', 'count' => JobApplication::where('status', 'reviewing')->count()],
            ['status' => 'Accepted', 'count' => JobApplication::where('status', 'hired')->count()],
            ['status' => 'Rejected', 'count' => JobApplication::where('status', 'rejected')->count()],
        ];

        return [
            'usersStats' => [
                'total' => User::where('role', 'user')->count(),
                'monthly' => $usersMonthly,
                'byRole' => $usersByRole,
            ],
            'companiesStats' => [
                'total' => Company::count(),
                'verified' => Company::where('is_verified', true)->count(),
                'monthly' => $companiesMonthly,
            ],
            'jobsStats' => [
                'total' => JobListing::count(),
                'active' => JobListing::where('status', 'published')->count(),
                'monthly' => $jobsMonthly,
                'byCategory' => $jobsByCategory,
            ],
            'applicationsStats' => [
                'total' => JobApplication::count(),
                'monthly' => $applicationsMonthly,
                'byStatus' => $applicationsByStatus,
            ],
        ];
    }

    private function getCompanyAdminChartData($companyId)
    {
        // Company jobs stats
        $jobsMonthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $jobsMonthly[] = JobListing::where('company_id', $companyId)
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        // Applications stats
        $applicationsMonthly = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $applicationsMonthly[] = JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })
            ->whereYear('created_at', $date->year)
            ->whereMonth('created_at', $date->month)
            ->count();
        }

        $applicationsByJob = JobListing::where('company_id', $companyId)
            ->select('title as job_title')
            ->selectRaw('COUNT(job_applications.id) as count')
            ->leftJoin('job_applications', 'job_listings.id', '=', 'job_applications.job_listing_id')
            ->groupBy('job_listings.id', 'job_listings.title')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'job_title' => $item->job_title,
                    'count' => $item->count
                ];
            })
            ->toArray();

        return [
            'companyJobsStats' => [
                'total' => JobListing::where('company_id', $companyId)->count(),
                'active' => JobListing::where('company_id', $companyId)->where('status', 'published')->count(),
                'expired' => JobListing::where('company_id', $companyId)->where('status', 'closed')->count(),
                'monthly' => $jobsMonthly,
            ],
            'companyApplicationsStats' => [
                'total' => JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })->count(),
                'pending' => JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })->where('status', 'pending')->count(),
                'accepted' => JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })->where('status', 'hired')->count(),
                'rejected' => JobApplication::whereHas('jobListing', function($q) use ($companyId) {
                    $q->where('company_id', $companyId);
                })->where('status', 'rejected')->count(),
                'monthly' => $applicationsMonthly,
                'byJob' => $applicationsByJob,
            ],
        ];
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
