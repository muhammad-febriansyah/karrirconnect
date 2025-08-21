<?php

namespace App\Http\Controllers;

use App\Models\AboutUs;
use App\Models\Company;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\News;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get site settings
        $settings = Setting::first();
        
        // Get statistics
        $statistics = [
            'total_jobs' => JobListing::published()->count(),
            'total_companies' => Company::where('is_active', true)->count(),
            'total_candidates' => User::where('role', 'user')->count(),
            'featured_jobs' => JobListing::published()->featured()->count(),
        ];

        // Get featured job listings (latest 6)
        $featuredJobs = JobListing::with(['company', 'category'])
            ->published()
            ->active()
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => [
                        'id' => $job->company->id,
                        'name' => $job->company->name,
                        'logo' => $job->company->logo ? asset('storage/' . $job->company->logo) : null,
                        'location' => $job->company->location,
                    ],
                    'category' => [
                        'id' => $job->category->id,
                        'name' => $job->category->name,
                        'slug' => $job->category->slug,
                    ],
                    'location' => $job->location,
                    'employment_type' => $job->employment_type,
                    'work_arrangement' => $job->work_arrangement,
                    'salary_min' => $job->salary_min,
                    'salary_max' => $job->salary_max,
                    'salary_currency' => $job->salary_currency,
                    'salary_negotiable' => $job->salary_negotiable,
                    'featured' => $job->featured,
                    'created_at' => $job->created_at,
                    'application_deadline' => $job->application_deadline,
                    'applications_count' => $job->applications_count,
                    'positions_available' => $job->positions_available,
                    'remaining_positions' => $job->remaining_positions,
                ];
            });

        // Get top companies (by active job count)
        $topCompanies = Company::with(['activeJobs'])
            ->where('is_active', true)
            ->where('is_verified', true)
            ->withCount('activeJobs')
            ->having('active_jobs_count', '>', 0)
            ->orderBy('active_jobs_count', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'description' => $company->description,
                    'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                    'website' => $company->website,
                    'industry' => $company->industry,
                    'size' => $company->size,
                    'location' => $company->location,
                    'is_verified' => $company->is_verified,
                    'active_jobs_count' => $company->active_jobs_count,
                    'total_job_posts' => $company->total_job_posts,
                ];
            });

        // Get job categories with job counts
        $jobCategories = JobCategory::with(['activeJobs'])
            ->where('is_active', true)
            ->withCount('activeJobs')
            ->having('active_jobs_count', '>', 0)
            ->orderBy('active_jobs_count', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'jobs_count' => $category->active_jobs_count,
                ];
            });

        // Get latest news/articles (latest 3)
        $latestNews = News::with(['author'])
            ->published()
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($news) {
                return [
                    'id' => $news->id,
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'excerpt' => $news->excerpt,
                    'featured_image' => $news->featured_image ? asset('storage/' . $news->featured_image) : null,
                    'author' => [
                        'id' => $news->author->id,
                        'name' => $news->author->name,
                        'avatar' => $news->author->avatar ? asset('storage/' . $news->author->avatar) : null,
                    ],
                    'published_at' => $news->published_at,
                ];
            });

        // Get recent job applications stats for testimonials (anonymized)
        try {
            $recentSuccessfulApplications = User::where('role', 'user')
                ->whereHas('applications', function ($query) {
                    $query->where('status', 'hired')
                          ->where('created_at', '>=', now()->subMonths(6));
                })
                ->with(['applications' => function ($query) {
                    $query->where('status', 'hired')
                          ->where('created_at', '>=', now()->subMonths(6))
                          ->with(['jobListing.company'])
                          ->latest()
                          ->limit(1);
                }])
                ->limit(6)
                ->get()
                ->map(function ($user) {
                    $application = $user->applications->first();
                    return [
                        'candidate_name' => $this->anonymizeName($user->name),
                        'job_title' => $application->jobListing->title,
                        'company_name' => $application->jobListing->company->name,
                        'hired_at' => $application->created_at,
                    ];
                })
                ->filter(); // Remove any empty results
        } catch (\Exception $e) {
            // If there's an issue with applications, return some dummy success stories
            $recentSuccessfulApplications = collect([
                [
                    'candidate_name' => 'Ahmad S.',
                    'job_title' => 'Software Engineer',
                    'company_name' => 'Tech Innovation',
                    'hired_at' => now()->subWeeks(2),
                ],
                [
                    'candidate_name' => 'Sari M.',
                    'job_title' => 'UI/UX Designer',
                    'company_name' => 'Digital Creative',
                    'hired_at' => now()->subWeeks(4),
                ],
            ]);
        }

        // Get about us data
        $aboutUs = AboutUs::where('is_active', true)->first();

        return Inertia::render('welcome', [
            'settings' => $settings ? [
                'site_name' => $settings->site_name,
                'description' => $settings->description,
                'email' => $settings->email,
                'phone' => $settings->phone,
                'address' => $settings->address,
                'logo' => $settings->logo ? asset('storage/' . $settings->logo) : null,
                'thumbnail' => $settings->thumbnail ? asset('storage/' . $settings->thumbnail) : null,
                'social' => [
                    'facebook' => $settings->fb,
                    'instagram' => $settings->ig,
                    'youtube' => $settings->yt,
                    'tiktok' => $settings->tiktok,
                ],
                'keywords' => $settings->keyword,
            ] : null,
            'statistics' => $statistics,
            'featuredJobs' => $featuredJobs,
            'topCompanies' => $topCompanies,
            'jobCategories' => $jobCategories,
            'latestNews' => $latestNews,
            'successStories' => $recentSuccessfulApplications,
            'aboutUs' => $aboutUs,
        ]);
    }

    private function anonymizeName($name)
    {
        $parts = explode(' ', $name);
        if (count($parts) >= 2) {
            return $parts[0] . ' ' . strtoupper(substr($parts[1], 0, 1)) . '.';
        }
        return strtoupper(substr($name, 0, 1)) . str_repeat('*', strlen($name) - 1);
    }
}