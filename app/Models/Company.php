<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'points_last_updated',
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

    public function completedPointTransactions()
    {
        return $this->pointTransactions()->completed();
    }

    public function canCreateJobListing($positions = 1)
    {
        $pointsNeeded = $positions > 1 ? $positions - 1 : 0; // First position is free
        return $this->job_posting_points >= $pointsNeeded; // Removed max_active_jobs limit
    }

    public function deductJobPostingPoint($positions = 1)
    {
        $pointsNeeded = $positions > 1 ? $positions - 1 : 0; // First position is free
        
        if ($this->job_posting_points >= $pointsNeeded) {
            if ($pointsNeeded > 0) {
                $this->decrement('job_posting_points', $pointsNeeded);
                
                // Record the transaction only if points were deducted
                $this->pointTransactions()->create([
                    'type' => 'usage',
                    'points' => -$pointsNeeded,
                    'description' => "Menggunakan {$pointsNeeded} poin untuk {$positions} posisi lowongan (1 posisi gratis)",
                    'reference_type' => 'job_listing',
                    'status' => 'completed',
                ]);
            }
            
            $this->increment('total_job_posts');
            $this->increment('active_job_posts');
            
            return true;
        }
        
        return false;
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
}
