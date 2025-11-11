<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Setting;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class JobController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $company = auth()->user()->company;

        // Get filter parameters
        $search = $request->get('search');
        $status = $request->get('status');
        $category = $request->get('category');
        $employment_type = $request->get('employment_type');
        $perPage = $request->get('per_page', 10);

        // Build the query
        $query = $company->jobListings()->with(['category', 'skills']);

        // Apply search filter
        if ($search) {
            $searchTerm = '%' . $search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhere('location', 'like', $searchTerm)
                    ->orWhere('requirements', 'like', $searchTerm);
            });
        }

        // Apply status filter
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Apply category filter
        if ($category && $category !== 'all') {
            $query->where('job_category_id', $category);
        }

        // Apply employment type filter
        if ($employment_type && $employment_type !== 'all') {
            $query->where('employment_type', $employment_type);
        }

        // Get paginated results
        $jobs = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Get stats (unfiltered for accurate totals)
        $stats = [
            'total_jobs' => $company->jobListings()->count(),
            'active_jobs' => $company->jobListings()->where('status', 'published')->count(),
            'draft_jobs' => $company->jobListings()->where('status', 'draft')->count(),
            'total_applications' => $company->jobListings()->sum('applications_count'),
            'current_points' => $company->job_posting_points,
        ];

        // Get filter options
        $categories = JobCategory::orderBy('name')->get(['id', 'name']);
        $employmentTypes = [
            'Full-time' => 'Full-time',
            'Part-time' => 'Part-time',
            'Contract' => 'Contract',
            'Internship' => 'Internship'
        ];

        return Inertia::render('company/jobs/index', [
            'jobs' => $jobs,
            'stats' => $stats,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'job_posting_points' => $company->job_posting_points,
                'verification_status' => $company->verification_status,
                'is_verified' => $company->isVerified(),
                'can_post_job' => $company->canPostJob(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'category' => $category,
                'employment_type' => $employment_type,
                'per_page' => $perPage,
            ],
            'filterOptions' => [
                'categories' => $categories,
                'employment_types' => $employmentTypes,
                'statuses' => [
                    'draft' => 'Draft',
                    'published' => 'Aktif',
                    'paused' => 'Dijeda',
                    'closed' => 'Ditutup',
                ],
            ]
        ]);
    }

    public function create()
    {
        $company = auth()->user()->company;

        // Check if company is verified
        if (!$company->isVerified()) {
            return redirect()->route('company.jobs.index')
                ->with('error', 'Perusahaan Anda belum terverifikasi. Silakan lengkapi proses verifikasi terlebih dahulu untuk dapat memposting lowongan.');
        }

        $categories = JobCategory::orderBy('name')->get();
        $skills = Skill::orderBy('name')->get();

        // Get service fee from settings
        $settings = Setting::first();
        $serviceFee = $settings->fee ?? 0;
        
        // Get active point packages for display with enhanced data
        $pointPackages = \App\Models\PointPackage::active()
            ->orderBy('is_featured', 'desc')
            ->orderBy('price')
            ->get()
            ->map(function ($package) use ($serviceFee) {
                $totalPrice = $package->price + $serviceFee;
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
                    'service_fee' => $serviceFee,
                    'total_price' => $totalPrice,
                    'formatted_total_price' => 'Rp ' . number_format($totalPrice, 0, ',', '.'),
                    'cost_per_point' => $package->total_points > 0 ? round($totalPrice / $package->total_points, 0) : 0,
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

        $shouldPublish = $validated['status'] === 'published';

        // Check if company is verified before allowing job posting
        if (!$company->isVerified()) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Perusahaan Anda belum terverifikasi. Silakan lengkapi proses verifikasi terlebih dahulu untuk dapat memposting lowongan.');
        }

        if ($shouldPublish && !$company->hasAvailablePoints()) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Poin tidak mencukupi untuk mempublikasikan lowongan. Silakan lakukan top up terlebih dahulu.');
        }

        try {
            DB::transaction(function () use ($validated, $company, $request, $shouldPublish) {
                $job = $company->jobListings()->create([
                    ...$validated,
                    'created_by' => auth()->id(),
                    'salary_currency' => 'IDR'
                ]);

                if ($request->has('skills') && is_array($request->skills)) {
                    $job->skills()->attach($request->skills);
                }

                if ($shouldPublish && !$company->deductJobPostingPoint($job)) {
                    $job->update(['status' => 'draft']);

                    throw new \RuntimeException('insufficient_points');
                }
            });
        } catch (\RuntimeException $exception) {
            if ($exception->getMessage() === 'insufficient_points') {
                return redirect()->back()
                    ->withInput()
                    ->with('error', 'Poin tidak mencukupi untuk mempublikasikan lowongan. Silakan lakukan top up terlebih dahulu.');
            }

            throw $exception;
        }

        $message = $shouldPublish ? 'Lowongan berhasil dipublikasikan!' : 'Lowongan berhasil disimpan sebagai draft!';

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

        // Check if company is verified before allowing publishing
        if (!$company->isVerified()) {
            return back()->with('error', 'Perusahaan Anda belum terverifikasi. Silakan lengkapi proses verifikasi terlebih dahulu.');
        }

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

        // Check if company is verified before allowing publishing
        if (!$company->isVerified()) {
            return back()->with('error', 'Perusahaan Anda belum terverifikasi. Silakan lengkapi proses verifikasi terlebih dahulu.');
        }

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
