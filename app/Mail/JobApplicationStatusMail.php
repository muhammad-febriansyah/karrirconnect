<?php

namespace App\Mail;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public JobApplication $jobApplication;
    public string $status;

    /**
     * Create a new message instance.
     */
    public function __construct(JobApplication $jobApplication, string $status)
    {
        $this->jobApplication = $jobApplication;
        $this->status = $status;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $statusTitles = [
            'hired' => 'Selamat! Lamaran Anda Diterima',
            'rejected' => 'Update Status Lamaran Anda',
            'interview' => 'Undangan Interview - Lamaran Anda',
            'reviewing' => 'Lamaran Anda Sedang Ditinjau',
            'shortlisted' => 'Lamaran Anda Masuk Shortlist',
        ];

        $subject = $statusTitles[$this->status] ?? 'Update Status Lamaran Anda';

        return new Envelope(
            subject: $subject . ' - ' . $this->jobApplication->jobListing->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.job-application-status',
            with: [
                'jobApplication' => $this->jobApplication,
                'status' => $this->status,
                'jobListing' => $this->jobApplication->jobListing,
                'company' => $this->jobApplication->jobListing->company,
                'user' => $this->jobApplication->user,
            ],
        );
    }
}
