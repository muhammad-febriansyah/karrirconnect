<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\JobInvitation;
use App\Models\Notification;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobInvitationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        $invitations = JobInvitation::with(['company', 'jobListing'])
            ->where('candidate_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('user/job-invitations/index', [
            'invitations' => $invitations,
        ]);
    }

    public function update(JobInvitation $jobInvitation, Request $request)
    {
        $user = Auth::user();

        // Debug logging
        \Log::info('Job Invitation Update Attempt', [
            'invitation_id' => $jobInvitation->id,
            'invitation_candidate_id' => $jobInvitation->candidate_id,
            'current_user_id' => $user->id,
            'current_user_role' => $user->role,
            'invitation_status' => $jobInvitation->status,
        ]);

        // Check authorization (cast to int to avoid type mismatches across environments)
        if ((int) $jobInvitation->candidate_id !== (int) $user->id) {
            \Log::warning('Job Invitation Authorization Failed', [
                'invitation_candidate_id' => $jobInvitation->candidate_id,
                'current_user_id' => $user->id,
                'invitation_candidate_id_type' => gettype($jobInvitation->candidate_id),
                'current_user_id_type' => gettype($user->id),
            ]);
            return redirect()->back()->with('error', 'Anda tidak memiliki izin untuk merespon undangan kerja ini.');
        }

        // Check if invitation is still pending
        if ($jobInvitation->status !== JobInvitation::STATUS_PENDING) {
            \Log::info('Job Invitation Already Responded', [
                'invitation_id' => $jobInvitation->id,
                'current_status' => $jobInvitation->status,
                'user_id' => $user->id,
            ]);

            $statusText = $jobInvitation->status === JobInvitation::STATUS_ACCEPTED ? 'diterima' : 'ditolak';
            return redirect()->back()
                ->with('warning', "Anda sudah {$statusText} undangan ini sebelumnya.");
        }

        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', [
                JobInvitation::STATUS_ACCEPTED,
                JobInvitation::STATUS_DECLINED,
            ]),
        ]);

        DB::transaction(function () use ($jobInvitation, $validated, $user) {
            $jobInvitation->update([
                'status' => $validated['status'],
                'responded_at' => now(),
            ]);

            // Clear company invitation stats cache
            $cacheKey = "company_invitation_stats_{$jobInvitation->company_id}";
            Cache::forget($cacheKey);

            // Notify company about the status change
            $statusText = $validated['status'] === JobInvitation::STATUS_ACCEPTED ? 'menerima' : 'menolak';
            $notificationTitle = 'Respon Job Invitation';
            $notificationMessage = "{$user->name} telah {$statusText} undangan kerja" .
                ($jobInvitation->jobListing ? " untuk posisi {$jobInvitation->jobListing->title}." : ".");

            Notification::create([
                'type' => 'job_invitation_response',
                'title' => $notificationTitle,
                'message' => $notificationMessage,
                'target_roles' => ['company_admin'],
                'target_company_id' => $jobInvitation->company_id,
                'priority' => 'medium',
                'action_url' => route('company.job-invitations.index'),
                'created_by' => $user->id,
                'data' => [
                    'invitation_id' => $jobInvitation->id,
                    'new_status' => $validated['status'],
                    'candidate_id' => $user->id,
                    'company_id' => $jobInvitation->company_id,
                    'job_listing_id' => $jobInvitation->job_listing_id,
                ],
            ]);

            // Send email notification to company if invitation is accepted
            if ($validated['status'] === JobInvitation::STATUS_ACCEPTED) {
                $this->sendInvitationAcceptedEmail($jobInvitation, $user);
            }
        });

        $message = $validated['status'] === JobInvitation::STATUS_ACCEPTED
            ? 'Undangan kerja berhasil diterima. Silakan lanjutkan proses aplikasi.'
            : 'Anda menolak undangan kerja ini.';

        return redirect()->back()->with('success', $message);
    }

    /**
     * Send email notification to company when invitation is accepted
     */
    private function sendInvitationAcceptedEmail(JobInvitation $jobInvitation, $user): void
    {
        $jobInvitation->load(['company', 'jobListing']);

        try {
            EmailService::send('employer-invitation-accepted', $jobInvitation->company->email, [
                'company_name' => $jobInvitation->company->name,
                'candidate_name' => $user->name,
                'candidate_email' => $user->email,
                'candidate_phone' => $user->profile->phone ?? '-',
                'job_title' => $jobInvitation->jobListing->title ?? 'Posisi yang tersedia',
                'acceptance_date' => now()->format('d M Y'),
                'invitation_url' => route('company.job-invitations.index'),
            ]);
            \Log::info("Invitation accepted email sent to company: {$jobInvitation->company->email}");
        } catch (\Exception $e) {
            \Log::error("Failed to send invitation accepted email: " . $e->getMessage());
        }
    }
}
