<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\Company;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['company', 'jobCategory'])
            ->withCount(['applications'])
            ->when($request->search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($companyQ) use ($search) {
                      $companyQ->where('name', 'like', "%{$search}%");
                  });
            })
            ->when($request->status, function ($q, $status) {
                $q->where('is_active', $status === 'active');
            })
            ->when($request->featured, function ($q, $featured) {
                $q->where('is_featured', $featured === 'true');
            })
            ->when($request->category, function ($q, $category) {
                $q->where('job_category_id', $category);
            });

        $jobs = $query->latest()->paginate(15);

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'status', 'featured', 'category']),
            'categories' => JobCategory::where('is_active', true)->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Jobs/Create', [
            'companies' => Company::where('is_active', true)->get(),
            'categories' => JobCategory::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'location' => 'required|string|max:255',
            'employment_type' => 'required|in:full_time,part_time,contract,freelance,internship',
            'experience_level' => 'required|in:entry,junior,mid,senior,lead,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_currency' => 'required|string|max:3',
            'is_remote' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date|after:today',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
        ]);

        JobListing::create($request->all());

        return redirect()->route('admin.jobs.index')
            ->with('success', 'Job listing created successfully.');
    }

    public function show(JobListing $job)
    {
        $job->load(['company', 'jobCategory', 'skills', 'applications.user']);

        return Inertia::render('Admin/Jobs/Show', [
            'job' => $job,
        ]);
    }

    public function edit(JobListing $job)
    {
        $job->load(['skills']);

        return Inertia::render('Admin/Jobs/Edit', [
            'job' => $job,
            'companies' => Company::where('is_active', true)->get(),
            'categories' => JobCategory::where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, JobListing $job)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'location' => 'required|string|max:255',
            'employment_type' => 'required|in:full_time,part_time,contract,freelance,internship',
            'experience_level' => 'required|in:entry,junior,mid,senior,lead,executive',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_currency' => 'required|string|max:3',
            'is_remote' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date|after:today',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
        ]);

        $job->update($request->all());

        return redirect()->route('admin.jobs.index')
            ->with('success', 'Job listing updated successfully.');
    }

    public function destroy(JobListing $job)
    {
        $job->delete();

        return redirect()->route('admin.jobs.index')
            ->with('success', 'Job listing deleted successfully.');
    }

    public function toggleFeatured(JobListing $job)
    {
        $job->update(['is_featured' => !$job->is_featured]);
        
        return back()->with('success', $job->is_featured ? 'Job featured successfully.' : 'Job unfeatured successfully.');
    }
}
