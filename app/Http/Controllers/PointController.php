<?php

namespace App\Http\Controllers;

use App\Models\PointPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointController extends Controller
{
    public function index()
    {
        $packages = PointPackage::active()
            ->orderBy('price')
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'description' => $package->description,
                    'points' => $package->points,
                    'price' => $package->price,
                    'bonus_points' => $package->bonus_points,
                    'is_featured' => $package->is_featured,
                    'features' => $package->features,
                    'total_points' => $package->total_points,
                    'formatted_price' => $package->formatted_price,
                ];
            });

        return Inertia::render('points/index', [
            'packages' => $packages
        ]);
    }
}