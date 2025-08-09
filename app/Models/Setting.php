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
        'yt',
        'ig',
        'fb',
        'tiktok',
        'fee',
        'logo',
        'thumbnail',
    ];

    protected $casts = [
        'fee' => 'integer',
    ];
}
