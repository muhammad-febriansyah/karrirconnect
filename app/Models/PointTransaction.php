<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PointTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'point_package_id',
        'type',
        'points',
        'amount',
        'description',
        'reference_type',
        'reference_id',
        'payment_method',
        'payment_reference',
        'status',
        'metadata',
        'expires_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
        'expires_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function pointPackage()
    {
        return $this->belongsTo(PointPackage::class);
    }

    public function reference()
    {
        return $this->morphTo();
    }

    public function getFormattedAmountAttribute()
    {
        return $this->amount ? 'Rp ' . number_format($this->amount, 0, ',', '.') : null;
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCredits($query)
    {
        return $query->where('points', '>', 0);
    }

    public function scopeDebits($query)
    {
        return $query->where('points', '<', 0);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}