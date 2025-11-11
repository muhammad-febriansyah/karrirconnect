<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\JobInvitation;
use App\Models\JobListing;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class JobInvitationController extends Controller
{
    public function index(Request $request)
    {
        $company = auth()->user()->company;

        // Get filter parameters
        $search = $request->get('search');
        $status = $request->get('status');
        $perPage = $request->get('per_page', 10);

        // Optimized query using JOIN instead of whereHas for better performance
        $query = JobInvitation::query()
            ->select([
                'job_invitations.*',
                'users.name as candidate_name',
                'users.email as candidate_email',
                'job_listings.title as job_title',
                'job_listings.slug as job_slug'
            ])
            ->join('users', 'job_invitations.candidate_id', '=', 'users.id')
            ->leftJoin('job_listings', 'job_invitations.job_listing_id', '=', 'job_listings.id')
            ->where('job_invitations.company_id', $company->id);

        // Optimized search using direct JOIN columns
        if ($search) {
            $searchTerm = '%' . $search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('users.name', 'like', $searchTerm)
                    ->orWhere('users.email', 'like', $searchTerm)
                    ->orWhere('job_listings.title', 'like', $searchTerm)
                    ->orWhere('job_invitations.message', 'like', $searchTerm);
            });
        }

        // Apply status filter
        if ($status && $status !== 'all') {
            $query->where('job_invitations.status', $status);
        }

        // Get paginated results
        $invitations = $query->orderBy('job_invitations.created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Transform data to match expected structure
        $invitations->getCollection()->transform(function ($invitation) {
            return [
                'id' => $invitation->id,
                'status' => $invitation->status,
                'message' => $invitation->message,
                'created_at' => $invitation->created_at,
                'responded_at' => $invitation->responded_at,
                'candidate' => [
                    'id' => $invitation->candidate_id,
                    'name' => $invitation->candidate_name,
                    'email' => $invitation->candidate_email,
                ],
                'jobListing' => $invitation->job_listing_id ? [
                    'id' => $invitation->job_listing_id,
                    'title' => $invitation->job_title,
                    'slug' => $invitation->job_slug,
                ] : null,
                'sender' => [
                    'id' => $invitation->sent_by,
                    'name' => 'Company Admin', // We can optimize this later if needed
                ],
            ];
        });

        // Cached stats for better performance
        $cacheKey = "company_invitation_stats_{$company->id}";
        $stats = Cache::remember($cacheKey, 300, function () use ($company) { // 5 minute cache
            return [
                'total_invitations' => $company->jobInvitations()->count(),
                'pending_invitations' => $company->jobInvitations()->where('status', 'pending')->count(),
                'accepted_invitations' => $company->jobInvitations()->where('status', 'accepted')->count(),
                'declined_invitations' => $company->jobInvitations()->where('status', 'declined')->count(),
            ];
        });

        return Inertia::render('company/job-invitations/index', [
            'invitations' => $invitations,
            'stats' => $stats,
            'company' => $company,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ]
        ]);
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            if ($user->role !== 'company_admin' || !$user->company) {
                abort(403);
            }

            $company = $user->company;

            // Check if company is verified
            if (!$company->isVerified()) {
                return redirect()->back()
                    ->with('error', 'Perusahaan harus diverifikasi terlebih dahulu untuk dapat mengirim job invitation.');
            }

            $validated = $request->validate([
                'candidate_id' => 'required|exists:users,id',
                'job_listing_id' => 'nullable|exists:job_listings,id',
                'message' => 'nullable|string|max:500',
            ]);

            $candidate = User::where('id', $validated['candidate_id'])
                ->where('role', 'user')
                ->firstOrFail();

            $jobListing = null;

            if (!empty($validated['job_listing_id'])) {
                $jobListing = JobListing::where('id', $validated['job_listing_id'])
                    ->where('company_id', $company->id)
                    ->firstOrFail();
            }

            if (!$company->hasAvailablePoints()) {
                return redirect()->back()
                    ->with('error', 'Poin tidak mencukupi untuk mengirim job invitation. Silakan lakukan top up terlebih dahulu.');
            }

            // Check for existing pending invitation only (allow re-inviting declined candidates)
            $existingInvitation = JobInvitation::where('company_id', $company->id)
                ->where('candidate_id', $candidate->id)
                ->when($jobListing, fn ($query) => $query->where('job_listing_id', $jobListing->id))
                ->where('status', JobInvitation::STATUS_PENDING)
                ->first();

            if ($existingInvitation) {
                return redirect()->back()
                    ->with('warning', 'Anda sudah mengirim job invitation kepada kandidat ini dan masih menunggu respon.');
            }

            $invitation = null;

            DB::transaction(function () use ($company, $candidate, $jobListing, $validated, $user, &$invitation) {
                $invitation = JobInvitation::create([
                    'company_id' => $company->id,
                    'job_listing_id' => $jobListing?->id,
                    'candidate_id' => $candidate->id,
                    'sent_by' => $user->id,
                    'message' => $validated['message'] ?? null,
                    'status' => JobInvitation::STATUS_PENDING,
                ]);

                $pointsDeducted = $company->deductJobInvitationPoint($invitation);

                if (!$pointsDeducted) {
                    throw new \RuntimeException('insufficient_points');
                }

                // Invalidate cache after new invitation
                $cacheKey = "company_invitation_stats_{$company->id}";
                Cache::forget($cacheKey);
            });

            Notification::create([
                'type' => 'job_invitation',
                'title' => 'Job Invitation Baru',
                'message' => $jobListing
                    ? "{$company->name} mengundang Anda untuk posisi {$jobListing->title}."
                    : "{$company->name} mengirimkan job invitation untuk Anda.",
                'target_roles' => ['user'],
                'target_user_id' => $candidate->id,
                'priority' => 'medium',
                'action_url' => route('user.job-invitations.index'),
                'created_by' => $user->id,
                'data' => [
                    'invitation_id' => $invitation?->id,
                    'company_id' => $company->id,
                    'job_listing_id' => $jobListing?->id,
                ],
            ]);

            return redirect()->back()
                ->with('success', 'Job invitation berhasil dikirim.');

        } catch (\RuntimeException $exception) {
            if ($exception->getMessage() === 'insufficient_points') {
                return redirect()->back()
                    ->with('error', 'Poin tidak mencukupi untuk mengirim job invitation. Silakan lakukan top up terlebih dahulu.');
            }
            throw $exception;
        } catch (\Exception $e) {
            \Log::error('JobInvitation error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function talentDatabase(Request $request)
    {
        $company = auth()->user()->company;

        $search = $request->get('search');
        $location = $request->get('location');
        $open = $request->get('open');

        $usersQuery = User::where('role', 'user')
            ->where('is_active', true)
            ->with([
                'userProfile',
                'applications.jobListing',
                'jobInvitations' => function ($query) use ($company) {
                    $query->where('company_id', $company->id)
                          ->orderBy('created_at', 'desc')
                          ->limit(1);
                }
            ]);

        if ($search) {
            $like = "%{$search}%";
            $usersQuery->where(function ($q) use ($like) {
                $q->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhereHas('userProfile', function ($qp) use ($like) {
                        $qp->where('first_name', 'like', $like)
                            ->orWhere('last_name', 'like', $like)
                            ->orWhere('bio', 'like', $like)
                            ->orWhere('current_position', 'like', $like);
                    });
            });
        }

        if ($location || $open !== null) {
            $usersQuery->whereHas('userProfile', function ($qp) use ($location, $open) {
                if ($location) {
                    $qp->where('location', 'like', "%{$location}%");
                }
                if ($open !== null && $open !== '') {
                    $value = in_array(strtolower((string) $open), ['1', 'true', 'yes']) ? 1 : 0;
                    $qp->where('open_to_work', $value);
                }
            });
        }

        $users = $usersQuery
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Filter options (distinct values)
        $locations = DB::table('user_profiles')
            ->whereNotNull('location')
            ->whereRaw("TRIM(location) <> ''")
            ->distinct()
            ->orderBy('location')
            ->limit(200)
            ->pluck('location');

        $experiences = collect(); // not available in current schema

        $companyJobListings = $company->jobListings()
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title']);

        return Inertia::render('company/talent-database/index', [
            'users' => $users,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'job_posting_points' => $company->job_posting_points,
                'can_invite' => $company->job_posting_points > 0 && $company->isVerified(),
                'is_verified' => $company->isVerified(),
                'verification_status' => $company->verification_status,
            ],
            'jobListings' => $companyJobListings,
            'filters' => [
                'search' => $search,
                'location' => $location,
                'open' => $open,
            ],
            'options' => [
                'locations' => $locations,
                'experiences' => $experiences,
            ],
        ]);
    }

    public function showTalentProfile(Request $request, User $user)
    {
        $company = auth()->user()->company;

        // Check if company is verified
        if (!$company->isVerified()) {
            return redirect()->route('company.talent-database')
                ->with('error', 'Anda perlu memverifikasi perusahaan terlebih dahulu untuk melihat profil kandidat.');
        }

        // Load user with necessary relationships
        $user->load([
            'userProfile',
            'applications.jobListing',
            'jobInvitations' => function ($query) use ($company) {
                $query->where('company_id', $company->id)
                      ->orderBy('created_at', 'desc');
            }
        ]);

        // Get company job listings for invitation form
        $companyJobListings = $company->jobListings()
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title']);

        return Inertia::render('company/talent-database/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'is_active' => $user->is_active,
                'user_profile' => $user->userProfile,
                'applications' => $user->applications->map(function ($app) {
                    return [
                        'id' => $app->id,
                        'job_listing' => [
                            'id' => $app->jobListing->id,
                            'title' => $app->jobListing->title,
                        ]
                    ];
                }),
                'job_invitations' => $user->jobInvitations,
            ],
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'job_posting_points' => $company->job_posting_points,
                'can_invite' => $company->job_posting_points > 0 && $company->isVerified(),
                'is_verified' => $company->isVerified(),
                'verification_status' => $company->verification_status,
            ],
            'jobListings' => $companyJobListings,
        ]);
    }
}
