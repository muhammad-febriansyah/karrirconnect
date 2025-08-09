<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_skill')
            ->withPivot('proficiency_level', 'years_of_experience')
            ->withTimestamps();
    }

    public function jobListings()
    {
        return $this->belongsToMany(JobListing::class, 'job_listing_skill')
            ->withPivot('required', 'proficiency_level')
            ->withTimestamps();
    }
}
