<?php

namespace App\Events;

use App\Models\JobApplication;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JobApplicationStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public JobApplication $jobApplication;
    public string $oldStatus;
    public string $newStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(JobApplication $jobApplication, string $oldStatus, string $newStatus)
    {
        $this->jobApplication = $jobApplication;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }
}
