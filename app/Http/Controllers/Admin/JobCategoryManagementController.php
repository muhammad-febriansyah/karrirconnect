<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class JobCategoryManagementController extends Controller
{
    public function __construct()
    {
        // Constructor
    }

    public function index(Request $request)
    {
        $query = JobCategory::withCount(['jobListings'])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                $q->where('is_active', $status === 'active');
            });

        $perPage = $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 15, 25, 50]) ? $perPage : 10;

        $categories = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/job-categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/job-categories/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:job_categories',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|file|mimes:png,jpg,jpeg,svg|max:2048', // 2MB max - use 'file' instead of 'image' for SVG
            'is_active' => 'boolean',
        ]);

        $imagePath = null;

        // Handle file upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('job-categories', $imageName, 'public');
        }

        JobCategory::create([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => Str::slug($request->name),
            'icon' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('admin.job-categories.index')
            ->with('success', 'Job category created successfully.');
    }

    public function show(JobCategory $jobCategory)
    {
        $jobCategory->load(['jobListings' => function ($query) {
            $query->with('company')->latest()->limit(10);
        }]);

        $jobCategory->loadCount('jobListings');

        return Inertia::render('admin/job-categories/show', [
            'category' => $jobCategory,
        ]);
    }

    public function edit(JobCategory $jobCategory)
    {
        return Inertia::render('admin/job-categories/edit', [
            'category' => $jobCategory,
        ]);
    }

    public function update(Request $request, JobCategory $jobCategory)
    {
        // Debug logging (temporarily disabled)
        // Log::info('Update request data:', $request->all());
        // Log::info('Current category data:', $jobCategory->toArray());

        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('job_categories')->ignore($jobCategory->id)],
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|file|mimes:png,jpg,jpeg,svg|max:2048', // 2MB max - use 'file' instead of 'image' for SVG
            'is_active' => 'boolean',
        ]);

        $imagePath = $jobCategory->icon;

        // Handle file upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($jobCategory->icon && Storage::disk('public')->exists($jobCategory->icon)) {
                Storage::disk('public')->delete($jobCategory->icon);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('job-categories', $imageName, 'public');
        }

        // Prepare update data - keep existing values if not provided
        $updateData = [
            'name' => $request->filled('name') ? $request->name : $jobCategory->name,
            'description' => $request->has('description') ? $request->description : $jobCategory->description,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $jobCategory->is_active,
            'icon' => $imagePath,
        ];

        // Update slug only if name changed
        if ($request->filled('name') && $request->name !== $jobCategory->name) {
            $updateData['slug'] = Str::slug($request->name);
        }

        $jobCategory->update($updateData);

        return redirect()->route('admin.job-categories.index')
            ->with('success', 'Job category updated successfully.');
    }

    public function destroy(JobCategory $jobCategory)
    {
        // Check if category has associated jobs
        if ($jobCategory->jobListings()->count() > 0) {
            return back()->with('error', 'Cannot delete category that has associated job listings.');
        }

        // Delete associated image if exists
        if ($jobCategory->icon && Storage::disk('public')->exists($jobCategory->icon)) {
            Storage::disk('public')->delete($jobCategory->icon);
        }

        $jobCategory->delete();

        return redirect()->route('admin.job-categories.index')
            ->with('success', 'Job category deleted successfully.');
    }

    public function toggleStatus(JobCategory $jobCategory)
    {
        $jobCategory->update(['is_active' => !$jobCategory->is_active]);

        return back()->with(
            'success',
            $jobCategory->is_active ? 'Category activated successfully.' : 'Category deactivated successfully.'
        );
    }
}
