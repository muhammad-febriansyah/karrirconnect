<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuccessStory extends Model
{
    protected $fillable = [
        'name',
        'position',
        'company',
        'story',
        'avatar',
        'location',
        'experience_years',
        'salary_before',
        'salary_after',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'salary_before' => 'decimal:2',
        'salary_after' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    public function getSalaryIncreasePercentageAttribute()
    {
        if (!$this->salary_before || !$this->salary_after) {
            return null;
        }

        return round((($this->salary_after - $this->salary_before) / $this->salary_before) * 100);
    }
}
