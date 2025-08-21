<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'requirements',
        'benefits',
        'employment_type',
        'work_arrangement',
        'experience_level',
        'salary_min',
        'salary_max',
        'salary_currency',
        'location',
        'salary_negotiable',
        'application_deadline',
        'positions_available',
        'status',
        'featured',
        'views_count',
        'applications_count',
        'company_id',
        'job_category_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'salary_negotiable' => 'boolean',
            'application_deadline' => 'date',
            'featured' => 'boolean',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(JobCategory::class, 'job_category_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'job_listing_skill')
            ->withPivot('required', 'proficiency_level')
            ->withTimestamps();
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_jobs')
            ->withTimestamps();
    }

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function reports()
    {
        return $this->hasMany(JobReport::class);
    }

    public function scopePublished(Builder $query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured(Builder $query)
    {
        return $query->where('featured', true);
    }

    public function scopeActive(Builder $query)
    {
        return $query->published()
            ->where(function ($q) {
                $q->whereNull('application_deadline')
                  ->orWhere('application_deadline', '>=', now());
            });
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function incrementApplications()
    {
        $this->increment('applications_count');
    }

    public function isActive()
    {
        return $this->status === 'published' && 
               ($this->application_deadline === null || $this->application_deadline >= now());
    }

    public function canAcceptApplications()
    {
        return $this->isActive() && 
               $this->applications()->where('status', '!=', 'rejected')->count() < $this->positions_available;
    }

    public function getRemainingPositionsAttribute()
    {
        $acceptedApplications = $this->applications()->where('status', '!=', 'rejected')->count();
        return max(0, $this->positions_available - $acceptedApplications);
    }

    public function getIsFullyBookedAttribute()
    {
        return $this->applications()->where('status', '!=', 'rejected')->count() >= $this->positions_available;
    }
}
