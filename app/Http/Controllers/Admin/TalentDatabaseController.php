<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobInvitation;
use App\Models\User;
use App\Models\Skill;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TalentDatabaseController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        if ($user->role !== 'company_admin' || !$user->company) {
            abort(403);
        }

        $company = $user->company;

        $search = $request->input('search');
        $skillIds = array_filter((array) $request->input('skills')); // expecting array of skill IDs
        $location = $request->input('location');
        $openToWork = $request->boolean('open_to_work');

        $query = User::query()
            ->with(['profile', 'skills'])
            ->where('role', 'user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('profile', function ($profileQuery) use ($search) {
                      $profileQuery->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('bio', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($skillIds)) {
            $query->whereHas('skills', function ($skillQuery) use ($skillIds) {
                $skillQuery->whereIn('skills.id', $skillIds);
            });
        }

        if ($location) {
            $query->whereHas('profile', function ($profileQuery) use ($location) {
                $profileQuery->where('location', 'like', "%{$location}%");
            });
        }

        if ($request->has('open_to_work')) {
            $query->whereHas('profile', function ($profileQuery) use ($openToWork) {
                $profileQuery->where('open_to_work', $openToWork);
            });
        }

        $candidates = $query
            ->orderBy('updated_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        $invitations = JobInvitation::query()
            ->where('company_id', $company->id)
            ->whereIn('candidate_id', $candidates->getCollection()->pluck('id'))
            ->latest()
            ->get()
            ->groupBy('candidate_id');

        $candidateData = $candidates->getCollection()->map(function (User $candidate) use ($invitations) {
            $invitation = $invitations->get($candidate->id)?->first();

            return [
                'id' => $candidate->id,
                'name' => $candidate->name,
                'email' => $candidate->email,
                'created_at' => $candidate->created_at,
                'profile' => $candidate->profile ? [
                    'full_name' => trim(($candidate->profile->first_name ?? '') . ' ' . ($candidate->profile->last_name ?? '')),
                    'first_name' => $candidate->profile->first_name,
                    'last_name' => $candidate->profile->last_name,
                    'phone' => $candidate->profile->phone,
                    'location' => $candidate->profile->location,
                    'bio' => $candidate->profile->bio,
                    'open_to_work' => (bool) $candidate->profile->open_to_work,
                    'current_position' => $candidate->profile->current_position,
                    'avatar_url' => $candidate->profile->avatar_url,
                    'experience_level' => $candidate->profile->experience_level ?? null,
                    'expected_salary_min' => $candidate->profile->expected_salary_min,
                    'expected_salary_max' => $candidate->profile->expected_salary_max,
                ] : null,
                'skills' => $candidate->skills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                ]),
                'invitation' => $invitation ? [
                    'id' => $invitation->id,
                    'status' => $invitation->status,
                    'job_listing_id' => $invitation->job_listing_id,
                    'responded_at' => $invitation->responded_at,
                ] : null,
            ];
        });

        $candidates->setCollection($candidateData);

        $skills = Skill::orderBy('name')->get(['id', 'name']);

        $jobListings = JobListing::where('company_id', $company->id)
            ->orderByDesc('created_at')
            ->get(['id', 'title', 'status']);

        return Inertia::render('admin/talent-database/index', [
            'candidates' => $candidates,
            'filters' => [
                'search' => $search,
                'skills' => $skillIds,
                'location' => $location,
                'open_to_work' => $request->has('open_to_work') ? ($openToWork ? '1' : '0') : null,
            ],
            'skills' => Skill::orderBy('name')->get(['id', 'name']),
            'jobListings' => $jobListings,
        ]);
    }

    public function show(User $user): Response
    {
        $authUser = Auth::user();

        if ($authUser->role !== 'company_admin' || !$authUser->company) {
            abort(403);
        }

        // Hanya izinkan melihat profil kandidat (role user)
        if ($user->role !== 'user') {
            abort(404);
        }

        $company = $authUser->company;

        $user->loadMissing(['profile', 'skills']);

        $candidate = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'created_at' => $user->created_at,
            'auth_provider' => $user->auth_provider ?? null,
            'profile' => $user->profile ? [
                'full_name' => trim(($user->profile->first_name ?? '') . ' ' . ($user->profile->last_name ?? '')),
                'first_name' => $user->profile->first_name,
                'last_name' => $user->profile->last_name,
                'phone' => $user->profile->phone,
                'location' => $user->profile->location,
                'bio' => $user->profile->bio,
                'open_to_work' => (bool) $user->profile->open_to_work,
                'current_position' => $user->profile->current_position,
                'avatar_url' => $user->profile->avatar_url,
                'experience_level' => $user->profile->experience_level ?? null,
                'expected_salary_min' => $user->profile->expected_salary_min,
                'expected_salary_max' => $user->profile->expected_salary_max,
            ] : null,
            'skills' => $user->skills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
            ]),
        ];

        $jobListings = JobListing::where('company_id', $company->id)
            ->orderByDesc('created_at')
            ->get(['id', 'title', 'status']);

        return Inertia::render('admin/talent-database/profile', [
            'user' => $candidate,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'job_posting_points' => $company->job_posting_points,
                'can_invite' => $company->job_posting_points > 0,
            ],
            'jobListings' => $jobListings,
        ]);
    }
}
