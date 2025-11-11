<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CompanySubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'subscription_plan_id',
        'status',
        'start_date',
        'end_date',
        'billing_cycle',
        'amount_paid',
        'payment_method',
        'transaction_id',
        'auto_renew',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'amount_paid' => 'decimal:2',
            'auto_renew' => 'boolean',
            'cancelled_at' => 'datetime',
        ];
    }

    /**
     * Get the company that owns this subscription
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the subscription plan
     */
    public function subscriptionPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->end_date >= Carbon::today();
    }

    /**
     * Check if subscription is expired
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired' 
            || ($this->status === 'active' && $this->end_date < Carbon::today());
    }

    /**
     * Check if subscription is expiring soon (within 7 days)
     */
    public function isExpiringSoon(): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        return $this->end_date->diffInDays(Carbon::today()) <= 7;
    }

    /**
     * Get days remaining
     */
    public function getDaysRemainingAttribute(): int
    {
        if ($this->end_date < Carbon::today()) {
            return 0;
        }

        return $this->end_date->diffInDays(Carbon::today());
    }

    /**
     * Cancel subscription
     */
    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
            'auto_renew' => false,
        ]);
    }

    /**
     * Renew subscription
     */
    public function renew(): void
    {
        $newEndDate = $this->billing_cycle === 'monthly' 
            ? $this->end_date->addMonth()
            : $this->end_date->addYear();

        $this->update([
            'status' => 'active',
            'end_date' => $newEndDate,
        ]);
    }

    /**
     * Scope for active subscriptions
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('end_date', '>=', Carbon::today());
    }

    /**
     * Scope for expiring soon subscriptions
     */
    public function scopeExpiringSoon($query, int $days = 7)
    {
        return $query->where('status', 'active')
            ->whereBetween('end_date', [
                Carbon::today(),
                Carbon::today()->addDays($days)
            ]);
    }
}
