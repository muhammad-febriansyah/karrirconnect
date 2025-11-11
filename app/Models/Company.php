<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\JobListing;
use App\Models\JobInvitation;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'website',
        'logo',
        'industry',
        'size',
        'location',
        'address',
        'email',
        'phone',
        'social_links',
        'slug',
        'admin_user_id',
        'verification_status',
        'verification_documents',
        'verification_data',
        'is_verified',
        'is_active',
        'job_posting_points',
        'total_job_posts',
        'active_job_posts',
        'max_active_jobs',
        'points_last_updated',
    ];

    protected $appends = [
        'logo_url',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'verification_documents' => 'array',
            'verification_data' => 'array',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'points_last_updated' => 'datetime',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }

    public function publishedJobs()
    {
        return $this->jobListings()->where('status', 'published');
    }

    public function activeJobs()
    {
        return $this->publishedJobs()->where('application_deadline', '>=', now());
    }

    public function pointTransactions()
    {
        return $this->hasMany(PointTransaction::class);
    }

    public function jobInvitations()
    {
        return $this->hasMany(JobInvitation::class);
    }

    public function completedPointTransactions()
    {
        return $this->pointTransactions()->completed();
    }

    public function subscriptions()
    {
        return $this->hasMany(CompanySubscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(CompanySubscription::class)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->latest('end_date');
    }

    public function hasAvailablePoints(int $points = 1): bool
    {
        return $this->job_posting_points >= $points;
    }

    public function canCreateJobListing(): bool
    {
        return $this->hasAvailablePoints() && $this->isVerified();
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    public function canPostJob(): bool
    {
        return $this->isVerified() && $this->hasAvailablePoints();
    }

    public function usePoints(int $points, string $description, ?string $referenceType = null, ?int $referenceId = null, array $metadata = []): bool
    {
        if (!$this->hasAvailablePoints($points)) {
            return false;
        }

        $this->decrement('job_posting_points', $points);
        $this->update(['points_last_updated' => now()]);

        $this->pointTransactions()->create([
            'type' => 'usage',
            'points' => -$points,
            'description' => $description,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'status' => 'completed',
            'metadata' => $metadata,
        ]);

        return true;
    }

    public function deductJobPostingPoint(?JobListing $jobListing = null): bool
    {
        $used = $this->usePoints(
            1,
            'Menggunakan 1 poin untuk memposting lowongan',
            'job_listing',
            $jobListing?->id
        );

        if ($used) {
            $this->increment('total_job_posts');
            $this->increment('active_job_posts');

            if ($jobListing && !$jobListing->points_deducted_at) {
                $jobListing->forceFill([
                    'points_deducted_at' => now(),
                ])->save();
            }
        }

        return $used;
    }

    public function deductJobInvitationPoint(?JobInvitation $invitation = null): bool
    {
        return $this->usePoints(
            1,
            'Menggunakan 1 poin untuk mengirim job invitation',
            'job_invitation',
            $invitation?->id
        );
    }

    public function addPoints($points, $description = '', $metadata = [])
    {
        $this->increment('job_posting_points', $points);
        $this->update(['points_last_updated' => now()]);
        
        return $this->pointTransactions()->create([
            'type' => 'purchase',
            'points' => $points,
            'description' => $description ?: "Menambah {$points} poin",
            'status' => 'completed',
            'metadata' => $metadata,
        ]);
    }

    public function getPointsBalanceAttribute()
    {
        return $this->job_posting_points;
    }

    /**
     * Get the full URL for the company logo
     */
    public function getLogoUrlAttribute()
    {
        if ($this->logo) {
            return asset('storage/' . $this->logo);
        }
        return null;
    }

    /**
     * Check if company has an active premium subscription
     */
    public function hasPremiumSubscription(): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->isActive();
    }

    /**
     * Get current subscription plan
     */
    public function getCurrentPlan(): ?SubscriptionPlan
    {
        $subscription = $this->activeSubscription;
        return $subscription ? $subscription->subscriptionPlan : null;
    }

    /**
     * Check if company can auto-promote jobs
     */
    public function canAutoPromote(): bool
    {
        $plan = $this->getCurrentPlan();
        return $plan && $plan->auto_promote;
    }

    /**
     * Check if company has premium badge
     */
    public function hasPremiumBadge(): bool
    {
        $plan = $this->getCurrentPlan();
        return $plan && $plan->premium_badge;
    }

    /**
     * Check if company has analytics access
     */
    public function hasAnalyticsAccess(): bool
    {
        $plan = $this->getCurrentPlan();
        return $plan && $plan->analytics_access;
    }

    /**
     * Check if company can post more jobs
     */
    public function canPostMoreJobs(): bool
    {
        $plan = $this->getCurrentPlan();

        if (!$plan) {
            // Free tier - use existing points system
            return $this->hasAvailablePoints();
        }

        // Check if unlimited
        if ($plan->job_posting_limit === null) {
            return true;
        }

        // Check against limit
        return $this->active_job_posts < $plan->job_posting_limit;
    }

    /**
     * Get remaining job posts
     */
    public function getRemainingJobPostsAttribute(): ?int
    {
        $plan = $this->getCurrentPlan();

        if (!$plan || $plan->job_posting_limit === null) {
            return null; // Unlimited or no plan
        }

        return max(0, $plan->job_posting_limit - $this->active_job_posts);
    }
}
