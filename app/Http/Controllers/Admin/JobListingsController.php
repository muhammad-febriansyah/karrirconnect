<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobListingsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Company admin can only see their company's job listings
        $query = JobListing::with(['company', 'category', 'skills'])
            ->when($user->role === 'company_admin' && $user->company_id, function ($q) use ($user) {
                $q->where('company_id', $user->company_id);
            })
            ->when($request->search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->when($request->category, function ($q, $category) {
                $q->where('job_category_id', $category);
            })
            ->when($request->employment_type, function ($q, $type) {
                $q->where('employment_type', $type);
            })
            ->orderBy('created_at', 'desc');

        $jobListings = $query->paginate(10)->withQueryString();

        $filters = $request->only(['search', 'status', 'category', 'employment_type']);

        $categories = JobCategory::where('is_active', true)->get();

        return Inertia::render('admin/job-listings/index', [
            'jobListings' => $jobListings,
            'filters' => $filters,
            'categories' => $categories,
            'userRole' => $user->role,
            'company' => $user->role === 'company_admin' ? $user->company : null,
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        // Company admin can only create for their company
        if ($user->role === 'company_admin' && !$user->company_id) {
            return redirect()->route('admin.job-listings.index')
                ->with('error', 'Anda harus terhubung dengan perusahaan untuk membuat lowongan.');
        }

        // Check if company admin has verified company and sufficient points
        if ($user->role === 'company_admin') {
            $company = $user->company;

            // Check if company is verified
            if (!$company->is_verified || $company->verification_status !== 'verified') {
                return redirect()->route('admin.company.verify')
                    ->with('error', 'Perusahaan Anda harus diverifikasi terlebih dahulu sebelum dapat membuat lowongan pekerjaan. Silakan lengkapi proses verifikasi.');
            }

            if (!$company->canCreateJobListing(1)) { // Check for minimum 1 position
                return redirect()->route('company.points.packages')
                    ->with('error', 'Poin tidak cukup! Untuk membuat lowongan dengan beberapa posisi dibutuhkan poin tambahan. Sisa poin Anda: ' . $company->job_posting_points);
            }
        }

        $categories = JobCategory::where('is_active', true)->get();
        $companies = $user->role === 'super_admin'
            ? Company::where('is_active', true)->get()
            : Company::where('id', $user->company_id)->get();

        // Prepare userCompany data with real-time active job count
        $userCompany = null;
        if ($user->role === 'company_admin' && $user->company) {
            $company = $user->company;
            
            // Get real-time active job count
            $activeJobsCount = $company->jobListings()
                ->where('status', 'published')
                ->count();
            
            $userCompany = [
                'id' => $company->id,
                'name' => $company->name,
                'job_posting_points' => $company->job_posting_points,
                'active_job_posts' => $activeJobsCount,
            ];
        }

        return Inertia::render('admin/job-listings/create', [
            'categories' => $categories,
            'companies' => $companies,
            'userCompany' => $userCompany,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
            'employment_type' => 'required|in:full_time,part_time,contract,internship,freelance',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'location' => 'required|string|max:255',
            'work_arrangement' => 'required|in:onsite,remote,hybrid',
            'skills' => 'array',
            'benefits' => 'array',
            'positions_available' => 'integer|min:1',
        ]);

        // Company admin can only create for their company
        if ($user->role === 'company_admin') {
            $validated['company_id'] = $user->company_id;

            // Check again before creating with actual positions count
            $company = $user->company;

            // Double-check verification status
            if (!$company->is_verified || $company->verification_status !== 'verified') {
                return redirect()->route('admin.company.verify')
                    ->with('error', 'Perusahaan Anda harus diverifikasi terlebih dahulu sebelum dapat membuat lowongan pekerjaan.');
            }

            $positions = (int)($validated['positions_available'] ?? 1);
            if (!$company->canCreateJobListing($positions)) {
                $pointsNeeded = $positions > 1 ? $positions - 1 : 0;
                return redirect()->route('company.points.packages')
                    ->with('error', "Poin tidak cukup! Untuk {$positions} posisi dibutuhkan {$pointsNeeded} poin (1 posisi gratis). Sisa poin Anda: {$company->job_posting_points}");
            }
        }

        $validated['status'] = 'draft'; // Default status
        $validated['created_by'] = $user->id;
        $validated['positions_available'] = $validated['positions_available'] ?? 1; // Default 1 position like Glints

        $jobListing = JobListing::create($validated);

        // Deduct point for company admin based on positions
        if ($user->role === 'company_admin') {
            $company = $user->company;
            $positions = (int)($validated['positions_available'] ?? 1);
            $company->deductJobPostingPoint($positions);
        }

        // Attach skills if provided
        if ($request->has('skills')) {
            $jobListing->skills()->attach($request->skills);
        }

        return redirect()->route('admin.job-listings.index')
            ->with('success', 'Lowongan pekerjaan berhasil dibuat.');
    }

    public function show(JobListing $jobListing)
    {
        $user = Auth::user();

        // Company admin can only view their company's job listings
        if ($user->role === 'company_admin' && $jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        $jobListing->load(['company', 'category', 'skills', 'creator']);

        return Inertia::render('admin/job-listings/show', [
            'jobListing' => $jobListing,
            'userRole' => $user->role,
        ]);
    }

    public function edit(JobListing $jobListing)
    {
        $user = Auth::user();

        // Company admin can only edit their company's job listings
        if ($user->role === 'company_admin' && $jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        $categories = JobCategory::where('is_active', true)->get();
        $companies = $user->role === 'super_admin'
            ? Company::where('is_active', true)->get()
            : Company::where('id', $user->company_id)->get();

        $jobListing->load(['skills']);

        return Inertia::render('admin/job-listings/edit', [
            'jobListing' => $jobListing,
            'categories' => $categories,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, JobListing $jobListing)
    {
        $user = Auth::user();

        // Company admin can only update their company's job listings
        if ($user->role === 'company_admin' && $jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
            'employment_type' => 'required|in:full_time,part_time,contract,internship,freelance',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'location' => 'required|string|max:255',
            'work_arrangement' => 'required|in:onsite,remote,hybrid',
            'skills' => 'array',
            'benefits' => 'array',
            'positions_available' => 'integer|min:1',
            'status' => 'required|in:draft,published,closed,archived',
        ]);

        // Company admin can only update their own company
        if ($user->role === 'company_admin') {
            $validated['company_id'] = $user->company_id;
        }

        $jobListing->update($validated);

        // Sync skills
        if ($request->has('skills')) {
            $jobListing->skills()->sync($request->skills);
        }

        return redirect()->route('admin.job-listings.index')
            ->with('success', 'Lowongan pekerjaan berhasil diperbarui.');
    }

    public function destroy(JobListing $jobListing)
    {
        $user = Auth::user();

        // Company admin can only delete their company's job listings
        if ($user->role === 'company_admin' && $jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        $jobListing->delete();

        return redirect()->route('admin.job-listings.index')
            ->with('success', 'Lowongan pekerjaan berhasil dihapus.');
    }

    public function toggleStatus(JobListing $jobListing)
    {
        $user = Auth::user();

        // Company admin can only toggle their company's job listings
        if ($user->role === 'company_admin' && $jobListing->company_id !== $user->company_id) {
            abort(403, 'Unauthorized');
        }

        $newStatus = $jobListing->status === 'published' ? 'closed' : 'published';
        $jobListing->update(['status' => $newStatus]);

        return redirect()->back()
            ->with('success', 'Status lowongan pekerjaan berhasil diubah.');
    }
}
