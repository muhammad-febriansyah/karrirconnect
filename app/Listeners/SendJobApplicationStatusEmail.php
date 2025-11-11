<?php

namespace App\Listeners;

use App\Events\JobApplicationStatusChanged;
use App\Mail\JobApplicationStatusMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class SendJobApplicationStatusEmail
{
    /**
     * Handle the event.
     */
    public function handle(JobApplicationStatusChanged $event): void
    {
        try {
            $jobApplication = $event->jobApplication;
            $user = $jobApplication->user;
            $newStatus = $event->newStatus;

            // Only send email for meaningful status changes
            $notifiableStatuses = ['hired', 'rejected', 'interview', 'reviewing', 'shortlisted'];

            if (!in_array($newStatus, $notifiableStatuses)) {
                return;
            }

            // Send email notification to the applicant
            Mail::to($user->email)->send(
                new JobApplicationStatusMail($jobApplication, $newStatus)
            );

            Log::info('Job application status email sent', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'application_id' => $jobApplication->id,
                'new_status' => $newStatus,
            ]);

        } catch (Exception $e) {
            Log::error('Failed to send job application status email', [
                'error' => $e->getMessage(),
                'application_id' => $event->jobApplication->id ?? null,
            ]);
        }
    }
}
