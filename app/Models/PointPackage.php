<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PointPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'points',
        'price',
        'bonus_points',
        'is_active',
        'is_featured',
        'features',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'features' => 'array',
    ];

    public function pointTransactions()
    {
        return $this->hasMany(PointTransaction::class);
    }

    public function getTotalPointsAttribute()
    {
        return $this->points + $this->bonus_points;
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}