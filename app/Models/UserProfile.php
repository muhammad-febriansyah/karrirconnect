<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'bio',
        'location',
        'avatar',
        'resume',
        'portfolio_url',
        'linkedin_url',
        'github_url',
        'experience',
        'education',
        'current_position',
        'expected_salary_min',
        'expected_salary_max',
        'salary_currency',
        'open_to_work',
    ];

    protected function casts(): array
    {
        return [
            'experience' => 'array',
            'education' => 'array',
            'expected_salary_min' => 'decimal:2',
            'expected_salary_max' => 'decimal:2',
            'open_to_work' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }
}
