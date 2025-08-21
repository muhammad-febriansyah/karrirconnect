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
        
        // Check if company has enough points
        if ($company->job_posting_points < 1) {
            return redirect()->route('company.points.packages')
                ->with('error', 'Poin tidak mencukupi untuk posting lowongan. Silakan beli paket poin terlebih dahulu.');
        }

        $categories = JobCategory::orderBy('name')->get();
        $skills = Skill::orderBy('name')->get();

        return Inertia::render('company/jobs/create', [
            'categories' => $categories,
            'skills' => $skills,
            'company' => $company
        ]);
    }

    public function store(Request $request)
    {
        $company = auth()->user()->company;
        
        // Check if company has enough points
        if ($company->job_posting_points < 1) {
            return back()->with('error', 'Poin tidak mencukupi untuk posting lowongan.');
        }

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

            // Deduct points if job is published
            if ($validated['status'] === 'published') {
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
            }
        });

        return redirect()->route('company.jobs.index')
            ->with('success', 'Lowongan berhasil dibuat!');
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
}