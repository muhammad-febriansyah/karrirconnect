<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'vision',
        'mission',
        'values',
        'features',
        'stats',
        'team',
        'contact',
        'cta_title',
        'cta_description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'values' => 'array',
            'features' => 'array',
            'stats' => 'array',
            'team' => 'array',
            'contact' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
