<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobCategory;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobListingsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        // Company admin can only see their company's job listings
        $query = JobListing::with(['company', 'category', 'skills'])
            ->withCount('applications')
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

        $jobListings = $query->paginate(5)->withQueryString();

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

            if (!$company->canCreateJobListing()) {
                return redirect()->route('company.points.packages')
                    ->with('error', 'Poin tidak cukup! Dibutuhkan 1 poin untuk memposting lowongan. Silakan lakukan top up terlebih dahulu.');
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

        // Get all skills
        $skills = \App\Models\Skill::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/job-listings/create', [
            'categories' => $categories,
            'companies' => $companies,
            'userCompany' => $userCompany,
            'skills' => $skills,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
            'employment_type' => 'required|in:full_time,part_time,contract,internship,freelance',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'location' => 'required|string|max:255',
            'work_arrangement' => 'required|in:onsite,remote,hybrid',
            'skills' => 'array',
            'benefits' => 'nullable|string',
            'positions_available' => 'integer|min:1',
        ]);

        // Company admin can only create for their company
        if ($user->role === 'company_admin') {
            $validated['company_id'] = $user->company_id;

            // Check again before creating
            $company = $user->company;

            if (!$company->is_verified || $company->verification_status !== 'verified') {
                return redirect()->route('admin.company.verify')
                    ->with('error', 'Perusahaan Anda harus diverifikasi terlebih dahulu sebelum dapat membuat lowongan pekerjaan.');
            }

            if (!$company->canCreateJobListing()) {
                return redirect()->route('company.points.packages')
                    ->with('error', 'Poin tidak cukup! Dibutuhkan 1 poin untuk memposting lowongan. Sisa poin Anda: ' . $company->job_posting_points);
            }
        }

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            if (!Storage::disk('public')->exists('job-banners')) {
                Storage::disk('public')->makeDirectory('job-banners');
            }
            $bannerPath = $request->file('banner_image')->store('job-banners', 'public');
            $validated['banner_image'] = $bannerPath;
        }

        $validated['status'] = 'draft'; // Default status
        $validated['created_by'] = $user->id;
        $validated['positions_available'] = $validated['positions_available'] ?? 1; // Default 1 position like Glints

        $jobListing = JobListing::create($validated);

        // Deduct point for company admin
        if ($user->role === 'company_admin' && $jobListing->status === 'published' && !$jobListing->points_deducted_at) {
            $company = $user->company;
            if (!$company->deductJobPostingPoint($jobListing)) {
                $jobListing->update(['status' => 'draft']);

                return redirect()->route('admin.job-listings.index')
                    ->with('error', 'Poin tidak mencukupi untuk mempublikasikan lowongan. Lowongan disimpan sebagai draft.');
            }
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
        $skills = \App\Models\Skill::where('is_active', true)->orderBy('name')->get();

        $userCompany = null;
        if ($user->role === 'company_admin' && $user->company) {
            $userCompany = [
                'id' => $user->company->id,
                'name' => $user->company->name,
                'job_posting_points' => $user->company->job_posting_points,
                'active_job_posts' => $user->company->jobListings()->where('status', 'published')->count(),
            ];
        }

        return Inertia::render('admin/job-listings/edit', [
            'jobListing' => $jobListing,
            'categories' => $categories,
            'companies' => $companies,
            'skills' => $skills,
            'userCompany' => $userCompany,
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
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
            'employment_type' => 'required|in:full_time,part_time,contract,internship,freelance',
            'experience_level' => 'required|in:entry,mid,senior,executive',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'location' => 'required|string|max:255',
            'work_arrangement' => 'required|in:onsite,remote,hybrid',
            'skills' => 'array',
            'benefits' => 'nullable|string',
            'positions_available' => 'integer|min:1',
            'status' => 'required|in:draft,published,closed,archived',
        ]);

        // Company admin can only update their own company
        if ($user->role === 'company_admin') {
            $validated['company_id'] = $user->company_id;
        }

        // Handle banner image upload
        if ($request->hasFile('banner_image')) {
            // Delete old banner image if exists
            if ($jobListing->banner_image && Storage::disk('public')->exists($jobListing->banner_image)) {
                Storage::disk('public')->delete($jobListing->banner_image);
            }

            if (!Storage::disk('public')->exists('job-banners')) {
                Storage::disk('public')->makeDirectory('job-banners');
            }
            $bannerPath = $request->file('banner_image')->store('job-banners', 'public');
            $validated['banner_image'] = $bannerPath;
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

        $company = $jobListing->company;

        if ($jobListing->status === 'published') {
            $jobListing->update(['status' => 'closed']);

            if ($company && $company->active_job_posts > 0) {
                $company->decrement('active_job_posts');
            }

            return redirect()->back()
                ->with('success', 'Lowongan berhasil ditutup.');
        }

        if ($company) {
            if (!$jobListing->points_deducted_at) {
                if (!$company->deductJobPostingPoint($jobListing)) {
                    return redirect()->back()
                        ->with('error', 'Poin tidak mencukupi untuk mempublikasikan lowongan. Silakan lakukan top up terlebih dahulu.');
                }
            } else {
                $company->increment('active_job_posts');
            }
        }

        $jobListing->update(['status' => 'published']);

        return redirect()->back()
            ->with('success', 'Lowongan berhasil dipublikasikan.');
    }
}
