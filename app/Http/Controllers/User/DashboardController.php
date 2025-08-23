<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\SavedJob;
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
            'saved_jobs' => SavedJob::where('user_id', $user->id)->count(),
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
            ->get()
            ->filter(function($application) {
                return $application->jobListing !== null;
            });

        // Get saved jobs with proper eager loading
        $savedJobs = SavedJob::with([
                'jobListing' => function($query) {
                    $query->with('company');
                }
            ])
            ->where('user_id', $user->id)
            ->latest()
            ->limit(5)
            ->get()
            ->filter(function($savedJob) {
                return $savedJob->jobListing !== null;
            });

        return Inertia::render('user/dashboard', [
            'stats' => $stats,
            'recentApplications' => $recentApplications->values(), // Reset array keys
            'savedJobs' => $savedJobs->values(), // Reset array keys
        ]);
    }
}