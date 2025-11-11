<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\Notification;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    /**
     * Show job application form
     */
    public function create(JobListing $job)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu untuk melamar pekerjaan.');
        }

        $user = Auth::user();

        // Check if user profile is complete
        if (!$user->hasCompleteProfile()) {
            $missingFields = $user->getMissingProfileFields();
            $missingFieldsText = implode(', ', $missingFields);
            
            return redirect()->route('user.profile.edit')
                ->with('error', "Profil Anda belum lengkap. Silakan lengkapi data berikut terlebih dahulu: {$missingFieldsText}")
                ->with('missing_fields', $missingFields);
        }

        // Check if user already applied for this job
        $existingApplication = JobApplication::where('user_id', $user->id)
            ->where('job_listing_id', $job->id)
            ->first();

        if ($existingApplication) {
            return back()->with('error', 'Anda sudah melamar pekerjaan ini sebelumnya.');
        }

        // Check if job is still active
        if ($job->status !== 'published') {
            return back()->with('error', 'Lowongan pekerjaan ini sudah tidak aktif.');
        }

        // Check if deadline has passed
        if ($job->application_deadline && now() > $job->application_deadline) {
            return back()->with('error', 'Batas waktu lamaran untuk pekerjaan ini sudah berakhir.');
        }

        $job->load(['company', 'category']);

        return Inertia::render('jobs/apply', [
            'job' => $job
        ]);
    }

    /**
     * Store job application
     */
    public function store(Request $request, JobListing $job)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu untuk melamar pekerjaan.');
        }

        $user = Auth::user();

        // Check if user profile is complete
        if (!$user->hasCompleteProfile()) {
            $missingFields = $user->getMissingProfileFields();
            $missingFieldsText = implode(', ', $missingFields);
            
            return redirect()->route('user.profile.edit')
                ->with('error', "Profil Anda belum lengkap. Silakan lengkapi data berikut terlebih dahulu: {$missingFieldsText}")
                ->with('missing_fields', $missingFields);
        }

        // Check if user already applied for this job
        $existingApplication = JobApplication::where('user_id', $user->id)
            ->where('job_listing_id', $job->id)
            ->first();

        if ($existingApplication) {
            return back()->with('error', 'Anda sudah melamar pekerjaan ini sebelumnya.');
        }

        // Validate request
        $request->validate([
            'cover_letter' => 'required|string|min:50|max:2000',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            'additional_documents.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120'
        ], [
            'cover_letter.required' => 'Surat lamaran wajib diisi.',
            'cover_letter.min' => 'Surat lamaran minimal 50 karakter.',
            'cover_letter.max' => 'Surat lamaran maksimal 2000 karakter.',
            'resume.required' => 'CV/Resume wajib diunggah.',
            'resume.mimes' => 'CV/Resume harus berformat PDF, DOC, atau DOCX.',
            'resume.max' => 'Ukuran CV/Resume maksimal 5MB.',
            'additional_documents.*.mimes' => 'Dokumen tambahan harus berformat PDF, DOC, DOCX, JPG, JPEG, atau PNG.',
            'additional_documents.*.max' => 'Ukuran dokumen tambahan maksimal 5MB.'
        ]);

        try {
            DB::beginTransaction();

            // Store resume
            $resumePath = $request->file('resume')->store('job-applications/resumes', 'public');

            // Store additional documents
            $additionalDocs = [];
            if ($request->hasFile('additional_documents')) {
                foreach ($request->file('additional_documents') as $file) {
                    $path = $file->store('job-applications/documents', 'public');
                    $additionalDocs[] = [
                        'path' => $path,
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize()
                    ];
                }
            }

            // Create job application
            $application = JobApplication::create([
                'user_id' => $user->id,
                'job_listing_id' => $job->id,
                'cover_letter' => $request->cover_letter,
                'resume_path' => $resumePath,
                'additional_documents' => $additionalDocs,
                'status' => 'pending'
            ]);

            // Note: applications_count is automatically incremented by JobApplication model events

            // Create notification for company admins
            try {
                Notification::createJobApplication($application);
            } catch (\Exception $e) {
                \Log::warning('Failed to create job application notification: ' . $e->getMessage());
            }

            // Send email notifications
            $this->sendApplicationEmails($application);

            DB::commit();

            return redirect()->route('jobs.show', $job)
                ->with('success', 'Lamaran Anda berhasil dikirim! Kami akan menghubungi Anda jika profil Anda sesuai dengan kebutuhan perusahaan.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Delete uploaded files if they exist
            if (isset($resumePath) && Storage::disk('public')->exists($resumePath)) {
                Storage::disk('public')->delete($resumePath);
            }
            
            foreach ($additionalDocs as $doc) {
                if (Storage::disk('public')->exists($doc['path'])) {
                    Storage::disk('public')->delete($doc['path']);
                }
            }

            \Log::error('Job application submission failed: ' . $e->getMessage());

            return back()->with('error', 'Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi.');
        }
    }

    /**
     * Send email notifications for job application
     */
    private function sendApplicationEmails(JobApplication $application): void
    {
        $application->load(['user.profile', 'jobListing.company']);

        $job = $application->jobListing;
        $user = $application->user;
        $company = $job->company;

        // Send email to company about new application
        try {
            EmailService::send('employer-application-received', $company->email, [
                'company_name' => $company->name,
                'job_title' => $job->title,
                'applicant_name' => $user->name,
                'applicant_email' => $user->email,
                'applicant_phone' => $user->profile->phone ?? '-',
                'application_date' => $application->created_at->format('d M Y'),
                'application_url' => route('company.jobs.show', $job->id), // Company can see applications in job detail
            ]);
            \Log::info("Application received email sent to company: {$company->email}");
        } catch (\Exception $e) {
            \Log::error("Failed to send application received email to company: " . $e->getMessage());
        }

        // Send confirmation email to applicant
        try {
            EmailService::send('employee-application-status', $user->email, [
                'user_name' => $user->name,
                'job_title' => $job->title,
                'company_name' => $company->name,
                'status' => 'Sedang Direview',
                'application_date' => $application->created_at->format('d M Y'),
                'application_url' => route('user.dashboard'), // User can see applications in dashboard
            ]);
            \Log::info("Application status email sent to user: {$user->email}");
        } catch (\Exception $e) {
            \Log::error("Failed to send application status email to user: " . $e->getMessage());
        }
    }
}
