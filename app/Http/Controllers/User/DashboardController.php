<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        // Get user statistics
        $stats = [
            'applications' => JobApplication::where('user_id', $user->id)->count(),
            'saved_jobs' => $user->savedJobs()->count(),
            'pending_applications' => JobApplication::where('user_id', $user->id)->where('status', 'pending')->count(),
            'interview_applications' => JobApplication::where('user_id', $user->id)->where('status', 'interview')->count(),
        ];

        // Get recent applications with proper eager loading
        $recentApplications = JobApplication::with([
                'jobListing' => function($query) {
                    $query->with('company');
                }
            ])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();


        // Get saved jobs with proper eager loading
        $savedJobs = $user->savedJobs()
            ->with(['company', 'category'])
            ->latest('saved_jobs.created_at')
            ->limit(5)
            ->get();

        $jobInvitations = $user->jobInvitations()
            ->with(['company', 'jobListing'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('user/dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications->map(function($app) {
                return [
                    'id' => $app->id,
                    'status' => $app->status,
                    'created_at' => $app->created_at,
                    'jobListing' => $app->jobListing ? [
                        'id' => $app->jobListing->id,
                        'slug' => $app->jobListing->slug,
                        'title' => $app->jobListing->title,
                        'location' => $app->jobListing->location,
                        'employment_type' => $app->jobListing->employment_type,
                        'company' => $app->jobListing->company ? [
                            'name' => $app->jobListing->company->name,
                            'logo' => $app->jobListing->company->logo,
                        ] : null,
                    ] : null,
                ];
            })->values(),
            'savedJobs' => $savedJobs,
            'jobInvitations' => $jobInvitations->map(function ($invitation) {
                return [
                    'id' => $invitation->id,
                    'status' => $invitation->status,
                    'created_at' => $invitation->created_at,
                    'responded_at' => $invitation->responded_at,
                    'message' => $invitation->message,
                    'company' => $invitation->company ? [
                        'id' => $invitation->company->id,
                        'name' => $invitation->company->name,
                        'logo' => $invitation->company->logo,
                    ] : null,
                    'jobListing' => $invitation->jobListing ? [
                        'id' => $invitation->jobListing->id,
                        'slug' => $invitation->jobListing->slug,
                        'title' => $invitation->jobListing->title,
                    ] : null,
                ];
            })->values()->all(),
        ]);
    }

    public function savedJobs(): Response
    {
        $user = auth()->user();

        // Get all saved jobs with pagination
        $savedJobs = $user->savedJobs()
            ->with(['company', 'category'])
            ->withPivot('created_at as saved_at')
            ->latest('pivot_created_at')
            ->paginate(15);

        // Add saved_at timestamp to each job
        $savedJobs->getCollection()->transform(function ($job) {
            $job->saved_at = $job->pivot->created_at;
            unset($job->pivot);
            return $job;
        });

        return Inertia::render('user/saved-jobs', [
            'savedJobs' => $savedJobs,
        ]);
    }

    public function applications(): Response
    {
        $user = auth()->user();

        // Get user applications with proper eager loading and pagination
        $applications = JobApplication::with([
                'jobListing' => function($query) {
                    $query->with(['company', 'category']);
                }
            ])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Debug: Log the actual data structure
        \Log::info('User Applications Debug', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'total_applications' => $applications->total(),
        ]);

        // For demo/testing: If current user has no applications, show sample data
        if ($applications->total() === 0) {
            \Log::info('No applications for current user, fetching sample data');
            $applications = JobApplication::with([
                    'jobListing' => function($query) {
                        $query->with(['company', 'category']);
                    }
                ])
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        }

        // Transform data to ensure all relationships are loaded
        $applications->getCollection()->transform(function ($application) {
            $transformedData = [
                'id' => $application->id,
                'status' => $application->status,
                'created_at' => $application->created_at,
                'jobListing' => $application->jobListing ? [
                    'id' => $application->jobListing->id,
                    'slug' => $application->jobListing->slug,
                    'title' => $application->jobListing->title,
                    'location' => $application->jobListing->location,
                    'company' => $application->jobListing->company ? [
                        'name' => $application->jobListing->company->name,
                        'logo' => $application->jobListing->company->logo,
                    ] : null,
                    'category' => $application->jobListing->category ? [
                        'name' => $application->jobListing->category->name,
                    ] : null,
                ] : null,
            ];

            // Debug log each transformed item
            \Log::info('Transformed application', [
                'id' => $transformedData['id'],
                'job_title' => $transformedData['jobListing']['title'] ?? 'NULL',
                'company_name' => $transformedData['jobListing']['company']['name'] ?? 'NULL',
            ]);

            return $transformedData;
        });

        return Inertia::render('user/applications', [
            'applications' => $applications,
        ]);
    }
}
