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
        'email',
        'phone',
        'social_links',
        'is_verified',
        'is_active',
        'job_posting_points',
        'total_job_posts',
        'active_job_posts',
        'max_active_jobs',
        'points_last_updated',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
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

    public function canCreateJobListing()
    {
        return $this->job_posting_points > 0 && $this->active_job_posts < $this->max_active_jobs;
    }

    public function deductJobPostingPoint()
    {
        if ($this->job_posting_points > 0) {
            $this->decrement('job_posting_points');
            $this->increment('total_job_posts');
            $this->increment('active_job_posts');
            
            // Record the transaction
            $this->pointTransactions()->create([
                'type' => 'usage',
                'points' => -1,
                'description' => 'Menggunakan 1 poin untuk posting lowongan',
                'reference_type' => 'job_listing',
                'status' => 'completed',
            ]);
            
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
