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
}