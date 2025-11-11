<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobInvitation;
use App\Models\JobListing;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobInvitationController extends Controller
{
    public function store(Request $request)
    {
        try {
            \Log::info('JobInvitation store method called', $request->all());

            $user = Auth::user();

            if ($user->role !== 'company_admin' || !$user->company) {
                abort(403);
            }

            $company = $user->company;

            $validated = $request->validate([
                'candidate_id' => 'required|exists:users,id',
                'job_listing_id' => 'nullable|exists:job_listings,id',
                'message' => 'nullable|string|max:500',
            ]);

            \Log::info('Validation passed', $validated);

            $candidate = User::where('id', $validated['candidate_id'])
                ->where('role', 'user')
                ->firstOrFail();

            \Log::info('Candidate found', ['candidate_id' => $candidate->id, 'name' => $candidate->name]);

            $jobListing = null;

            if (!empty($validated['job_listing_id'])) {
                $jobListing = JobListing::where('id', $validated['job_listing_id'])
                    ->where('company_id', $company->id)
                    ->firstOrFail();
                \Log::info('Job listing found', ['job_listing_id' => $jobListing->id, 'title' => $jobListing->title]);
            } else {
                \Log::info('No job listing specified');
            }

            \Log::info('Checking company points', ['points' => $company->job_posting_points]);

            if (!$company->hasAvailablePoints()) {
                return redirect()->back()
                    ->with('error', 'Poin tidak mencukupi untuk mengirim job invitation. Silakan lakukan top up terlebih dahulu.');
            }

            $existingInvitation = JobInvitation::where('company_id', $company->id)
                ->where('candidate_id', $candidate->id)
                ->when($jobListing, fn ($query) => $query->where('job_listing_id', $jobListing->id))
                ->where('status', JobInvitation::STATUS_PENDING)
                ->first();

            if ($existingInvitation) {
                return redirect()->back()
                    ->with('warning', 'Anda sudah mengirim job invitation kepada kandidat ini.');
            }

            $invitation = null;

            DB::transaction(function () use ($company, $candidate, $jobListing, $validated, $user, &$invitation) {
                \Log::info('Creating job invitation', [
                    'company_id' => $company->id,
                    'job_listing_id' => $jobListing?->id,
                    'candidate_id' => $candidate->id,
                    'sent_by' => $user->id,
                    'message' => $validated['message'] ?? null,
                ]);

                $invitation = JobInvitation::create([
                    'company_id' => $company->id,
                    'job_listing_id' => $jobListing?->id,
                    'candidate_id' => $candidate->id,
                    'sent_by' => $user->id,
                    'message' => $validated['message'] ?? null,
                    'status' => JobInvitation::STATUS_PENDING,
                ]);

                \Log::info('Job invitation created', ['invitation_id' => $invitation->id]);

                $pointsDeducted = $company->deductJobInvitationPoint($invitation);
                \Log::info('Points deduction result', ['success' => $pointsDeducted]);

                if (!$pointsDeducted) {
                    throw new \RuntimeException('insufficient_points');
                }
            });

            \Log::info('Job invitation transaction completed successfully');

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
}