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
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
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
}
