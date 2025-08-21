<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['company', 'category'])
            ->active();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('company', function($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Employment type filter
        if ($request->filled('employment_type')) {
            $query->where('employment_type', $request->employment_type);
        }

        // Work arrangement filter
        if ($request->filled('work_arrangement')) {
            $query->where('work_arrangement', $request->work_arrangement);
        }

        $jobs = $query->orderBy('featured', 'desc')
                     ->orderBy('created_at', 'desc')
                     ->paginate(15)
                     ->withQueryString();

        // Featured jobs
        $featuredJobs = JobListing::with(['company', 'category'])
            ->featured()
            ->active()
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        // Job categories
        $categories = JobCategory::orderBy('name')->get();

        // Total jobs count
        $totalJobs = JobListing::active()->count();

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'categories' => $categories,
            'filters' => $request->only(['search', 'location', 'category', 'employment_type', 'work_arrangement']),
            'totalJobs' => $totalJobs,
            'featuredJobs' => $featuredJobs
        ]);
    }

    public function show(JobListing $job)
    {
        $job->load([
            'company', 
            'category', 
            'skills' => function($query) {
                $query->withPivot('required', 'proficiency_level');
            },
            'creator'
        ]);
        
        // Increment view count
        $job->incrementViews();

        // Related jobs
        $relatedJobs = JobListing::with(['company', 'category'])
            ->active()
            ->where('id', '!=', $job->id)
            ->where(function($query) use ($job) {
                $query->where('job_category_id', $job->job_category_id)
                      ->orWhere('company_id', $job->company_id);
            })
            ->limit(6)
            ->get();

        return Inertia::render('jobs/show', [
            'job' => $job,
            'relatedJobs' => $relatedJobs
        ]);
    }
}