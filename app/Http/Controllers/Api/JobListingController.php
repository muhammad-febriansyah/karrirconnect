<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class JobListingController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::with(['company', 'category', 'skills'])
            ->active();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($companyQuery) use ($search) {
                      $companyQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('category')) {
            $query->where('job_category_id', $request->get('category'));
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->get('location') . '%');
        }

        if ($request->has('employment_type')) {
            $query->where('employment_type', $request->get('employment_type'));
        }

        if ($request->has('work_arrangement')) {
            $query->where('work_arrangement', $request->get('work_arrangement'));
        }

        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->get('experience_level'));
        }

        if ($request->has('salary_min')) {
            $query->where('salary_max', '>=', $request->get('salary_min'));
        }

        if ($request->has('salary_max')) {
            $query->where('salary_min', '<=', $request->get('salary_max'));
        }

        if ($request->has('skills')) {
            $skills = is_array($request->get('skills')) 
                ? $request->get('skills') 
                : explode(',', $request->get('skills'));
            
            $query->whereHas('skills', function ($skillQuery) use ($skills) {
                $skillQuery->whereIn('skills.id', $skills);
            });
        }

        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        if ($sortBy === 'featured') {
            $query->orderBy('featured', 'desc')
                  ->orderBy('created_at', 'desc');
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        $perPage = min($request->get('per_page', 15), 50);
        $jobs = $query->paginate($perPage);

        return response()->json($jobs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'employment_type' => 'required|in:Full-time,Part-time,Contract,Internship',
            'work_arrangement' => 'required|in:Remote,On-site,Hybrid',
            'experience_level' => 'required|in:Entry,Mid,Senior,Lead',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_currency' => 'string|size:3',
            'location' => 'required|string|max:255',
            'salary_negotiable' => 'boolean',
            'application_deadline' => 'nullable|date|after:today',
            'positions_available' => 'integer|min:1',
            'company_id' => 'required|exists:companies,id',
            'job_category_id' => 'required|exists:job_categories,id',
            'skills' => 'array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.required' => 'boolean',
            'skills.*.proficiency_level' => 'nullable|in:Beginner,Intermediate,Advanced',
        ]);

        $job = JobListing::create(array_merge(
            $request->only([
                'title', 'description', 'requirements', 'benefits',
                'employment_type', 'work_arrangement', 'experience_level',
                'salary_min', 'salary_max', 'salary_currency', 'location',
                'salary_negotiable', 'application_deadline', 'positions_available',
                'company_id', 'job_category_id'
            ]),
            ['created_by' => auth()->id()]
        ));

        if ($request->has('skills')) {
            $skillsData = [];
            foreach ($request->get('skills') as $skill) {
                $skillsData[$skill['id']] = [
                    'required' => $skill['required'] ?? true,
                    'proficiency_level' => $skill['proficiency_level'] ?? null,
                ];
            }
            $job->skills()->attach($skillsData);
        }

        return response()->json(
            $job->load(['company', 'category', 'skills', 'creator']),
            Response::HTTP_CREATED
        );
    }

    public function show(JobListing $jobListing)
    {
        $jobListing->load([
            'company', 
            'category', 
            'skills', 
            'creator',
            'applications' => function ($query) {
                $query->where('user_id', auth()->id());
            }
        ]);
        
        $jobListing->incrementViews();
        
        return response()->json($jobListing);
    }

    public function update(Request $request, JobListing $jobListing)
    {
        $this->authorize('update', $jobListing);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'employment_type' => 'sometimes|required|in:Full-time,Part-time,Contract,Internship',
            'work_arrangement' => 'sometimes|required|in:Remote,On-site,Hybrid',
            'experience_level' => 'sometimes|required|in:Entry,Mid,Senior,Lead',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_currency' => 'sometimes|string|size:3',
            'location' => 'sometimes|required|string|max:255',
            'salary_negotiable' => 'boolean',
            'application_deadline' => 'nullable|date',
            'positions_available' => 'sometimes|integer|min:1',
            'status' => Rule::in(['draft', 'published', 'closed', 'paused']),
            'featured' => 'boolean',
            'skills' => 'array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.required' => 'boolean',
            'skills.*.proficiency_level' => 'nullable|in:Beginner,Intermediate,Advanced',
        ]);

        $jobListing->update($request->only([
            'title', 'description', 'requirements', 'benefits',
            'employment_type', 'work_arrangement', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency', 'location',
            'salary_negotiable', 'application_deadline', 'positions_available',
            'status', 'featured'
        ]));

        if ($request->has('skills')) {
            $skillsData = [];
            foreach ($request->get('skills') as $skill) {
                $skillsData[$skill['id']] = [
                    'required' => $skill['required'] ?? true,
                    'proficiency_level' => $skill['proficiency_level'] ?? null,
                ];
            }
            $jobListing->skills()->sync($skillsData);
        }

        return response()->json(
            $jobListing->load(['company', 'category', 'skills', 'creator'])
        );
    }

    public function destroy(JobListing $jobListing)
    {
        $this->authorize('delete', $jobListing);
        
        $jobListing->delete();
        
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function apply(Request $request, JobListing $jobListing)
    {
        $request->validate([
            'cover_letter' => 'nullable|string|max:5000',
            'resume_path' => 'nullable|string',
            'additional_documents' => 'nullable|array',
            'additional_documents.*' => 'string',
        ]);

        if (!$jobListing->isActive()) {
            return response()->json([
                'message' => 'This job is no longer accepting applications.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $application = $jobListing->applications()->create([
            'user_id' => auth()->id(),
            'cover_letter' => $request->get('cover_letter'),
            'resume_path' => $request->get('resume_path'),
            'additional_documents' => $request->get('additional_documents', []),
        ]);

        $jobListing->incrementApplications();

        return response()->json(
            $application->load(['user.profile', 'jobListing']),
            Response::HTTP_CREATED
        );
    }

    public function toggleSave(JobListing $jobListing)
    {
        $user = auth()->user();
        
        if ($user->savedJobs()->where('job_listing_id', $jobListing->id)->exists()) {
            $user->savedJobs()->detach($jobListing->id);
            $saved = false;
        } else {
            $user->savedJobs()->attach($jobListing->id);
            $saved = true;
        }
        
        return response()->json([
            'saved' => $saved,
            'message' => $saved ? 'Job saved successfully' : 'Job removed from saved list'
        ]);
    }
}
