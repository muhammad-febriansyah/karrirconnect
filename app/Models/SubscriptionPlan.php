<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'job_posting_limit',
        'featured_job_limit',
        'auto_promote',
        'premium_badge',
        'analytics_access',
        'priority_support',
        'talent_database_access',
        'job_invitation_limit',
        'features',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_monthly' => 'decimal:2',
            'price_yearly' => 'decimal:2',
            'auto_promote' => 'boolean',
            'premium_badge' => 'boolean',
            'analytics_access' => 'boolean',
            'priority_support' => 'boolean',
            'talent_database_access' => 'boolean',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get all company subscriptions for this plan
     */
    public function companySubscriptions()
    {
        return $this->hasMany(CompanySubscription::class);
    }

    /**
     * Check if plan has unlimited job postings
     */
    public function hasUnlimitedJobPostings(): bool
    {
        return $this->job_posting_limit === null;
    }

    /**
     * Get yearly discount percentage
     */
    public function getYearlyDiscountAttribute(): float
    {
        if ($this->price_monthly == 0 || $this->price_yearly == 0) {
            return 0;
        }

        $monthlyTotal = $this->price_monthly * 12;
        $savings = $monthlyTotal - $this->price_yearly;
        
        return round(($savings / $monthlyTotal) * 100, 0);
    }

    /**
     * Scope for active plans
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
