<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index()
    {
        $company = auth()->user()->company;
        
        $jobs = $company->jobListings()
            ->with(['category', 'skills'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $stats = [
            'total_jobs' => $company->jobListings()->count(),
            'active_jobs' => $company->jobListings()->where('status', 'published')->count(),
            'draft_jobs' => $company->jobListings()->where('status', 'draft')->count(),
            'total_applications' => $company->jobListings()->sum('applications_count'),
            'current_points' => $company->job_posting_points,
        ];

        return Inertia::render('company/jobs/index', [
            'jobs' => $jobs,
            'stats' => $stats,
            'company' => $company
        ]);
    }

    public function create()
    {
        $company = auth()->user()->company;
        
        $categories = JobCategory::orderBy('name')->get();
        $skills = Skill::orderBy('name')->get();

        // Get active point packages for display with enhanced data
        $pointPackages = \App\Models\PointPackage::active()
            ->orderBy('is_featured', 'desc')
            ->orderBy('price')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'description' => $package->description,
                    'points' => $package->points,
                    'price' => $package->price,
                    'bonus_points' => $package->bonus_points,
                    'is_featured' => $package->is_featured,
                    'features' => $package->features,
                    'total_points' => $package->total_points,
                    'formatted_price' => $package->formatted_price,
                    'cost_per_point' => $package->total_points > 0 ? round($package->price / $package->total_points, 0) : 0,
                    'savings_percentage' => $package->bonus_points > 0 ? round(($package->bonus_points / $package->points) * 100, 0) : 0,
                ];
            });

        // Get recent point transactions for context
        $recentTransactions = $company->pointTransactions()
            ->with('pointPackage')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => $transaction->type,
                    'points' => $transaction->points,
                    'description' => $transaction->description,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at->diffForHumans(),
                    'package_name' => $transaction->pointPackage?->name,
                ];
            });

        return Inertia::render('company/jobs/create', [
            'categories' => $categories,
            'skills' => $skills,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'job_posting_points' => $company->job_posting_points,
                'total_job_posts' => $company->total_job_posts,
                'active_job_posts' => $company->active_job_posts,
                'can_post_job' => $company->job_posting_points > 0,
            ],
            'pointPackages' => $pointPackages,
            'recentTransactions' => $recentTransactions,
            'jobPostingCost' => 1, // Cost per job posting in points
        ]);
    }

    public function store(Request $request)
    {
        $company = auth()->user()->company;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'employment_type' => 'required|in:Full-time,Part-time,Contract,Internship',
            'work_arrangement' => 'required|in:Remote,On-site,Hybrid',
            'experience_level' => 'required|in:Entry,Mid,Senior,Lead',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_negotiable' => 'boolean',
            'location' => 'required|string|max:255',
            'application_deadline' => 'nullable|date|after:today',
            'positions_available' => 'required|integer|min:1',
            'job_category_id' => 'required|exists:job_categories,id',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'status' => 'required|in:draft,published'
        ]);

        DB::transaction(function () use ($validated, $company, $request) {
            $job = $company->jobListings()->create([
                ...$validated,
                'created_by' => auth()->id(),
                'salary_currency' => 'IDR'
            ]);

            // Attach skills if provided
            if ($request->has('skills') && is_array($request->skills)) {
                $job->skills()->attach($request->skills);
            }

            // Deduct points if job is published and company has points
            if ($validated['status'] === 'published' && $company->job_posting_points >= 1) {
                $company->decrement('job_posting_points', 1);
                
                // Create point transaction record
                $company->pointTransactions()->create([
                    'type' => 'usage',
                    'points' => -1,
                    'description' => "Posting lowongan: {$job->title}",
                    'status' => 'completed',
                    'reference_type' => 'job_posting',
                    'reference_id' => $job->id
                ]);
            } elseif ($validated['status'] === 'published' && $company->job_posting_points < 1) {
                // Auto save as draft if no points but trying to publish
                $validated['status'] = 'draft';
            }
        });

        $message = $validated['status'] === 'published' ? 'Lowongan berhasil dipublikasikan!' : 'Lowongan berhasil disimpan sebagai draft!';
        if ($request->input('status') === 'published' && $company->job_posting_points < 1) {
            $message = 'Lowongan disimpan sebagai draft karena poin tidak mencukupi untuk publikasi.';
        }
        
        return redirect()->route('company.jobs.index')
            ->with('success', $message);
    }

    public function show(JobListing $job)
    {
        $this->authorize('view', $job);
        
        $job->load(['category', 'skills', 'applications.user']);

        return Inertia::render('company/jobs/show', [
            'job' => $job
        ]);
    }

    public function edit(JobListing $job)
    {
        $this->authorize('update', $job);
        
        $categories = JobCategory::orderBy('name')->get();
        $skills = Skill::orderBy('name')->get();
        $job->load('skills');

        return Inertia::render('company/jobs/edit', [
            'job' => $job,
            'categories' => $categories,
            'skills' => $skills
        ]);
    }

    public function update(Request $request, JobListing $job)
    {
        $this->authorize('update', $job);
        
        $company = auth()->user()->company;
        $wasPublished = $job->status === 'published';
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'employment_type' => 'required|in:Full-time,Part-time,Contract,Internship',
            'work_arrangement' => 'required|in:Remote,On-site,Hybrid',
            'experience_level' => 'required|in:Entry,Mid,Senior,Lead',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_negotiable' => 'boolean',
            'location' => 'required|string|max:255',
            'application_deadline' => 'nullable|date|after:today',
            'positions_available' => 'required|integer|min:1',
            'job_category_id' => 'required|exists:job_categories,id',
            'skills' => 'array',
            'skills.*' => 'exists:skills,id',
            'status' => 'required|in:draft,published,closed,paused'
        ]);

        // Check points if changing from draft to published
        if (!$wasPublished && $validated['status'] === 'published') {
            if ($company->job_posting_points < 1) {
                return back()->with('error', 'Poin tidak mencukupi untuk mempublikasikan lowongan.');
            }
        }

        DB::transaction(function () use ($validated, $job, $company, $wasPublished, $request) {
            $job->update($validated);

            // Update skills
            if ($request->has('skills') && is_array($request->skills)) {
                $job->skills()->sync($request->skills);
            }

            // Deduct points if changing from draft to published
            if (!$wasPublished && $validated['status'] === 'published') {
                $company->decrement('job_posting_points', 1);
                
                // Create point transaction record
                $company->pointTransactions()->create([
                    'type' => 'usage',
                    'points' => -1,
                    'description' => "Mempublikasikan lowongan: {$job->title}",
                    'status' => 'completed',
                    'reference_type' => 'job_posting',
                    'reference_id' => $job->id
                ]);
            }
        });

        return redirect()->route('company.jobs.index')
            ->with('success', 'Lowongan berhasil diperbarui!');
    }

    public function destroy(JobListing $job)
    {
        $this->authorize('delete', $job);
        
        $job->delete();

        return redirect()->route('company.jobs.index')
            ->with('success', 'Lowongan berhasil dihapus!');
    }

    public function toggleStatus(JobListing $job)
    {
        $this->authorize('update', $job);
        
        $company = auth()->user()->company;
        
        $newStatus = match($job->status) {
            'published' => 'paused',
            'paused' => 'published',
            'draft' => 'published',
            default => $job->status
        };

        // Check points if publishing
        if ($job->status !== 'published' && $newStatus === 'published') {
            if ($company->job_posting_points < 1) {
                return back()->with('error', 'Poin tidak mencukupi untuk mempublikasikan lowongan.');
            }
            
            $company->decrement('job_posting_points', 1);
            
            // Create point transaction record
            $company->pointTransactions()->create([
                'type' => 'usage',
                'points' => -1,
                'description' => "Mengaktifkan lowongan: {$job->title}",
                'status' => 'completed',
                'reference_type' => 'job_posting',
                'reference_id' => $job->id
            ]);
        }

        $job->update(['status' => $newStatus]);

        $message = match($newStatus) {
            'published' => 'Lowongan berhasil dipublikasikan!',
            'paused' => 'Lowongan berhasil dijeda!',
            default => 'Status lowongan berhasil diubah!'
        };

        return back()->with('success', $message);
    }

    /**
     * Get point packages data for job posting
     */
    public function getPointPackages()
    {
        $company = auth()->user()->company;
        
        $pointPackages = \App\Models\PointPackage::active()
            ->orderBy('is_featured', 'desc')
            ->orderBy('price')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'description' => $package->description,
                    'points' => $package->points,
                    'price' => $package->price,
                    'bonus_points' => $package->bonus_points,
                    'is_featured' => $package->is_featured,
                    'features' => $package->features,
                    'total_points' => $package->total_points,
                    'formatted_price' => $package->formatted_price,
                    'cost_per_point' => $package->total_points > 0 ? round($package->price / $package->total_points, 0) : 0,
                    'savings_percentage' => $package->bonus_points > 0 ? round(($package->bonus_points / $package->points) * 100, 0) : 0,
                    'value_proposition' => $this->getValueProposition($package),
                ];
            });

        return response()->json([
            'packages' => $pointPackages,
            'company_points' => $company->job_posting_points,
            'posting_cost' => 1,
            'can_post' => $company->job_posting_points > 0,
        ]);
    }

    /**
     * Get value proposition text for a package
     */
    private function getValueProposition($package)
    {
        if ($package->bonus_points > 0) {
            return "Hemat Rp " . number_format($package->bonus_points * ($package->price / $package->total_points), 0, ',', '.') . " dengan bonus {$package->bonus_points} poin!";
        }
        
        if ($package->is_featured) {
            return "Paket terpopuler dengan fitur lengkap!";
        }
        
        return "Solusi tepat untuk kebutuhan posting lowongan Anda.";
    }

    /**
     * Check if company can post job with current points
     */
    public function checkPostingEligibility()
    {
        $company = auth()->user()->company;
        
        return response()->json([
            'can_post' => $company->job_posting_points > 0,
            'current_points' => $company->job_posting_points,
            'required_points' => 1,
            'message' => $company->job_posting_points > 0 
                ? 'Anda dapat memposting lowongan ini.'
                : 'Poin tidak mencukupi. Silakan beli paket poin terlebih dahulu.',
        ]);
    }
}