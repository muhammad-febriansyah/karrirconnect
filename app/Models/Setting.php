<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'site_name',
        'keyword',
        'email',
        'address',
        'phone',
        'description',
        'x',
        'linkedin',
        'ig',
        'fb',
        'tiktok',
        'fee',
        'logo',
        'thumbnail',
        'favicon',
        'hero_image',
        'hero_title',
        'hero_subtitle',
        'use_custom_stats',
        'custom_total_jobs',
        'custom_total_companies',
        'custom_total_candidates',
    ];

    protected $casts = [
        'fee' => 'integer',
        'use_custom_stats' => 'boolean',
        'custom_total_jobs' => 'integer',
        'custom_total_companies' => 'integer',
        'custom_total_candidates' => 'integer',
    ];
}
